# Unidad 1

## Bitácora de proceso de aprendizaje


## Bitácora de aplicación 

ACTIVIDAD 04

Unidad 1 – Creación de una pieza de audio interactiva (Strudel)

Obra: Arquitectura Sonora de Juego 

Herramienta: Strudel

1) Intención de la obra (concepto)
   
Esta pieza se diseñó como un sistema musical modular inspirado en música dinámica de videojuegos. En lugar de componer una sola canción lineal, se construyó un motor de audio donde cada instrumento conserva una identidad sonora fija (mismo timbre y rol), pero puede ejecutar múltiples partituras compatibles.
La “interacción” ocurre en el acto de live coding: durante la performance se seleccionan y combinan partituras en vivo, lo que genera transiciones narrativas coherentes (exploración, tensión, combate y calma) sin romper la unidad estética del mundo sonoro.

2) Diseño del sistema (instrumentos y roles)

Se definieron 5 instrumentos/roles fijos (identidad del mundo):

Drone (armónico / ambiente): sostiene el mundo y la atmósfera.

Kick (percusión baja): representa movimiento / avance.

Hats (percusión alta): añade tensión rítmica y energía.

Melodía: comunica emoción narrativa (curiosidad, inquietud, urgencia).

Eventos: señales de peligro o acción (interrupciones / glitches).

No cambia la paleta de instrumentos, cambian únicamente las partituras que cada instrumento ejecuta.

3) Proceso paso a paso
   
 Paso 1 Base mínima: Drone
 Código Paso 1
```js
setcpm(112/4)

note("c3 ~ g3 ~")
  .sound("triangle")
  .gain(0.12)
  .lpf(1000)
  .room(0.7)
```
<img width="1849" height="321" alt="image" src="https://github.com/user-attachments/assets/46426c00-a169-4a36-b5ae-bbf05ba12984" />

El drone define el tono. Elegí triangle por su carácter suave, y filtro bajo para mantenerlo cálido.





Paso 2 Movimiento: añadir Kick

 Paso 2
```js
setcpm(112/4)

stack(
  note("c3 ~ g3 ~")
    .sound("triangle")
    .gain(0.12)
    .lpf(1000)
    .room(0.7),

  s("bd ~ ~ ~")
    .bank("RolandTR909")
    .gain(0.7)
)
.gain(0.9)
```

 El kick entra como señal de movimiento. Usé un patrón simple (bd ~ ~ ~) para no competir con la atmósfera.

 Paso 3 Tensión rítmica: añadir Hats

```js
setcpm(112/4)

stack(
  note("c3 ~ g3 ~")
    .sound("triangle")
    .gain(0.12)
    .lpf(1000)
    .room(0.7),

  s("bd ~ ~ ~")
    .bank("RolandTR909")
    .gain(0.7),

  s("~ hh ~ hh")
    .bank("RolandTR909")
    .gain(0.35)
    .lpf(7000)
)
.gain(0.9)
```
Los hats agregan una sensación de ‘alerta’. El filtro alto evita que suenen ásperos.

Paso 4 Emoción: añadir Melodía

```js
setcpm(112/4)

stack(
  note("c3 ~ g3 ~")
    .sound("triangle")
    .gain(0.12)
    .lpf(1000)
    .room(0.7),

  s("bd ~ ~ ~")
    .bank("RolandTR909")
    .gain(0.7),

  s("~ hh ~ hh")
    .bank("RolandTR909")
    .gain(0.35)
    .lpf(7000),

  note("~ e4 ~ g4")
    .sound("sine")
    .gain(0.18)
    .lpf(3500)
    .room(0.5)
)
.gain(0.9)
```

 “La melodía da dirección emocional. Elegí sine para que sea clara pero suave, como un indicador narrativo.”

Paso 5 añadir Eventos (glitch)

```js
setcpm(112/4)

stack(
  note("c3 ~ g3 ~")
    .sound("triangle")
    .gain(0.12)
    .lpf(1000)
    .room(0.7),

  s("bd ~ ~ ~")
    .bank("RolandTR909")
    .gain(0.7),

  s("~ hh ~ hh")
    .bank("RolandTR909")
    .gain(0.35)
    .lpf(7000),

  note("~ e4 ~ g4")
    .sound("sine")
    .gain(0.18)
    .lpf(3500)
    .room(0.5),

  s("~ sd ~ ~")
    .bank("RolandTR909")
    .gain(0.4)
    .speed("1.4")
)
.gain(0.9)
```
Los eventos funcionan como feedback del sistema: anuncian riesgo sin necesidad de subir todo el ritmo.

Paso 6 – Sistema final: partituras por instrumento

```js
setcpm(112/4)

// DRONE: 0–3
let DRONE_SCORE = 0
// KICK: 0–3
let KICK_SCORE = 0
// HATS: 0–3
let HAT_SCORE = 0
// MELODÍA: 0–3
let MELODY_SCORE = 0
// EVENTOS: 0–3
let EVENT_SCORE = 0

const droneScores = ["c3 ~ g3 ~","c3 ~ g3 bb3","c3 eb3 g3 ~","c3 g3 bb3 eb4"]
const kickScores  = ["~ ~ ~ ~","bd ~ ~ ~","bd ~ bd ~","bd*4"]
const hatScores   = ["~ ~ ~ ~","~ hh ~ hh","hh hh ~ hh","hh*8"]
const melodyScores= ["~ ~ ~ ~","~ e4 ~ g4","g4 ~ f4 ~","<e4 g4 bb4>*2"]
const eventScores = ["~ ~ ~ ~","~ sd ~ ~","sd ~ sd ~","sd(3,8)"]

const DRONE =
  note(droneScores[DRONE_SCORE]).sound("triangle").gain(0.12).lpf(1000).room(0.7)

const KICK =
  s(kickScores[KICK_SCORE]).bank("RolandTR909").gain(0.7)

const HATS =
  s(hatScores[HAT_SCORE]).bank("RolandTR909").gain(0.35).lpf(7000)

const MELODY =
  note(melodyScores[MELODY_SCORE]).sound("sine").gain(0.18).lpf(3500).room(0.5)

const EVENTS =
  s(eventScores[EVENT_SCORE]).bank("RolandTR909").gain(0.4).speed("1.4")

stack(DRONE, KICK, HATS, MELODY, EVENTS).gain(0.9)
```

## Codigo completo: 
```js
setcpm(112/4)

// DRONE: 0–3
let DRONE_SCORE = 3

// KICK: 0–3
let KICK_SCORE = 0

// HATS: 0–3
let HAT_SCORE = 3

// MELODÍA: 0–3
let MELODY_SCORE = 3

// EVENTOS: 0–3
let EVENT_SCORE = 0

/* ---------- DRONE (MUNDO) ---------- */

const droneScores = [
  // 0 – exploración estable
  "c3 ~ g3 ~",

  // 1 – exploración abierta
  "c3 ~ g3 bb3",

  // 2 – tensión armónica
  "c3 eb3 g3 ~",

  // 3 – zona peligrosa
  "c3 g3 bb3 eb4"
]

const DRONE =
  note(droneScores[DRONE_SCORE])
    .sound("triangle")
    .gain(0.12)
    .lpf(1000)
    .room(0.7)

/* ---------- KICK (MOVIMIENTO) ---------- */

const kickScores = [
  // 0 – quietud
  "~ ~ ~ ~",

  // 1 – caminar
  "bd ~ ~ ~",

  // 2 – avance constante
  "bd ~ bd ~",

  // 3 – persecución
  "bd*4"
]

const KICK =
  s(kickScores[KICK_SCORE])
    .bank("RolandTR909")
    .gain(0.7)

/* ---------- HATS (TENSIÓN RÍTMICA) ---------- */

const hatScores = [
  // 0 – aire
  "~ ~ ~ ~",

  // 1 – pulso ligero
  "~ hh ~ hh",

  // 2 – tensión
  "hh hh ~ hh",

  // 3 – presión máxima
  "hh*8"
]

const HATS =
  s(hatScores[HAT_SCORE])
    .bank("RolandTR909")
    .gain(0.35)
    .lpf(7000)

/* ---------- MELODÍA (EMOCIÓN) ---------- */

const melodyScores = [
  // 0 – silencio narrativo
  "~ ~ ~ ~",

  // 1 – curiosidad
  "~ e4 ~ g4",

  // 2 – inquietud
  "g4 ~ f4 ~",

  // 3 – urgencia
  "<e4 g4 bb4>*2"
]

const MELODY =
  note(melodyScores[MELODY_SCORE])
    .sound("sine")
    .gain(0.18)
    .lpf(3500)
    .room(0.5)

/* ---------- EVENTOS (PELIGRO) ---------- */

const eventScores = [
  // 0 – sin riesgo
  "~ ~ ~ ~",

  // 1 – advertencias
  "~ sd ~ ~",

  // 2 – amenaza
  "sd ~ sd ~",

  // 3 – caos
  "sd(3,8)"
]

const EVENTS =
  s(eventScores[EVENT_SCORE])
    .bank("RolandTR909")
    .gain(0.4)
    .speed("1.4")

/* ---------- SALIDA FINAL ---------- */

stack(
  DRONE,
  KICK,
  HATS,
  MELODY,
  EVENTS
)
.gain(0.9)
```
## Bitácora de reflexión

<img width="915" height="721" alt="image" src="https://github.com/user-attachments/assets/6d5b8e20-4e52-4288-a715-97fc02ee26c1" />


En el caso de estudio, Strudel genera un patrón musical que se convierte internamente en eventos temporales (haps). Un scheduler dispara estos eventos en el tiempo correcto y el motor de audio los reproduce. Paralelamente, el proyecto incluye un puente audiovisual que captura información de esos eventos (o del análisis del audio) y la guarda como estado compartido. El sketch de p5.js corre en un bucle por frames (draw()), lee ese estado en cada frame y lo traduce a parámetros visuales (tamaño, color, aparición de partículas, movimiento). Así, un evento musical en Strudel se convierte en una reacción visual verificable en p5.js.





