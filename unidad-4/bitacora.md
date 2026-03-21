# Unidad 4

# Bitacora de Aprendizaje y Aplicacion: Integracion del Publico

## Set: Que aprenderas en esta unidad?
**Objetivo:** Integrar al publico como un agente activo dentro de la obra audiovisual, permitiendoles modificar parametros y desencadenar eventos en tiempo real a traves de sus dispositivos moviles.

**Conceptos, tecnicas y herramientas:**
Para lograr esta integracion bidireccional masiva, necesite emplear:
1. **Node.js y Express:** Como entorno de ejecucion backend para levantar un servidor HTTP ligero capaz de servir la interfaz wev (`audience.html`) a los telefonos del publico a traves de la red local.
2. **WebSockets (Libreria `ws`):** A diferencia de HTTP (que requiere peticiones constantes o *polling*), los WebSockets mantienen un canal de comunicacion bidireccional abierto y persistente con muy baja latencia, lo cual es vital para enviar los "taps" del publico inmediatamente al motor visual.
3. **Event-Driven UI (HTML/CSS/JS Vanilla):** El desarrollo de una interfaz movil optimizada y de carga instantanea (sin frameworks pesados), diseñada mediante Flexbox y CSS Grids, reaccionando a eventos *onclick* para registrar las interacciones de los usuarios.

---

## Seek: Investigacion
**Planeacion de la interactividad:**
El reto era: ¿Como puede el publico interactuar con un mundo generativo (p5.js) controlado ya parcialmente por el live coder (Strudel) y una superficie fisica (Open Stage Control)? 
Decidi crear un concepto llamado **"Audience Arena"**, democratizando el control a traves del navegador de los smartphones de los expectadores.

**Acciones seleccionadas para el publico:**
Al analizar mi codigo base en p5.js (`visualesHouse.html`), determine 4 niveles de interaccion colectiva:
1. **Votacion de Bioma:** Un sistema democratico temporal donde la mayoria decide el cambio del escenario visual (`SCENE`), integrando un medidor grafico progresivo en tiempo real.
2. **Envio de Vida (Positivo):** Un boton que permite curar al jugador (`hp`) y generar feedback visual directo en el juego (particulas de corazones).
3. **Invocacion de Caos (Negativo):** Un boton destructivo que sacude fuertemente la camara (multiplicador de paramtero `shake`) y genera spawns forzados de mas enemigos.
4. **Energia Colectiva (Mega Evento):** Una mecanica de spamming ("button mashing") que acumula una barra de energia de 0 a 100 compartida por toda la sala. Al llegar al 80%, el servidor dispara una limpieza total de enemigos como interaccion divina.

---

## Apply: Aplicacion
**Ejecucion tecnica e implementacion:**
Lleve a cabo el desarrollo en dos frentes simultaneos: un nuevo ecosistema de servidor (`audienceBridge`) y la actualizacion del cliente visual en p5.js.

**Pasos documentados y codigo:**
1. **El Servidor Puente (`server.js`):**
   Cree un archivo que simultaneamente levanta la pagina web con Express (Puerto HTTP 3000) y el servidor WebSocket (Puerto 8083).
   Configure en la logica dos "Set" distintos para distinguir si un WebSocket pertenece a un miembro del publico (audiencia) o es la pantalla principal en p5.js (`/visual`).
   - Se administran variables compartidas globales en `server.js` (`biomeVotes`, `collectiveEnergy`, `connectedCount`).
   - Todos los mensajes (ej. `{ type: "send_life" }`) se transmiten (broadcast) al cliente visual con JSON.

2. **La interfaz del Usuario (`audience.html`):**
   Disene una aplicacion web estetica responsive, con temas dark-mode (Gaming), botones que mapean al `ws.send()`, barras de progreso fluidas usando transiciones CSS y logica para deshabilitar botones temporalmente (cooldown de 500ms) evadiendo auto-clickers.

3. **Modificacion de la obra (Tercer WebSocket en `visualesHouse.html`):**
   Tuve que insertar una tercera conexion asincrona en el setup de p5.js (`connectAudience()`).
   A este punto, el cliente visual recibe y renderiza simultaneamente:
   - *ws://localhost:8081*: La musica / tempo (Strudel).
   - *ws://localhost:8082*: El control absoluto del Host (Open Stage Control).
   - *ws://localhost:8083*: El caos del Publico (Audience Arena).

---

## Reflect: Consolidacion y metacognicion
Incorporar al publico altero fundamentalmente el rol pasivo del espectador audiovisual, convirtiendolos en jugadores colectivos. El principal aprendizaje arquitectonico fue que centralizar el Estado (quien tiene cuantos votos, energia, etc.) rigurosamente dentro del  `server.js` previene desincronizaciones frente a cientos de publicos web conectandose y desconectandose libremente. La obra ahora reside en multiples nodos distribuidos (Live coder, Controlador Físico, Pantalla Principal y Celulares).
