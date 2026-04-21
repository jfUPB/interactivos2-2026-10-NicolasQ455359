const { Server } = require('node-osc');
const { WebSocketServer } = require('ws');

// ═══════════════════════════════════════════════════
// OSC Bridge v3.0 — Tormenta de Datos (p5.js Edition)
// Strudel (WebSocket 8080 / OSC 3333) → p5.js (WebSocket 3000)
// Este puente recibe las métricas de Strudel y las 
// transfiere directamente a visualesHouse.html para el Mini Domo.
// ═══════════════════════════════════════════════════

const OSC_IN_PORT = 3333;
const WS_IN_PORT = 8080;
const WS_OUT_PORT = 3000;

// Estado de niveles
let currentLevels = {
    SYNTH_PAD: 0, BASS_DRIVE: 0, KICK_BEAT: 0, HIHAT_SWARM: 0,
    DATA_NOISE: 0, GLITCH_STORM: 0, VOICE_CHOP: 0, ALARM_STATE: 0
};

// --- SERVIDOR WEBSOCKET SALIDA (Hacia p5.js en el navegador) ---
const wssOut = new WebSocketServer({ port: WS_OUT_PORT });
let p5Clients = [];

wssOut.on('connection', (ws) => {
    console.log('[+] Visuales en p5.js conectadas al puerto 3000.');
    p5Clients.push(ws);
    
    // Entregar estado actual al conectar
    ws.send(JSON.stringify({ address: '/levels', levels: currentLevels }));

    ws.on('close', () => {
        p5Clients = p5Clients.filter(client => client !== ws);
        console.log('[-] Visuales en p5.js desconectadas.');
    });
});

function broadcastToP5(data) {
    const message = JSON.stringify(data);
    p5Clients.forEach(client => {
        if (client.readyState === 1) { // 1 = OPEN
            client.send(message);
        }
    });
}

// --- PROCESAMIENTO DE MENSAJES (Común para OSC y WS) ---
function processStrudelMessage(data) {
    let rawAddress = data.address || data[0];

    // ── NIVELES DE INTENSIDAD (0-3) ──
    if (rawAddress === '/levels') {
        const levels = data.args;
        for (const [key, value] of Object.entries(levels)) {
            if (currentLevels.hasOwnProperty(key) && currentLevels[key] !== value) {
                currentLevels[key] = value;
                console.log(`[📊 NIVEL] ${key} = ${value}`);
            }
        }
        // Retransmitir niveles
        broadcastToP5({ address: '/levels', levels: currentLevels });
        return;
    }

    // ── TRIGGERS RITMICOS ──
    if (rawAddress === '/dirt/play') {
        let argsArray = data.args || data;
        let soundName = null;
        let cps = 1;

        // Extraer 's' (sonido) y 'cps' (velocidad) de Strudel
        for (let i = 0; i < argsArray.length; i++) {
            let item = argsArray[i];
            let val = item.value !== undefined ? item.value : item;
            if (val === 's' && i + 1 < argsArray.length) {
                let nextItem = argsArray[i + 1];
                soundName = nextItem.value !== undefined ? nextItem.value : nextItem;
            }
            if (val === 'cps' && i + 1 < argsArray.length) {
                let nextItem = argsArray[i + 1];
                cps = nextItem.value !== undefined ? nextItem.value : nextItem;
            }
        }

        if (soundName) {
            let channelName = '';
            
            // Asignación de canales basándonos en los bancos del código
            if (soundName.includes('saw') || soundName.includes('pad')) channelName = 'PAD';
            else if (soundName.includes('tb303') || soundName.includes('bass')) channelName = 'BASS';
            else if (soundName.includes('bd') || soundName.includes('kick')) channelName = 'KICK';
            else if (soundName.includes('hh') || soundName.includes('hat')) channelName = 'HIHAT';
            else if (soundName.includes('bleep') || soundName.includes('cpu') || soundName.includes('print')) channelName = 'DATA';
            else if (soundName.includes('glitch') || soundName.includes('hc')) channelName = 'GLITCH';
            else if (soundName.includes('vocal')) channelName = 'VOICE';
            else if (soundName.includes('sine')) channelName = 'ALARM';

            if (channelName) {
                broadcastToP5({ address: '/trigger', channel: channelName, cps: cps });
                console.log(`[⚡ TRIG] ${channelName} (${soundName})`);
            }
        }
    } else {
        // Enviar triggers o variables custom directamente
        let val = data.args ? (data.args[0].value !== undefined ? data.args[0].value : data.args[0]) : 1;
        broadcastToP5({ address: rawAddress, value: val });
    }
}


// --- SERVIDOR WEBSOCKET ENTRADA (Manejador preferido para Strudel Web) ---
const wssIn = new WebSocketServer({ port: WS_IN_PORT });

wssIn.on('connection', (ws) => {
    console.log('[+] Strudel (Web) conectado por puerto 8080.');
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            processStrudelMessage(data);
        } catch (e) {}
    });
});

// --- SERVIDOR OSC UDP ENTRADA (Soporte alternativo nativo) ---
try {
    const oscServer = new Server(OSC_IN_PORT, '127.0.0.1', () => {
        console.log(`[+] Escuchando OSC UDP en 127.0.0.1:${OSC_IN_PORT}`);
    });

    oscServer.on('message', (msg) => {
        try {
            const address = msg[0];
            const args = msg.slice(1);
            
            // Adaptar argumentos de UDP OSC a formato de Objeto JSON Strudel
            if(address === '/dirt/play') {
                const formattedArgs = [];
                for (let i = 0; i < args.length; i += 2) {
                    formattedArgs.push(args[i]);          // key
                    formattedArgs.push({ value: args[i+1] }); // value obj
                }
                processStrudelMessage({ address: address, args: formattedArgs });
            } else {
                processStrudelMessage({ address: address, args: args });
            }
        } catch(e) {}
    });
} catch(err) {
    console.log("[!] No se pudo iniciar el servidor OSC (posible uso exclusivo de WS).");
}

// Heartbeat de seguridad: Sincroniza variables a p5.js cada medio segundo
setInterval(() => {
    broadcastToP5({ address: '/levels', levels: currentLevels });
}, 500);

console.log('══════════════════════════════════════════════════════');
console.log('⚡ OSC Bridge v3.0 — Ansiedad Digital (P5.JS Edition)');
console.log(`📥 RECIBIENDO DE STRUDEL vía WS en puerto: ${WS_IN_PORT}`);
console.log(`📡 ENVIANDO A P5.JS vía WS en puerto: ${WS_OUT_PORT}`);
console.log('══════════════════════════════════════════════════════');
