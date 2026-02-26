# Unidad 3

## Bitácora de proceso de aprendizaje

En esta unidad comenzamos haciendo una prueba básica para entender cómo funciona Open Stage Control antes de integrarlo con mi obra.

Primero cloné el repositorio que nos compartieron desde GitHub y lo abrí en Visual Studio Code. Luego instalé las dependencias con npm install y ejecuté el archivo bridgeUI.js usando node bridgeUI.js. En la consola verifiqué que el servidor estaba escuchando en los puertos correctos (WebSocket 8081 y OSC 9000).

Después descargamos Open Stage Control y creé una interfaz sencilla con un fader. Configuré el host en 127.0.0.1 y el puerto en 9000 para que enviara los mensajes al bridge.

En el archivo sketch.js dejé el ejemplo básico que recibía un valor desde el fader usando la dirección /fader_1. Ese valor controlaba el fondo y una barra visual en pantalla.

Al mover el fader y ver que el fondo cambiaba en tiempo real, confirmé que la conexión entre Open Stage Control, el bridge y p5.js estaba funcionando correctamente.

Esta primera prueba me ayudó a entender la lógica completa del sistema: Open Stage Control envía un mensaje OSC, el bridge lo convierte a WebSocket y el sketch lo recibe para modificar la visual.

## Bitácora de aplicación y Bitácora de reflexión

index.html

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Platformer Toon + Open Stage Control</title>

  <!-- p5 -->
  <script src="https://cdn.jsdelivr.net/npm/p5@1.9.0/lib/p5.min.js"></script>

  <!-- Tone.js (audio sin Strudel) -->
  <script src="https://cdn.jsdelivr.net/npm/tone@14.8.49/build/Tone.js"></script>

  <style>
    html, body { margin:0; padding:0; overflow:hidden; background:#000; }
    canvas { display:block; }
  </style>
</head>
<body>
  <script src="sketch.js"></script>
</body>
</html>
```

sketch.js
```javaScript
let ws, wsOk = false;

// Debug
let lastDelta = 0;
let lastMsgAt = 0;
let lastPreview = "(aún nada)";

// ---- BIOMAS ----
let SCENE = 0; // 0..3

// ---- OPEN STAGE PARAMS (VISUALES) ----
let trailValue = 0.25; // /trail 0..1
let fogValue = 0.6;    // /fog 0..1
let bgValue = 0.0;     // /bg  0..1
let fxValue = 0.6;     // /fx  0..1

let sceneFlash = 0;
let sceneTitleTimer = 0;

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

// ---- INPUT (teclado) ----
let leftHeld = false;
let rightHeld = false;

// Ajustes de movimiento
const MOVE_SPEED = 3.2;
const AIR_CONTROL = 0.55;

// ---- LIMITS ----
const MAX_ENEMIES = 18;
const MAX_PICKUPS = 12;
const MAX_PARTICLES = 140;
const MAX_BULLETS = 28;

// ---- GAME OVER ----
let gameOver = false;
let restartTimer = 0;
let glitchAmt = 0;

// ---- AUDIO ----
let audio;
let audioUnlocked = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  textFont("monospace");

  buildLevel(0);
  player = new Player(120, groundY() - 140);

  audio = new AudioEngine(112); // bpm base tipo Strudel
  connectWS();

  // arranque
  spawnPickups(3);
  spawnEnemies(1);
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
   AUDIO UNLOCK (1 gesto)
========================= */
async function unlockAudioOnce() {
  if (audioUnlocked) return;
  try {
    await Tone.start();
    audioUnlocked = true;
    lastPreview = "Audio desbloqueado ✅ (click o tecla)";
  } catch (e) {
    lastPreview = "No se pudo desbloquear audio ⚠️";
  }
}

/* =========================
   WS (bridge -> p5)
========================= */
function connectWS() {
  ws = new WebSocket("ws://localhost:8081");

  ws.onopen = () => {
    wsOk = true;
    lastPreview = "WS conectado ✅";
  };
  ws.onclose = () => {
    wsOk = false;
    lastPreview = "WS cerrado ⚠️";
  };
  ws.onerror = () => {
    wsOk = false;
    lastPreview = "WS error ⚠️";
  };

  ws.onmessage = (event) => {
    lastMsgAt = Date.now();
    let msg;
    try { msg = JSON.parse(event.data); }
    catch (e) { return; }

    if (!msg.address) return;

    const v = Number(msg.args?.[0]);

    // -------- FADERS (VISUALES) --------
    if (msg.address === "/trail") {
      if (Number.isFinite(v)) trailValue = constrain(v, 0, 1);
      lastPreview = `OSC /trail: ${trailValue.toFixed(2)}`;
      return;
    }

    if (msg.address === "/fog") {
      if (Number.isFinite(v)) fogValue = constrain(v, 0, 1);
      lastPreview = `OSC /fog: ${fogValue.toFixed(2)}`;
      return;
    }

    if (msg.address === "/bg") {
      if (Number.isFinite(v)) bgValue = constrain(v, 0, 1);
      // ✅ además audio master (sin borrar función visual)
      audio.setMaster(map(bgValue, 0, 1, 0.2, 1.0));
      lastPreview = `OSC /bg: ${bgValue.toFixed(2)} (master vol)`;
      return;
    }

    if (msg.address === "/fx") {
      if (Number.isFinite(v)) fxValue = constrain(v, 0, 1);
      // ✅ además audio drums (sin borrar función visual)
      audio.setDrums(map(fxValue, 0, 1, 0.0, 1.0));
      lastPreview = `OSC /fx: ${fxValue.toFixed(2)} (drums vol)`;
      return;
    }

    // -------- KNOB (BIOME) --------
    if (msg.address === "/biome") {
      const b = constrain(parseInt(v, 10), 0, 3);
      if (!Number.isNaN(b) && b !== SCENE) {
        onSceneChange(SCENE, b);
        SCENE = b;
      }
      // ✅ además cambia patrón musical 0..3
      audio.setPattern(SCENE);
      lastPreview = `OSC /biome: ${SCENE} (pattern)`;
      return;
    }

    // -------- BUTTONS --------
    if (msg.address === "/flash") {
      if (Number.isFinite(v) ? v > 0 : true) {
        // flash visual
        sceneFlash = 1;
        sceneTitleTimer = 60;
        shake = max(shake, 8);

        // ✅ también toggle audio
        if (!audioUnlocked) {
          lastPreview = "Haz click/tecla para habilitar audio 👆";
        } else {
          audio.toggle();
          lastPreview = `OSC /flash (audio ${audio.on ? "ON" : "OFF"})`;
        }
      }
      return;
    }

    if (msg.address === "/reset") {
      if (Number.isFinite(v) ? v > 0 : true) {
        hardReset();
        // ✅ y además apaga audio
        audio.stop();
        lastPreview = "OSC /reset (reset + audio stop)";
      }
      return;
    }

    if (msg.address === "/spawnEnemy") {
      if (Number.isFinite(v) ? v > 0 : true) spawnEnemies(1);
      lastPreview = "OSC /spawnEnemy";
      return;
    }

    if (msg.address === "/spawnPickup") {
      if (Number.isFinite(v) ? v > 0 : true) spawnPickups(1);
      lastPreview = "OSC /spawnPickup";
      return;
    }

    lastPreview = `OSC ${msg.address} ${Number.isFinite(v) ? v : ""}`;
  };
}

/* =========================
   MAIN LOOP
========================= */
function draw() {
  // decays
  shake *= 0.85;
  sceneFlash *= 0.86;
  if (sceneTitleTimer > 0) sceneTitleTimer--;

  // combo
  if (comboTimer > 0) comboTimer--;
  else combo = 0;

  // GAME OVER
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

  // INPUT (teclado)
  applyKeyboardMovement();

  // update + render
  updateGame();
  renderGame();
  renderHUD();
}

function applyKeyboardMovement() {
  const dir = (rightHeld ? 1 : 0) - (leftHeld ? 1 : 0);
  if (dir === 0) return;

  const control = player.onGround ? 1 : AIR_CONTROL;
  player.vx = lerp(player.vx, dir * MOVE_SPEED, 0.25 * control);

  if (abs(player.vx) > 0.15) player.face = (player.vx > 0) ? 1 : -1;
}

/* =========================
   SCENE CHANGE
========================= */
function onSceneChange(prev, next) {
  sceneFlash = 1;
  sceneTitleTimer = 95;
  shake = max(shake, 6);

  buildLevel(next);

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

function addCombo(v) {
  combo += v;
  comboTimer = 60;
  score += v * (1 + floor(combo / 6));
}

/* =========================
   RENDER
========================= */
function renderGame() {
  const pal = scenePalette(SCENE);

  // /bg: brillo
  const bgMix = lerp(1.0, 1.35, bgValue);
  const r = constrain(pal.bg[0] * bgMix, 0, 255);
  const g = constrain(pal.bg[1] * bgMix, 0, 255);
  const b = constrain(pal.bg[2] * bgMix, 0, 255);

  // /trail: estela
  const bgAlpha = lerp(255, 25, trailValue);
  background(r, g, b, bgAlpha);

  // /fog: niebla
  const fogBase = (SCENE === 0 ? 25 : SCENE === 1 ? 40 : SCENE === 2 ? 60 : 90);
  const fogA = lerp(0, fogBase, fogValue);
  noStroke();
  fill(0, fogA);
  rect(0, 0, width, height);

  // /fx: partículas
  const fxChance = lerp(0.15, 1.0, fxValue);

  if (SCENE >= 2 && frameCount % 2 === 0 && random() < fxChance) {
    particles.push(new RainDrop(camX + random(width), random(height * 0.1, height * 0.75)));
  }
  if (SCENE === 1 && frameCount % 3 === 0 && random() < fxChance) {
    particles.push(new Mote(camX + random(width), random(height * 0.1, height * 0.7)));
  }

  push();

  if (shake > 0.5) translate(random(-shake, shake), random(-shake, shake));
  translate(-camX, 0);

  drawParallax(pal);

  for (const pl of platforms) pl.draw(pal);
  for (const pk of pickups) pk.draw(pal);
  for (const en of enemies) en.draw(pal, player);
  for (const bb of bullets) bb.draw(pal);
  for (const fx of particles) fx.draw(pal);

  player.draw(pal);

  pop();

  if (sceneFlash > 0.02) {
    noStroke();
    fill(pal.ui[0], pal.ui[1], pal.ui[2], 55 * sceneFlash);
    rect(0, 0, width, height);
  }

  if (sceneTitleTimer > 0 && !gameOver) {
    noStroke();
    fill(0, 170);
    rect(width * 0.5 - 220, height * 0.12 - 40, 440, 80, 12);
    fill(pal.ui[0], pal.ui[1], pal.ui[2]);
    textAlign(CENTER, CENTER);
    textSize(22);
    text(sceneName(SCENE), width * 0.5, height * 0.12);
  }

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
  rect(16, 14, 760, 220, 12);

  fill(255);
  textAlign(LEFT, TOP);
  textSize(14);

  text(`WS: ${wsOk ? "✅ conectado (8081)" : "⚠️ WS cerrado"}`, 28, 24);
  text(`FPS: ${Math.round(frameRate())}`, 28, 44);

  fill(255, 255, 255, 70);
  rect(28, 72, 280, 12, 6);
  fill(pal.ui[0], pal.ui[1], pal.ui[2]);
  rect(28, 72, 280 * (hp / 100), 12, 6);

  fill(255);
  text(`HP ${hp}`, 320, 68);
  text(`Score ${score}`, 440, 68);
  text(`Combo x${max(1, floor(1 + combo / 6))}`, 440, 86);

  fill(255, 255, 255, 140);
  const since = lastMsgAt ? ((Date.now() - lastMsgAt) / 1000).toFixed(1) : "—";
  text(`msg ${since}s | ${lastPreview}`, 28, 110);

  fill(pal.ui[0], pal.ui[1], pal.ui[2]);
  text(`bioma:${SCENE} (${sceneName(SCENE)})`, 28, 130);

  fill(255, 255, 255, 180);
  text(`/trail:${trailValue.toFixed(2)}  /fog:${fogValue.toFixed(2)}  /bg:${bgValue.toFixed(2)}  /fx:${fxValue.toFixed(2)}`, 28, 154);

  fill(255, 255, 255, 180);
  text(`Audio: ${audioUnlocked ? (audio.on ? "ON" : "OFF") : "LOCKED (click/tecla)"}`, 28, 178);

  fill(255, 255, 255, 180);
  text(`Teclado: A/D mover | W saltar | Space disparar`, 28, 200);
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
   RESET / RESTART
========================= */
function hardReset() {
  gameOver = false;
  hp = 100;
  score = 0;
  combo = 0;
  comboTimer = 0;

  bullets.length = 0;
  enemies.length = 0;
  pickups.length = 0;
  particles.length = 0;

  buildLevel(SCENE);

  player.x = camX + 120;
  player.y = groundY() - 220;
  player.vx = 0;
  player.vy = 0;

  spawnPickups(3);
  spawnEnemies(SCENE >= 2 ? 2 : 1);

  sceneFlash = 1;
  sceneTitleTimer = 70;
  shake = 6;
  glitchAmt = 0;
}

function hardRestart() {
  gameOver = false;
  hp = 100;
  score = 0;
  combo = 0;
  comboTimer = 0;

  bullets.length = 0;
  enemies.length = 0;
  pickups.length = 0;

  buildLevel(SCENE);

  player.x = camX + 120;
  player.y = groundY() - 220;
  player.vx = 0;
  player.vy = 0;

  spawnPickups(3);
  spawnEnemies(SCENE >= 2 ? 3 : 1);

  sceneFlash = 1;
  sceneTitleTimer = 70;
  shake = 6;
  glitchAmt = 0;
}

/* =========================
   INPUT
========================= */
function mousePressed() {
  unlockAudioOnce();
}

function keyPressed() {
  unlockAudioOnce();

  if (key === 'a' || key === 'A') leftHeld = true;
  if (key === 'd' || key === 'D') rightHeld = true;

  if (key === 'w' || key === 'W') {
    player.tryJump(false);
    shake = max(shake, 2.5);
  }

  if (keyCode === 32) { // SPACE
    player.shoot();
    shake = max(shake, 3.0);
    addCombo(2);

    // mini acento musical (si está ON)
    if (audioUnlocked && audio.on) audio.accent();
  }
}

function keyReleased() {
  if (key === 'a' || key === 'A') leftHeld = false;
  if (key === 'd' || key === 'D') rightHeld = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildLevel(SCENE);
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

/* =========================
   CLASSES (juego)
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

  tryJump() {
    if (this.onGround) {
      this.vy = -(SCENE === 3 ? 12.5 : 11.5);
      this.onGround = false;
    }
  }

  shoot() {
    if (this.cool > 0) return;
    if (bullets.length >= MAX_BULLETS) return;

    this.cool = 10;
    this.recoil = 1;

    const bx = this.x + this.w * 0.5 + this.face * 26;
    const by = this.y + 30;
    bullets.push(new Bullet(bx, by, this.face));
  }

  update(plats) {
    this.cool = max(0, this.cool - 1);

    this.walk += abs(this.vx) * 0.06;
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
    fill(pal.ui[0], pal.ui[1], pal.ui[2], 16);
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

class Spark {
  constructor(x, y, big) {
    this.x = x; this.y = y;
    const a = random(TWO_PI), sp = random(big ? 2 : 1, big ? 9 : 6);
    this.vx = cos(a) * sp; this.vy = sin(a) * sp;
    this.life = big ? 42 : 24;
    this.dead = false;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.vx *= 0.90; this.vy *= 0.90;
    this.life--;
    if (this.life <= 0) this.dead = true;
  }
  draw(pal) {
    stroke(pal.enemy[0], pal.enemy[1], pal.enemy[2], this.life * 6);
    strokeWeight(2);
    point(this.x, this.y);
  }
}

class PickupSpark {
  constructor(x, y) {
    this.x = x; this.y = y;
    const a = random(TWO_PI), sp = random(0.8, 5);
    this.vx = cos(a) * sp; this.vy = sin(a) * sp;
    this.life = 22; this.dead = false;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.vx *= 0.90; this.vy *= 0.90;
    this.life--;
    if (this.life <= 0) this.dead = true;
  }
  draw(pal) {
    stroke(pal.pick[0], pal.pick[1], pal.pick[2], this.life * 7);
    strokeWeight(2);
    point(this.x, this.y);
  }
}

class RainDrop {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.vy = random(7, 14);
    this.life = 25;
    this.dead = false;
  }
  update() {
    this.y += this.vy;
    this.life--;
    if (this.life <= 0 || this.y > height) this.dead = true;
  }
  draw(pal) {
    stroke(255, 255, 255, 22);
    strokeWeight(2);
    line(this.x, this.y, this.x, this.y + 10);
  }
}

class Mote {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.vx = random(-0.2, 0.2);
    this.vy = random(0.1, 0.5);
    this.life = 80;
    this.dead = false;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.life--;
    if (this.life <= 0) this.dead = true;
  }
  draw(pal) {
    noStroke();
    fill(255, 255, 255, 18);
    circle(this.x, this.y, 2);
  }
}

/* =========================
   AUDIO ENGINE (Tone.js)
   Variaciones 0..3 (patrones tipo Strudel)
========================= */
class AudioEngine {
  constructor(bpm = 112) {
    this.bpm = bpm;
    this.on = false;

    this.master = new Tone.Gain(0.9).toDestination();
    this.drumsBus = new Tone.Gain(0.7).connect(this.master);
    this.droneBus = new Tone.Gain(0.35).connect(this.master);
    this.melodyBus = new Tone.Gain(0.45).connect(this.master);

    this.kick = new Tone.MembraneSynth({
      pitchDecay: 0.02,
      octaves: 8,
      envelope: { attack: 0.001, decay: 0.18, sustain: 0.0, release: 0.05 }
    }).connect(this.drumsBus);

    this.snare = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.001, decay: 0.12, sustain: 0.0 }
    }).connect(this.drumsBus);

    this.hat = new Tone.MetalSynth({
      frequency: 250,
      envelope: { attack: 0.001, decay: 0.06, release: 0.02 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 3500,
      octaves: 1.5
    }).connect(this.drumsBus);

    this.drone = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.02, decay: 0.2, sustain: 0.7, release: 0.8 }
    }).connect(this.droneBus);

    this.mel = new Tone.MonoSynth({
      oscillator: { type: "sine" },
      filter: { Q: 1, type: "lowpass", rolloff: -12 },
      envelope: { attack: 0.01, decay: 0.15, sustain: 0.2, release: 0.25 },
      filterEnvelope: { attack: 0.01, decay: 0.1, sustain: 0.0, release: 0.2, baseFrequency: 500, octaves: 2 }
    }).connect(this.melodyBus);

    this.pattern = 0;
    this.fillAmt = 0;

    Tone.Transport.bpm.value = this.bpm;
    Tone.Transport.swing = 0.08;

    this.step = 0;
    this.loop = new Tone.Loop((time) => this.tick(time), "16n");
  }

  setMaster(v) { this.master.gain.rampTo(v, 0.05); }
  setDrums(v) { this.drumsBus.gain.rampTo(v, 0.05); }
  setDrone(v) { this.droneBus.gain.rampTo(v, 0.05); }
  setMelody(v){ this.melodyBus.gain.rampTo(v, 0.05); }

  setPattern(p) { this.pattern = (p | 0); }

  accent() {
    // pequeño “click” musical cuando disparas
    this.fillAmt = Math.max(this.fillAmt, 0.6);
  }

  toggle() {
    if (!this.on) this.start();
    else this.stop();
  }

  start() {
    if (this.on) return;
    this.on = true;
    this.step = 0;
    this.loop.start(0);
    Tone.Transport.start();
  }

  stop() {
    if (!this.on) return;
    this.on = false;
    this.loop.stop(0);
    Tone.Transport.stop();
    this.drone.releaseAll?.();
  }

  tick(time) {
    const p = this.pattern;

    // DRONE cada compás
    if (this.step % 16 === 0) {
      const chords = [
        ["C3", "G3"],
        ["C3", "G3", "Bb3"],
        ["C3", "Eb3", "G3"],
        ["C3", "G3", "Bb3", "Eb4"],
      ];
      this.drone.triggerAttackRelease(chords[p], "1n", time, 0.12);
    }

    const kickP = [
      [0,0,0,0],
      [1,0,0,0],
      [1,0,1,0],
      [1,1,1,1],
    ][p];

    const hatP = [
      [0,0,0,0],
      [0,1,0,1],
      [1,1,0,1],
      [1,1,1,1],
    ][p];

    const snP = [
      [0,0,0,0],
      [0,1,0,0],
      [1,0,1,0],
      [0,1,1,0],
    ][p];

    const beat = Math.floor(this.step / 4);
    const sub = this.step % 4;

    if (sub === 0 && kickP[beat] === 1) {
      this.kick.triggerAttackRelease("C1", "16n", time, 0.9);
    }

    if (hatP[beat] === 1) {
      const hatProb = 0.65 + 0.25 * this.fillAmt;
      if (Math.random() < hatProb) this.hat.triggerAttackRelease("16n", time, 0.25);
    }

    if (sub === 0 && snP[beat] === 1) {
      this.snare.triggerAttackRelease("16n", time, 0.55);
    }

    const melodyNotes = [
      null,
      (beat===1 && sub===2) ? "E4" : (beat===3 && sub===2) ? "G4" : null,
      (beat===0 && sub===2) ? "G4" : (beat===2 && sub===2) ? "F4" : null,
      (sub===2) ? (["E4","G4","Bb4"][beat%3]) : null
    ];

    const note = melodyNotes[p];
    if (note) this.mel.triggerAttackRelease(note, "16n", time, 0.22);

    this.fillAmt *= 0.85;
    this.step = (this.step + 1) % 16;
  }
}
```
