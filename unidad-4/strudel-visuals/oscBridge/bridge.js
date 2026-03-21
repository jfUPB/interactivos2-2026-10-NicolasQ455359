const WebSocket = require("ws");

// ---- CONFIG ----
const STRUDEL_PORT = 8080; // Strudel -> Bridge
const P5JS_PORT = 8081;    // Bridge -> p5.js

// ---- SERVERS ----
const wssStrudel = new WebSocket.Server({ port: STRUDEL_PORT });
const wssP5 = new WebSocket.Server({ port: P5JS_PORT });

console.log("🚀 Bridge listo");
console.log(`Entrada Strudel: ws://localhost:${STRUDEL_PORT}`);
console.log(`Salida p5.js:    ws://localhost:${P5JS_PORT}`);

// ---- Normalizar mensajes ----

function normalizeMessage(raw) {

  let msg;

  try {
    msg = JSON.parse(raw);
  } catch {
    msg = {};
  }

  // detectar address
  let address =
    msg.address ||
    msg.path ||
    (msg.s ? "/" + msg.s : "/event");

  // detectar args
  let args = [];

  if (Array.isArray(msg.args)) {
    args = msg.args;
  }

  if (args.length === 0 && typeof msg === "object") {
    for (const key in msg) {
      if (key !== "address" && key !== "timestamp" && key !== "time") {
        args.push(msg[key]);
      }
    }
  }

  if (args.length === 0) {
    args = [1];
  }

  return {
    address,
    args,
    timestamp: Date.now()
  };
}

// ---- Enviar a p5 ----

function broadcastToP5(payload) {

  const data = JSON.stringify(payload);

  let count = 0;

  wssP5.clients.forEach(client => {

    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
      count++;
    }

  });

  return count;
}

// ---- Conexión Strudel ----

wssStrudel.on("connection", ws => {

  console.log("🎵 Strudel conectado");

  ws.on("message", message => {

    try {

      const normalized = normalizeMessage(message.toString());
      const sent = broadcastToP5(normalized);

      console.log(`📨 ${normalized.address} -> p5 (${sent})`);

    } catch (e) {

      console.error("Error:", e.message);

    }

  });

  ws.on("close", () => {
    console.log("⚠️ Strudel desconectado");
  });

});

// ---- Conexión p5 ----

wssP5.on("connection", ws => {

  console.log("🎮 p5.js conectado");

  ws.on("close", () => {
    console.log("⚠️ p5.js desconectado");
  });

});
