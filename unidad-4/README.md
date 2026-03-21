# Audiovisual Live Coding System: Strudel + OSC + Audience Arena 

Este repositorio contiene una obra audiovisual inmersiva e interactiva que integra **Live Coding Musical (Strudel)**, **Superficies de Control (Open Stage Control)** y **Participacion de Publico Masiva (Smartphones)** usando p5.js y WebSockets.

##  Requisitos Previos

Asegúrate de tener instalado en tu computadora:
1. [Node.js](https://nodejs.org/) (versión 16+)
2. Un gestor de paquetes como `npm` (viene con Node) o `pnpm`.
3. [Open Stage Control](https://openstagecontrol.ammd.net/) (para la interfaz física/virtual).

---

##  Instrucciones de Instalación y Ejecución

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
4. *Esto levantará Strudel y el WebSocket de música en el puerto `8081`.*

### Paso 2: Levantar el Puente de Open Stage Control (OSC)
1. Abre una **nueva** terminal y navega a la carpeta de tu puente OSC:
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

##  Visualizacion
Finalmente, abre tu navegador y entra a:
```
http://localhost:4321/visualesHouse.html
```

💡 **Tip:** Revisa la esquina superior izquierda de la pantalla (HUD). Si los tres sistemas están conectados correctamente, verás:
`Strudel: ✅ (8081) | OSC: ✅ (8082) | Audience: ✅ (8083)`

---

##  Estructura Principal del Proyecto
- `/strudelP5-tests-main/visualesHouse.html` -> Archivo principal de p5.js con la obra visual.
- `/audienceBridge/server.js` -> Servidor Node.js para el público.
- `/audienceBridge/audience.html` -> Interfaz móvil ("Audience Arena").
- `/ProyectoOSC/OpenStageControlUITest/bridgeUI.js` -> Puente UDP a WebSockets para el Knob.
