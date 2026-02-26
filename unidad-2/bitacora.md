# Unidad 2

## Bitácora de proceso de aprendizaje

## Bitácora – Caso de estudio: Strudel + p5.js

### Actividad 01

Puesta en marcha del caso de estudio

Repositorio trabajado: Strudel – p5 Tests

 Observaciones generales

Durante la puesta en marcha del caso de estudio se realizó la instalación y ejecución del entorno necesario para conectar audio generativo (Strudel) con visuales reactivas desarrolladas en p5.js. El sistema está compuesto por tres elementos principales: el motor de audio (Strudel), un puente de comunicación OSC (OSCBridge) y la aplicación visual en p5.js.

El proyecto se ejecuta localmente utilizando Node.js y el gestor de paquetes pnpm, debido a que Strudel funciona como un monorepositorio con múltiples paquetes internos.

### Problemas encontrados y soluciones

Error al ejecutar comandos en PowerShell (ExecutionPolicy):

PowerShell bloqueaba la ejecución de scripts necesarios para instalar dependencias con npm y pnpm.

Solución: Se modificó la política de ejecución usando Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned.

pnpm no reconocido en Git Bash:

Aunque pnpm estaba instalado, Git Bash no lo reconocía inicialmente.

Solución: Se habilitó corepack para activar pnpm correctamente y se reinició la terminal.

Error 404 al cargar visualesHouse.html:

El archivo HTML no era encontrado por el servidor de Strudel.

Solución: Se identificó que los archivos de p5.js debían ubicarse específicamente en la carpeta strudel/website/public/. Una vez movidos allí y reiniciado el servidor, el archivo fue accesible correctamente.

Error al abrir localhost con https:

El navegador forzaba el uso de HTTPS, lo que impedía acceder al servidor local.

Solución: Se accedió explícitamente mediante http://localhost:4321.

 Resultado

El caso de estudio quedó correctamente ejecutado, con Strudel funcionando en el navegador y los visuales en p5.js cargando a 60 FPS, confirmando que el entorno estaba correctamente configurado.

### Actividad 02

Análisis de la sincronización audio–visual

 ¿Cómo se logra la sincronización?

La sincronización entre audio y visuales en el caso de estudio se logra mediante la combinación de las siguientes herramientas y técnicas:

Strudel: genera patrones rítmicos y eventos de audio en tiempo real.

OSC (Open Sound Control): protocolo que permite enviar mensajes temporales (por ejemplo, nivel, ritmo o eventos) desde el audio hacia los visuales.

OSCBridge: actúa como intermediario entre Strudel y p5.js, recibiendo los mensajes OSC del audio y reenviándolos al entorno visual.

p5.js: interpreta los datos recibidos y los transforma en parámetros visuales como tamaño, color, movimiento o intensidad.

 Aspectos clave de sincronización

El sistema trabaja en tiempo real, con una latencia muy baja (en el caso observado, cercana a 0 ms).

Los mensajes OSC se envían de forma continua, permitiendo que cada frame visual responda inmediatamente a los cambios en el audio.

El uso de un bucle de renderizado constante en p5.js (60 FPS) garantiza fluidez visual y coherencia con el ritmo sonoro.

Esta arquitectura permite que las visuales no dependan directamente del audio como señal sonora, sino de datos temporales derivados del audio, lo que hace el sistema más estable y controlable.

### Actividad 03

Modificación del caso de estudio
 Modificación realizada

Se realizó una modificación en el comportamiento del audio en Strudel, enfocándose en variar la intensidad y complejidad rítmica del patrón sonoro. Esta modificación tiene como objetivo generar cambios más evidentes en los datos enviados por OSC, para que las visuales reaccionen de forma más clara y perceptible.

Por ejemplo, se aumentó la densidad rítmica del patrón de percusión y se ajustaron valores de ganancia para amplificar la energía transmitida hacia los visuales.

 Impacto en la sincronización audio–visual

La modificación afecta directamente la sincronización, ya que:

Al aumentar la energía del audio, los valores OSC enviados son más altos.

Las visuales responden con movimientos más amplios y cambios más notorios en pantalla.

Se refuerza la relación causa–efecto entre sonido y visual, haciendo la experiencia más coherente e inmersiva.

### código
```js
stack(
  s("bd*4").gain(1),
  s("hh*8").gain(0.4),
  s("sn*2").gain(0.8)
)
```

Este patrón incrementa la intensidad rítmica, lo que se traduce en mayor actividad visual en p5.js.

 Evidencia

Se incluyen capturas de pantalla del navegador mostrando:

La ejecución de Strudel en localhost:4321.

La visual visualesHouse.html corriendo a 60 FPS.

La terminal con OSCBridge activo.

### Conclusión general

El caso de estudio demuestra cómo es posible lograr una sincronización efectiva entre audio y visuales utilizando protocolos de comunicación en tiempo real. La separación entre generación sonora y renderizado visual permite un sistema flexible, escalable y altamente reactivo, ideal para proyectos de arte digital e interacción audiovisual.

## Bitácora de aplicación 

### Actividad 4

### Proceso de mejora de la pieza de audio

En la unidad anterior desarrollé una pieza musical interactiva basada en un sistema de variaciones tipo videojuego. La estructura estaba dividida en cinco capas principales:

Drone (ambiente)

Kick (movimiento)

Hats (tensión rítmica)

Melodía (emoción / narrativa)

Eventos (peligro / acción)

Cada capa tenía cuatro posibles estados (0–3), controlados mediante variables como:

```js
let DRONE_SCORE = 0
let KICK_SCORE = 0
let HAT_SCORE = 0
let MELODY_SCORE = 0
let EVENT_SCORE = 1
```

La mejora consistió en transformar la pieza de audio en un sistema audiovisual, donde cada evento musical genera una reacción visual específica.

La música dejó de ser solo sonora y pasó a convertirse en el motor del comportamiento visual.

### Incorporación de visuales reactivas

Para lograr esto, implementé un sistema compuesto por tres partes:

Strudel (motor musical)

Bridge WebSocket (puente de comunicación)

p5.js (motor visual)

### Implementación de la sincronización
 Envío de eventos desde Strudel

Cada capa musical se envía al sistema visual utilizando .osc():

```js
$: stack(
  DRONE.osc(),
  KICK.osc(),
  HATS.osc(),
  MELODY.osc(),
  EVENTS.osc()
)
```

El método .osc() no modifica el sonido, sino que envía cada evento musical como mensaje JSON a través del WebSocket.

Cada vez que suena:

bd → se envía como tr909bd

hh → se envía como tr909hh

sd → se envía como tr909sd

notas → se envían como valores MIDI (p.n o p.midinote)

 Recepción en visuales (p5.js)

En visualesHouse.html, se abre una conexión:

ws = new WebSocket("ws://localhost:8081");


Los eventos recibidos se almacenan en una cola (eventQueue) junto con su timestamp.

 Sistema de sincronización temporal

Para evitar desfase entre audio y visual, implementé un sistema de compensación de reloj:
```js
const target = ev.timestamp + clockOffset;
if(now >= target){
    applyAudioEvent(ev.params);
}
```

Esto permite:

Ajustar la diferencia entre el reloj del navegador y el del servidor

Reducir el delta de sincronización

Ejecutar el evento visual exactamente cuando debe ocurrir

El valor lastDelta mide el error en milisegundos.

### Traducción del audio en comportamiento visual

La función principal es:
```js
applyAudioEvent(p)
```

Según el sonido recibido, se activan distintos efectos:

Evento musical	Acción visual
bd (kick)	Pulso central grande
hh (hats)	Barras laterales + chispas
sd (snare)	Flash blanco + anillo
notas (melodía)	Spawn de partículas tipo “pickup”

Además, se implementó un sistema de biomas (0–3) que modifica:

Paleta de colores

Intensidad de niebla

Cantidad de lluvia

Densidad de partículas

Ambiente general

Esto permite que el universo visual cambie dinámicamente según el estado musical.

### Resultado de la mejora

La pieza evolucionó de:

 Música interactiva con variaciones a Sistema audiovisual tipo videojuego reactivo

Modifica el entorno completo

### Conclusión

La sincronización entre audio y visuales se logró mediante:

Envío de eventos con .osc()

Comunicación WebSocket

Sistema de compensación temporal (clockOffset)

Cola ordenada por timestamp

Ejecución controlada en draw()

El resultado es una obra audiovisual donde sonido y visual funcionan como un único sistema integrado en tiempo real.

COdigo strudel:

```js
setcpm(112/4)

// 0–3 (cambia estos valores para tus “variaciones del videojuego”)
let DRONE_SCORE = 3
let KICK_SCORE = 0
let HAT_SCORE = 0
let MELODY_SCORE = 0
let EVENT_SCORE = 1

/* ---------- DRONE ---------- */
const droneScores = [
  "c3 ~ g3 ~",
  "c3 ~ g3 bb3",
  "c3 eb3 g3 ~",
  "c3 g3 bb3 eb4"
]

const DRONE =
  note(droneScores[DRONE_SCORE])
    .sound("triangle")
    .gain(0.12)
    .lpf(1000)
    .room(0.7)

/* ---------- KICK ---------- */
const kickScores = [
  "~ ~ ~ ~",
  "bd ~ ~ ~",
  "bd ~ bd ~",
  "bd*4"
]

const KICK =
  sound(kickScores[KICK_SCORE])
    .bank("tr909")
    .gain(0.7)

/* ---------- HATS ---------- */
const hatScores = [
  "~ ~ ~ ~",
  "~ hh ~ hh",
  "hh hh ~ hh",
  "hh*8"
]

const HATS =
  sound(hatScores[HAT_SCORE])
    .bank("tr909")
    .gain(0.35)
    .lpf(7000)

/* ---------- MELODÍA ---------- */
const melodyScores = [
  "~ ~ ~ ~",
  "~ e4 ~ g4",
  "g4 ~ f4 ~",
  "<e4 g4 bb4>*2"
]

const MELODY =
  note(melodyScores[MELODY_SCORE])
    .sound("sine")
    .gain(0.18)
    .lpf(3500)
    .room(0.5)

/* ---------- EVENTOS ---------- */
const eventScores = [
  "~ ~ ~ ~",
  "~ sd ~ ~",
  "sd ~ sd ~",
  "sd(3,8)"
]

const EVENTS =
  sound(eventScores[EVENT_SCORE])
    .bank("tr909")
    .gain(0.4)
    .speed("1.4")

/* ---------- AUDIO (suena) ---------- */
$: stack(
  DRONE,
  KICK,
  HATS,
  MELODY,
  EVENTS
).gain(0.9)

/* ---------- VISUALES (manda al bridge) ---------- */
$: stack(
  DRONE.osc(),
  KICK.osc(),
  HATS.osc(),
  MELODY.osc(),
  EVENTS.osc()
)
```
Codigo visuales
```HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <script src="https://cdn.jsdelivr.net/npm/p5@1.9.0/lib/p5.min.js"></script>
    <style>
        body {
            margin: 0;
            overflow: hidden;
            background: #000;
        }

        canvas {
            display: block;
        }
    </style>
</head>
<body>
    <script>
        /* =========================
           PLATFORMER "TOON" GAME VISUALS (p5)
           WS: ws://localhost:8081

           ✅ NUEVO:
           - Strudel puede forzar bioma con p.biome (0..3)
           - Si llega p.biome => se cambia SCENE inmediatamente
           - (Opcional) Auto por densidad queda DESACTIVADO por defecto

           Audio mapping:
           - bd -> jump
           - hh/oh -> run pulse + footsteps
           - sd/cp -> shoot
           - melody (p.n / p.midinote) -> spawn pickups
           - bioma 0..3 -> cambia paleta + niebla + partículas + dificultad
        ========================= */

        let ws, wsOk = false;
        let eventQueue = [];
        let clockOffset = 0, offsetInit = false;
        let lastDelta = 0;
        let lastMsgAt = 0, lastPreview = "(aún nada)";

        // ---- BIOMAS ----
        let SCENE = 0;                 // 0..3
        let AUTO_SCENE = false;        // ✅ por defecto OFF (porque ahora lo controla Strudel)
        let density = 0, densitySmooth = 0;

        let sceneFlash = 0, sceneTitleTimer = 0;

        // ---- WORLD + CAMERA ----
        let worldW = 5200;
        let camX = 0;
        let platforms = [];

        // ---- ENTITIES ----
        let player;
        let enemies = [];
        let pickups = [];
        let bullets = [];
        let particles = [];

        // ---- GAME VARS ----
        let score = 0;
        let hp = 100;
        let combo = 0, comboTimer = 0;
        let shake = 0;

        // ---- TRIGGERS ----
        let trigKick = 0, trigHat = 0, trigSnare = 0, trigMelody = 0;

        // ---- LIMITS ----
        const MAX_ENEMIES = 18;
        const MAX_PICKUPS = 12;
        const MAX_PARTICLES = 140;
        const MAX_BULLETS = 28;

        // ---- GAME OVER ----
        let gameOver = false;
        let restartTimer = 0;
        let glitchAmt = 0;

        function setup() {
            createCanvas(windowWidth, windowHeight);
            frameRate(60);
            textFont("monospace");

            buildLevel(0);
            player = new Player(120, groundY() - 140);

            connectWS();
        }

        function groundY() { return height * 0.78; }

        function buildLevel(scene) {
            platforms = [];
            platforms.push(new Platform(0, groundY(), worldW, 90));

            randomSeed(scene * 999 + 123);

            for (let i = 0; i < 26; i++) {
                const w = random(140, 280);
                const x = 280 + i * 180 + random(-40, 40);
                const y = groundY() - random(120, 320);
                platforms.push(new Platform(x, y, w, 22));
            }

            platforms.push(new Platform(1200, groundY() - 220, 420, 22));
            platforms.push(new Platform(2100, groundY() - 260, 340, 22));
            platforms.push(new Platform(3200, groundY() - 200, 520, 22));
            platforms.push(new Platform(4100, groundY() - 280, 360, 22));
        }

        /* =========================
           WS
        ========================= */
        function connectWS() {
            ws = new WebSocket("ws://localhost:8081");
            ws.onopen = () => wsOk = true;
            ws.onclose = () => wsOk = false;
            ws.onerror = () => wsOk = false;

            ws.onmessage = (event) => {
                lastMsgAt = Date.now();
                const msg = JSON.parse(event.data);

                let p = {};
                if (Array.isArray(msg.args)) {
                    for (let i = 0; i < msg.args.length; i += 2) {
                        p[msg.args[i]] = msg.args[i + 1];
                    }
                }

                lastPreview = `biome:${p.biome ?? "-"} cps:${p.cps ?? "?"} cycle:${p.cycle ?? "?"} delta:${p.delta ?? "?"} s:${p.s ?? "-"} bank:${p.bank ?? "-"}`;

                const now = Date.now();
                const ts = msg.timestamp ?? now;

                const measured = now - ts;
                if (!offsetInit) { clockOffset = measured; offsetInit = true; }
                else { clockOffset = lerp(clockOffset, measured, 0.03); }

                eventQueue.push({ timestamp: ts, params: p });
                eventQueue.sort((a, b) => a.timestamp - b.timestamp);
            };
        }

        /* =========================
           MAIN LOOP
        ========================= */
        function draw() {
            const now = Date.now();

            // measure density (only if AUTO_SCENE is enabled)
            density = lerp(density, eventQueue.length, 0.15);
            densitySmooth = lerp(densitySmooth, density, 0.08);

            // process events
            while (eventQueue.length > 0) {
                const ev = eventQueue[0];
                const target = ev.timestamp + clockOffset;
                if (now >= target) {
                    eventQueue.shift();
                    lastDelta = now - target;
                    applyAudioEvent(ev.params);
                } else break;
            }

            // decay triggers
            trigKick *= 0.70;
            trigHat *= 0.80;
            trigSnare *= 0.75;
            trigMelody *= 0.85;

            if (comboTimer > 0) comboTimer--;
            else combo = 0;

            shake *= 0.85;
            sceneFlash *= 0.86;
            if (sceneTitleTimer > 0) sceneTitleTimer--;

            // game over
            if (gameOver) {
                glitchAmt = lerp(glitchAmt, 1, 0.05);

                renderGame();
                renderHUD();
                renderGameOverOverlay();

                restartTimer--;
                if (restartTimer <= 0) hardRestart();
                return;
            } else {
                glitchAmt = lerp(glitchAmt, 0, 0.08);
            }

            // update
            updateGame();

            // render
            renderGame();
            renderHUD();
        }

        /* =========================
           AUDIO -> GAME
        ========================= */
        function applyAudioEvent(p) {

            // ✅ NUEVO: BIOMA forzado desde Strudel
            // p.biome puede llegar como string o número
            if (p.biome !== undefined) {
                const b = constrain(parseInt(p.biome, 10), 0, 3);
                if (!Number.isNaN(b) && b !== SCENE) {
                    onSceneChange(SCENE, b);
                    SCENE = b;
                }
            }

            // (Opcional) auto scene por densidad (si lo activas con tecla A)
            if (AUTO_SCENE) {
                const prev = SCENE;
                if (densitySmooth < 3) SCENE = 0;
                else if (densitySmooth < 7) SCENE = 1;
                else if (densitySmooth < 12) SCENE = 2;
                else SCENE = 3;
                if (prev !== SCENE) onSceneChange(prev, SCENE);
            }

            const s = (p.s ?? "").toString();

            // Kick => jump
            if (s.includes("tr909bd") || s === "bd") {
                trigKick = 1;
                player.tryJump(true);
                shake = max(shake, 2.5);
            }

            // Hats => run
            if (s.includes("tr909hh") || s.includes("tr909oh") || s === "hh" || s === "oh") {
                trigHat = 1;
                player.runPulse();
                spawnFootDust(player.x + player.w * 0.5, player.y + player.h - 6, 5);
                addCombo(1);
            }

            // Snare/Clap => shoot
            if (s.includes("tr909sd") || s.includes("tr909cp") || s === "sd" || s === "cp") {
                trigSnare = 1;
                player.shoot();
                addCombo(2);
                shake = max(shake, 3.5);
            }

            // Melody => pickup
            if (p.n !== undefined || p.midinote !== undefined) {
                trigMelody = 1;
                spawnPickups(1);
                addCombo(1);
            }
        }

        function addCombo(v) {
            combo += v;
            comboTimer = 60;
            score += v * (1 + floor(combo / 6));
        }

        /* =========================
           SCENE CHANGE
        ========================= */
        function onSceneChange(prev, next) {
            sceneFlash = 1;
            sceneTitleTimer = 95;
            shake = max(shake, 6);

            buildLevel(next);

            // “cambia el universo”
            if (next === 0) {
                enemies.length = 0;
                pickups.length = 0;
                spawnPickups(5);
            }
            if (next === 1) {
                pickups.length = 0;
                spawnPickups(4);
                spawnEnemies(3);
            }
            if (next === 2) {
                spawnEnemies(6);
            }
            if (next === 3) {
                spawnEnemies(10);
                pickups.length = min(pickups.length, 2);
            }
        }

        /* =========================
           GAME UPDATE
        ========================= */
        function updateGame() {
            // spawns por bioma
            const spawnEnemyEvery = (SCENE === 0 ? 260 : SCENE === 1 ? 200 : SCENE === 2 ? 160 : 120);
            const spawnPickupEvery = (SCENE === 0 ? 220 : 320);

            if (frameCount % spawnEnemyEvery === 0) {
                if (enemies.length < MAX_ENEMIES) spawnEnemies(1);
            }
            if (frameCount % spawnPickupEvery === 0) {
                if (pickups.length < MAX_PICKUPS) spawnPickups(1);
            }

            player.update(platforms);

            // camera follow
            camX = lerp(camX, constrain(player.x - width * 0.35, 0, worldW - width), 0.08);

            // bullets
            for (let i = bullets.length - 1; i >= 0; i--) {
                bullets[i].update();
                if (bullets[i].dead) bullets.splice(i, 1);
            }

            // enemies
            for (let i = enemies.length - 1; i >= 0; i--) {
                enemies[i].update(SCENE, player, platforms);

                if (aabb(enemies[i], player)) {
                    damagePlayer(SCENE === 3 ? 10 : 7);
                    spawnHit(enemies[i].x + enemies[i].w * 0.5, enemies[i].y + enemies[i].h * 0.5);
                    enemies.splice(i, 1);
                }

                for (let j = bullets.length - 1; j >= 0; j--) {
                    if (aabb(bullets[j], enemies[i])) {
                        score += 10 + combo;
                        spawnHit(enemies[i].x + enemies[i].w * 0.5, enemies[i].y + enemies[i].h * 0.4);
                        enemies.splice(i, 1);
                        bullets.splice(j, 1);
                        addCombo(2);
                        break;
                    }
                }
            }

            // pickups
            for (let i = pickups.length - 1; i >= 0; i--) {
                pickups[i].update();
                if (aabb(pickups[i], player)) {
                    hp = min(100, hp + 12);
                    score += 14;
                    spawnPickupBurst(pickups[i].x + pickups[i].w * 0.5, pickups[i].y + pickups[i].h * 0.5);
                    pickups.splice(i, 1);
                    addCombo(1);
                }
            }

            // particles
            for (let i = particles.length - 1; i >= 0; i--) {
                particles[i].update();
                if (particles[i].dead) particles.splice(i, 1);
            }
            if (particles.length > MAX_PARTICLES) particles.splice(0, particles.length - MAX_PARTICLES);

            // fell out
            if (player.y > height + 320) {
                damagePlayer(12);
                player.x = camX + 120;
                player.y = groundY() - 220;
                player.vx = 0; player.vy = 0;
                shake = max(shake, 10);
            }
        }

        function damagePlayer(d) {
            hp -= d;
            shake = max(shake, 10);
            if (hp <= 0) {
                hp = 0;
                triggerGameOver();
            }
        }

        function triggerGameOver() {
            gameOver = true;
            restartTimer = 180; // 3s
            sceneFlash = 1;
            shake = 14;

            for (let i = 0; i < 80; i++) {
                particles.push(new Spark(player.x + player.w * 0.5, player.y + player.h * 0.4, true));
            }
        }

        /* =========================
           RENDER
        ========================= */
        function renderGame() {
            const pal = scenePalette(SCENE);

            background(pal.bg[0], pal.bg[1], pal.bg[2]);

            // fog
            const fogA = (SCENE === 0 ? 25 : SCENE === 1 ? 40 : SCENE === 2 ? 60 : 90);
            noStroke();
            fill(0, fogA);
            rect(0, 0, width, height);

            // biome particles
            if (SCENE >= 2 && frameCount % 2 === 0) {
                particles.push(new RainDrop(camX + random(width), random(height * 0.1, height * 0.75)));
            }
            if (SCENE === 1 && frameCount % 3 === 0) {
                particles.push(new Mote(camX + random(width), random(height * 0.1, height * 0.7)));
            }

            push();

            // shake
            if (shake > 0.5) translate(random(-shake, shake), random(-shake, shake));

            // camera
            translate(-camX, 0);

            drawParallax(pal);

            for (const pl of platforms) pl.draw(pal);

            for (const pk of pickups) pk.draw(pal);
            for (const en of enemies) en.draw(pal, player);
            for (const b of bullets) b.draw(pal);
            for (const fx of particles) fx.draw(pal);

            player.draw(pal);

            pop();

            // flash
            if (sceneFlash > 0.02) {
                noStroke();
                fill(pal.ui[0], pal.ui[1], pal.ui[2], 55 * sceneFlash);
                rect(0, 0, width, height);
            }

            // scene title
            if (sceneTitleTimer > 0 && !gameOver) {
                noStroke();
                fill(0, 170);
                rect(width * 0.5 - 220, height * 0.12 - 40, 440, 80, 12);
                fill(pal.ui[0], pal.ui[1], pal.ui[2]);
                textAlign(CENTER, CENTER);
                textSize(22);
                text(sceneName(SCENE), width * 0.5, height * 0.12);
            }

            // glitch overlay
            if (glitchAmt > 0.05) drawGlitchOverlay(glitchAmt);
        }

        function drawParallax(pal) {
            noStroke();
            fill(255, 255, 255, SCENE === 3 ? 70 : 55);
            for (let i = 0; i < 120; i++) {
                const x = (i * 97 + frameCount * 0.6) % worldW;
                const y = (i * 53) % height;
                circle(x, y, (i % 5 === 0 ? 2.2 : 1.3));
            }
        }

        function renderHUD() {
            const pal = scenePalette(SCENE);

            noStroke();
            fill(0, 160);
            rect(16, 14, 600, 150, 12);

            fill(255);
            textAlign(LEFT, TOP);
            textSize(14);

            text(`WS: ${wsOk ? "✅ conectado (8081)" : "⚠️ WS cerrado"}`, 28, 24);
            text(`Δ sync: ${lastDelta.toFixed(2)} ms`, 28, 44);
            text(`FPS: ${Math.round(frameRate())}`, 28, 64);

            // HP
            fill(255, 255, 255, 70);
            rect(28, 92, 280, 12, 6);
            fill(pal.ui[0], pal.ui[1], pal.ui[2]);
            rect(28, 92, 280 * (hp / 100), 12, 6);

            fill(255);
            text(`HP ${hp}`, 320, 88);
            text(`Score ${score}`, 410, 88);
            text(`Combo x${max(1, floor(1 + combo / 6))}`, 410, 106);

            fill(255, 255, 255, 140);
            const since = ((Date.now() - lastMsgAt) / 1000).toFixed(1);
            text(`msg ${since}s | ${lastPreview}`, 28, 120);

            fill(pal.ui[0], pal.ui[1], pal.ui[2]);
            text(`bioma:${SCENE} (${sceneName(SCENE)}) | auto:${AUTO_SCENE ? "ON" : "OFF"}`, 28, 140);
        }

        function renderGameOverOverlay() {
            const pal = scenePalette(SCENE);

            noStroke();
            fill(0, 200);
            rect(0, 0, width, height);

            fill(pal.ui[0], pal.ui[1], pal.ui[2]);
            textAlign(CENTER, CENTER);
            textSize(56);
            text("PERDISTE", width * 0.5, height * 0.42);

            textSize(18);
            fill(255, 220);
            text("Reiniciando...", width * 0.5, height * 0.50);

            const sec = ceil(restartTimer / 60);
            fill(255, 180);
            text(`${sec}`, width * 0.5, height * 0.56);
        }

        function drawGlitchOverlay(a) {
            const lines = 10 + floor(a * 30);
            strokeWeight(2);
            for (let i = 0; i < lines; i++) {
                const y = random(height);
                stroke(255, 255, 255, random(15, 60) * a);
                line(0, y, width, y + random(-5, 5));
            }
        }

        /* =========================
           RESTART
        ========================= */
        function hardRestart() {
            gameOver = false;
            hp = 100;
            score = 0;
            combo = 0; comboTimer = 0;
            bullets.length = 0;
            enemies.length = 0;
            pickups.length = 0;

            buildLevel(SCENE);

            player.x = camX + 120;
            player.y = groundY() - 220;
            player.vx = 0; player.vy = 0;

            spawnPickups(3);
            spawnEnemies(SCENE >= 2 ? 3 : 1);

            sceneFlash = 1;
            sceneTitleTimer = 70;
            shake = 6;
            glitchAmt = 0;
        }

        /* =========================
           HELPERS
        ========================= */
        function aabb(a, b) {
            return (
                a.x < b.x + b.w &&
                a.x + a.w > b.x &&
                a.y < b.y + b.h &&
                a.y + a.h > b.y
            );
        }

        function spawnEnemies(n) {
            for (let i = 0; i < n; i++) {
                if (enemies.length >= MAX_ENEMIES) return;
                const x = camX + width + random(120, 360);
                enemies.push(new Enemy(constrain(x, 200, worldW - 200)));
            }
        }

        function spawnPickups(n) {
            for (let i = 0; i < n; i++) {
                if (pickups.length >= MAX_PICKUPS) return;
                const x = camX + random(200, width - 200);
                const y = groundY() - random(140, 320);
                pickups.push(new Pickup(constrain(x, 120, worldW - 120), y));
            }
        }

        function spawnFootDust(x, y, n) {
            for (let i = 0; i < n; i++) {
                if (particles.length >= MAX_PARTICLES) return;
                particles.push(new Dust(x + random(-10, 10), y + random(-6, 6)));
            }
        }

        function spawnHit(x, y) {
            for (let i = 0; i < 16; i++) {
                if (particles.length >= MAX_PARTICLES) return;
                particles.push(new Spark(x, y, false));
            }
        }

        function spawnPickupBurst(x, y) {
            for (let i = 0; i < 12; i++) {
                if (particles.length >= MAX_PARTICLES) return;
                particles.push(new PickupSpark(x, y));
            }
        }

        function sceneName(s) {
            if (s === 0) return "BOSQUE";
            if (s === 1) return "RUINAS";
            if (s === 2) return "CUEVA";
            return "BOSS ZONE";
        }

        function scenePalette(s) {
            if (s === 0) return { bg: [10, 16, 14], ui: [110, 255, 170], enemy: [255, 130, 140], pick: [160, 255, 210], ground: [18, 28, 22] };
            if (s === 1) return { bg: [12, 12, 16], ui: [120, 190, 255], enemy: [255, 170, 90], pick: [170, 240, 255], ground: [22, 22, 28] };
            if (s === 2) return { bg: [12, 8, 14], ui: [200, 120, 255], enemy: [255, 110, 180], pick: [130, 220, 255], ground: [26, 18, 30] };
            return { bg: [14, 8, 8], ui: [255, 70, 90], enemy: [255, 190, 60], pick: [180, 255, 140], ground: [30, 16, 16] };
        }

        function nearestEnemyInRange(x, y, range) {
            let best = null, bestD = range;
            for (const e of enemies) {
                const d = dist(x, y, e.x, e.y);
                if (d < bestD) { bestD = d; best = e; }
            }
            return best;
        }

        /* =========================
           KEYS (para demo)
           1..4 fuerza bioma (y también lo puedes mandar desde Strudel)
           A toggles AUTO_SCENE
        ========================= */
        function keyPressed() {
            if (key === '1') { onSceneChange(SCENE, 0); SCENE = 0; }
            if (key === '2') { onSceneChange(SCENE, 1); SCENE = 1; }
            if (key === '3') { onSceneChange(SCENE, 2); SCENE = 2; }
            if (key === '4') { onSceneChange(SCENE, 3); SCENE = 3; }
            if (key === 'A' || key === 'a') { AUTO_SCENE = !AUTO_SCENE; }
        }

        function windowResized() {
            resizeCanvas(windowWidth, windowHeight);
            buildLevel(SCENE);
        }

        /* =========================
           CLASSES
        ========================= */
        class Platform {
            constructor(x, y, w, h) { this.x = x; this.y = y; this.w = w; this.h = h; }
            draw(pal) {
                noStroke();
                fill(pal.ground[0], pal.ground[1], pal.ground[2], 220);
                rect(this.x, this.y, this.w, this.h, 8);
                stroke(pal.ui[0], pal.ui[1], pal.ui[2], 28);
                strokeWeight(2);
                line(this.x, this.y, this.x + this.w, this.y);
            }
        }

        class Player {
            constructor(x, y) {
                this.x = x; this.y = y;
                this.w = 44; this.h = 78;
                this.vx = 0; this.vy = 0;
                this.onGround = false;
                this.face = 1;
                this.walk = 0;
                this.breathe = 0;
                this.recoil = 0;
                this.cool = 0;
            }

            runPulse() {
                const target = (SCENE === 3 ? 4.2 : SCENE === 2 ? 3.6 : SCENE === 1 ? 3.0 : 2.4);
                this.vx = lerp(this.vx, target, 0.22);
            }

            tryJump(fromAudio = false) {
                if (this.onGround) {
                    this.vy = -(SCENE === 3 ? 12.5 : 11.5);
                    this.onGround = false;
                    if (fromAudio) this.vx += 0.7;
                }
            }

            shoot() {
                if (this.cool > 0) return;
                if (bullets.length >= MAX_BULLETS) return;

                this.cool = 10;
                this.recoil = 1;

                const target = nearestEnemyInRange(this.x, this.y, 900);
                if (target) this.face = (target.x > this.x) ? 1 : -1;

                const bx = this.x + this.w * 0.5 + this.face * 26;
                const by = this.y + 30;
                bullets.push(new Bullet(bx, by, this.face));
            }

            update(plats) {
                this.cool = max(0, this.cool - 1);

                this.walk += abs(this.vx) * 0.06 + (trigHat * 0.25);
                this.breathe += 0.04;
                this.recoil *= 0.78;

                const gravity = (SCENE === 3 ? 0.75 : 0.70);
                this.vy += gravity;

                this.vx *= (this.onGround ? 0.88 : 0.95);

                this.x += this.vx;
                this.y += this.vy;

                this.x = constrain(this.x, 40, worldW - 40);

                this.onGround = false;
                for (const p of plats) {
                    if (this.vy >= 0) {
                        const feetY = this.y + this.h;
                        const prevFeetY = (this.y - this.vy) + this.h;
                        const withinX = (this.x + this.w * 0.2 < p.x + p.w) && (this.x + this.w * 0.8 > p.x);
                        const crossed = (prevFeetY <= p.y) && (feetY >= p.y);
                        if (withinX && crossed) {
                            this.y = p.y - this.h;
                            this.vy = 0;
                            this.onGround = true;
                        }
                    }
                }

                if (abs(this.vx) > 0.15) this.face = (this.vx > 0) ? 1 : -1;
            }

            draw(pal) {
                const bob = sin(this.breathe) * 2.2 + (this.onGround ? 0 : 2);
                const legSwing = sin(this.walk) * 8 * (this.onGround ? 1 : 0.2);
                const armSwing = cos(this.walk) * 6 * (this.onGround ? 1 : 0.3);

                push();
                translate(this.x + this.w * 0.5, this.y + this.h * 0.5 + bob);

                noStroke();
                fill(pal.ui[0], pal.ui[1], pal.ui[2], 16 + trigMelody * 50);
                ellipse(0, 8, 110, 70);

                stroke(255, 255, 255, 140);
                strokeWeight(3);
                fill(0, 160);
                ellipse(0, -26, 26, 26);

                noStroke();
                fill(255);
                const ex = this.face * 4;
                circle(ex - 3, -28, 3);
                circle(ex + 4, -28, 3);

                stroke(255, 255, 255, 140);
                strokeWeight(3);
                fill(0, 140);
                rectMode(CENTER);
                rect(0, 2, 24, 34, 10);

                strokeWeight(4);
                stroke(255, 255, 255, 140);
                line(-6, 18, -10 - legSwing * 0.2, 38);
                line(6, 18, 10 + legSwing * 0.2, 38);

                line(-12, -2, -18, 12 + armSwing * 0.2);
                line(12, -2, 18, 12 - armSwing * 0.2);

                const gunSide = this.face;
                const gx = gunSide * 18;
                const gy = 0;

                stroke(pal.ui[0], pal.ui[1], pal.ui[2], 220);
                strokeWeight(5);
                line(gx, gy, gx + gunSide * (20 + this.recoil * 6), gy - 2);

                noStroke();
                fill(pal.ui[0], pal.ui[1], pal.ui[2], 200);
                rect(gx + gunSide * 18, gy - 2, 18, 6, 2);

                if (this.recoil > 0.15) {
                    fill(255, 255, 255, 140 * this.recoil);
                    ellipse(gx + gunSide * 40, gy - 2, 10 + 18 * this.recoil, 6 + 12 * this.recoil);
                }

                pop();
            }
        }

        class Enemy {
            constructor(x) {
                this.w = 46; this.h = 70;
                this.x = x;
                this.y = groundY() - this.h;
                this.vx = -random(0.8, 1.4);
                this.vy = 0;
                this.onGround = true;
                this.phase = random(1000);
            }

            update(scene, player, plats) {
                const speed = (scene === 3 ? 2.1 : scene === 2 ? 1.7 : scene === 1 ? 1.35 : 1.1);
                const dir = (player.x > this.x) ? 1 : -1;

                const wob = sin((frameCount + this.phase) * 0.05) * 0.3;
                this.vx = lerp(this.vx, dir * speed, 0.03) + wob;

                this.vy += (scene === 3 ? 0.78 : 0.70);
                this.x += this.vx;
                this.y += this.vy;

                this.onGround = false;
                for (const p of plats) {
                    if (this.vy >= 0) {
                        const feetY = this.y + this.h;
                        const prevFeetY = (this.y - this.vy) + this.h;
                        const withinX = (this.x + this.w * 0.2 < p.x + p.w) && (this.x + this.w * 0.8 > p.x);
                        const crossed = (prevFeetY <= p.y) && (feetY >= p.y);
                        if (withinX && crossed) {
                            this.y = p.y - this.h;
                            this.vy = 0;
                            this.onGround = true;
                        }
                    }
                }

                if (scene >= 2 && this.onGround && random() < 0.006) {
                    this.vy = -10.5;
                    this.onGround = false;
                }
            }

            draw(pal, player) {
                const face = (player.x > this.x) ? 1 : -1;
                const bob = sin((frameCount + this.phase) * 0.08) * 2;

                push();
                translate(this.x + this.w * 0.5, this.y + this.h * 0.5 + bob);

                stroke(pal.enemy[0], pal.enemy[1], pal.enemy[2], 220);
                strokeWeight(3);
                fill(0, 140);
                rectMode(CENTER);
                rect(0, 8, 26, 38, 10);

                fill(0, 160);
                ellipse(0, -18, 26, 26);

                noStroke();
                fill(pal.enemy[0], pal.enemy[1], pal.enemy[2], 230);
                circle(face * 4 - 2, -20, 3);
                circle(face * 4 + 6, -20, 3);

                strokeWeight(4);
                stroke(pal.enemy[0], pal.enemy[1], pal.enemy[2], 200);
                line(-6, 26, -10, 44);
                line(6, 26, 10, 44);

                // axe
                stroke(220, 220, 220, 170);
                strokeWeight(5);
                line(face * 16, 0, face * 28, 24);
                noStroke();
                fill(pal.enemy[0], pal.enemy[1], pal.enemy[2], 220);
                ellipse(face * 28, 18, 18, 12);

                pop();
            }
        }

        class Bullet {
            constructor(x, y, dir) {
                this.x = x; this.y = y;
                this.w = 12; this.h = 6;
                this.vx = dir * 12.5;
                this.dead = false;
                this.life = 70;
            }
            update() {
                this.x += this.vx;
                this.life--;
                if (this.life <= 0) this.dead = true;
                if (this.x < -200 || this.x > worldW + 200) this.dead = true;
            }
            draw(pal) {
                noStroke();
                fill(pal.ui[0], pal.ui[1], pal.ui[2], 220);
                rect(this.x, this.y, this.w, this.h, 3);
            }
        }

        class Pickup {
            constructor(x, y) {
                this.x = x; this.y = y;
                this.w = 18; this.h = 18;
                this.t = random(1000);
            }
            update() { this.t += 0.05; }
            draw(pal) {
                const a = 140 + sin(this.t) * 70;
                stroke(pal.pick[0], pal.pick[1], pal.pick[2], a);
                strokeWeight(2);
                noFill();
                rect(this.x, this.y + sin(this.t) * 4, this.w, this.h, 4);

                noStroke();
                fill(pal.pick[0], pal.pick[1], pal.pick[2], 55);
                rect(this.x - 6, this.y - 6 + sin(this.t) * 4, this.w + 12, this.h + 12, 8);
            }
        }

        class Dust {
            constructor(x, y) {
                this.x = x; this.y = y;
                this.vx = random(-1.2, 1.2);
                this.vy = random(-2.0, -0.4);
                this.life = 22;
                this.dead = false;
            }
            update() { this.x += this.vx; this.y += this.vy; this.vx *= 0.94; this.vy *= 0.92; this.life--; if (this.life <= 0) this.dead = true; }
            draw(pal) { noStroke(); fill(255, 255, 255, this.life * 6); circle(this.x, this.y, 4); }
        }

        class Spark {
            constructor(x, y, big) {
                this.x = x; this.y = y;
                const a = random(TWO_PI), sp = random(big ? 2 : 1, big ? 9 : 6);
                this.vx = cos(a) * sp; this.vy = sin(a) * sp;
                this.life = big ? 42 : 24;
                this.dead = false;
            }
            update() { this.x += this.vx; this.y += this.vy; this.vx *= 0.90; this.vy *= 0.90; this.life--; if (this.life <= 0) this.dead = true; }
            draw(pal) { stroke(pal.enemy[0], pal.enemy[1], pal.enemy[2], this.life * 6); strokeWeight(2); point(this.x, this.y); }
        }

        class PickupSpark {
            constructor(x, y) {
                this.x = x; this.y = y;
                const a = random(TWO_PI), sp = random(0.8, 5);
                this.vx = cos(a) * sp; this.vy = sin(a) * sp;
                this.life = 22; this.dead = false;
            }
            update() { this.x += this.vx; this.y += this.vy; this.vx *= 0.90; this.vy *= 0.90; this.life--; if (this.life <= 0) this.dead = true; }
            draw(pal) { stroke(pal.pick[0], pal.pick[1], pal.pick[2], this.life * 7); strokeWeight(2); point(this.x, this.y); }
        }

        class RainDrop {
            constructor(x, y) {
                this.x = x; this.y = y;
                this.vy = random(7, 14);
                this.life = 25;
                this.dead = false;
            }
            update() { this.y += this.vy; this.life--; if (this.life <= 0 || this.y > height) this.dead = true; }
            draw(pal) { stroke(255, 255, 255, 22); strokeWeight(2); line(this.x, this.y, this.x, this.y + 10); }
        }

        class Mote {
            constructor(x, y) {
                this.x = x; this.y = y;
                this.vx = random(-0.2, 0.2);
                this.vy = random(0.1, 0.5);
                this.life = 80;
                this.dead = false;
            }
            update() { this.x += this.vx; this.y += this.vy; this.life--; if (this.life <= 0) this.dead = true; }
            draw(pal) { noStroke(); fill(255, 255, 255, 18); circle(this.x, this.y, 2); }
        }
    </script>
</body>
</html>
```
<img width="1854" height="892" alt="image" src="https://github.com/user-attachments/assets/d869a899-ee10-44d4-9262-eef937f536c6" />


## Bitácora de reflexión

### caso de estudio

<img width="824" height="521" alt="image" src="https://github.com/user-attachments/assets/3b29c615-ccff-4a19-be3f-5e3b0ee270c0" />

### Obra con visuales

<img width="856" height="303" alt="image" src="https://github.com/user-attachments/assets/dfb2a973-ecf0-47e1-94b7-2ba39f1708d0" />






