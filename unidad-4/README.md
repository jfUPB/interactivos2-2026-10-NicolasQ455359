# Audiovisual Live Coding System: Strudel + OSC + Audience Arena 🎮

Este repositorio contiene una obra audiovisual inmersiva e interactiva que integra **Live Coding Musical (Strudel)**, **Superficies de Control (Open Stage Control)** y **Participacion de Publico Masiva (Smartphones)** usando p5.js y WebSockets.

## 🚀 Requisitos Previos

Asegúrate de tener instalado en tu computadora:
1. [Node.js](https://nodejs.org/) (versión 16+)
2. Un gestor de paquetes como `npm` (viene con Node) o `pnpm`.
3. [Open Stage Control](https://openstagecontrol.ammd.net/) (para la interfaz física/virtual).

---

## 🛠️ Instrucciones de Instalación y Ejecución

Para poner a funcionar el sistema completo, debes levantar **tres servidores/procesos simultáneos** en diferentes terminales.

### Paso 1: Levantar el entorno Musical (Strudel)
1. Abre tu terminal y navega a la carpeta de Strudel:
   ```bash
   cd strudel
   ```
2. Instala las dependencias (solo la primera vez):
   ```bash
   pnpm install
   ```
3. Ejecuta el entorno de desarrollo:
   ```bash
   pnpm dev
   ```
4. *Esto levantará Strudel en el navegador.*

### Paso 1.5: Levantar el Puente de Strudel (oscBridge)
1. Abre una **nueva** terminal y navega a la carpeta puente:
   ```bash
   cd "strudel-visuals/oscBridge"
   ```
2. Instala dependencias (solo la primera vez):
   ```bash
   npm install
   ```
3. Ejecuta el archivo:
   ```bash
   node bridge.js
   ```
4. *Esto escuchará a Strudel y transmitirá eventos hacia las visuales en el puerto `8081`.*

### Paso 2: Levantar el Puente de Open Stage Control (OSC)
1. Abre una **cuarta** terminal y navega a la carpeta de tu puente OSC:
   ```bash
   cd "ProyectoOSC/OpenStageControlUITest"
   ```
2. Ejecuta el archivo puente:
   ```bash
   node bridgeUI.js
   ```
3. *Esto escuchará mensajes UDP en el puerto `9000` y transmitirá los controles visuales vía WebSocket por el puerto `8082`.*
4. Abre el programa **Open Stage Control**, configura su salida hacia `127.0.0.1:9000` y utiliza el Knob asignado con la direccion `/biome`.

### Paso 3: Levantar la Arena del Público (Audience Bridge)
1. Abre una **tercera** terminal y navega a la carpeta de la audiencia:
   ```bash
   cd audienceBridge
   ```
2. Instala las dependencias (solo la primera vez):
   ```bash
   npm install
   ```
3. Ejecuta el servidor del público:
   ```bash
   node server.js
   ```
4. *Verás en la consola la URL local (ej. `http://192.168.x.x:3000`). ¡Esa es la dirección que debes compartirle a tu público para que interactúe desde sus celulares!* (Este puerto se comunica con las visuales por el puerto `8083`).

---

## 🎨 Visualizacion
Finalmente, abre tu navegador y entra a:
```
http://localhost:4321/visualesHouse.html
```

💡 **Tip:** Revisa la esquina superior izquierda de la pantalla (HUD). Si los tres sistemas están conectados correctamente, verás:
`Strudel: ✅ (8081) | OSC: ✅ (8082) | Audience: ✅ (8083)`

## 📁 Estructura Principal del Proyecto
- `/strudel/` -> Motor de audio live coding.
  ```
  setcpm(112/4)
   // 0–3 (cambia estos valores para tus “variaciones del videojuego”)
   let DRONE_SCORE = 0
   let KICK_SCORE = 0
   let HAT_SCORE = 0
   let MELODY_SCORE = 0
   let EVENT_SCORE = 0
   
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
- `/strudel-visuals/visualesHouse.html` -> Obra visual en p5.js.
  <img width="1870" height="971" alt="image" src="https://github.com/user-attachments/assets/dc5dfac9-e82d-45ad-9199-d5929dff2829" />
- `/strudel-visuals/oscBridge/bridge.js` -> Puente de Node.js para las notas musicales.
- `/audienceBridge/server.js` -> Servidor Node.js interactivo para el público.
- `/audienceBridge/audience.html` -> Interfaz móvil ("Audience Arena").
  <img width="1869" height="967" alt="image" src="https://github.com/user-attachments/assets/10b9da74-f218-4e39-bef1-c7e789605f3b" />
- `/ProyectoOSC/OpenStageControlUITest/bridgeUI.js` -> Puente UDP a WebSockets para el Knob OSC.
- <img width="829" height="644" alt="image" src="https://github.com/user-attachments/assets/4969b140-0a27-4bca-a4b4-8c4574892fe7" />
  <img width="1867" height="976" alt="image" src="https://github.com/user-attachments/assets/9e7ac0f8-b1e1-4977-8a15-678d9a372363" />
  

