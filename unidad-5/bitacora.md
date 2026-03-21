# 📤 Bitácora 5 - Tormenta de Datos (Unidad 5)

---

## Actividad 01: Concepto de la Obra

**¿Qué quiero comunicar o provocar con mi obra? (intención artística/estética)**
Quiero comunicar la "ansiedad digital" y provocar una sensación de inmersión total en la sobrecarga tecnológica y la extrema velocidad de la era contemporánea. La estética se basa en el ruido algorítmico, el ritmo hiper-mecanizado y el flujo abrumador de información.

**¿En qué contexto se presentará? (sala oscura, espacio abierto, escenario, etc.)**
La presentaré en un espacio de instalación cerrado, preferentemente un **Mini Domo** o una sala oscura envolvente a media luz, maximizando el aislamiento sensorial para potenciar la acústica y el contraste de las proyecciones visuales parpadeantes.

**¿Cuál es la experiencia que deseo para el público? (contemplativa, participativa, inmersiva, etc.)**
Busco una experiencia **inmersiva e hiper-estimulante**. Comenzará con un silencio tenso espeluznante, casi contemplativo, que escalará violentamente hacia una tormenta electrónica opresiva e hipnótica, ahogando los sentidos de la audiencia.

**¿Qué rol tendrá el público? (observador, participante activo, co-creador, etc.)**
El público tendrá un rol de **observador inmerso**. Su rol principal es el de un partícipe sensorial pasivo enfrentado al volumen de datos, permitiendo que mi obra lo sature por completo. A futuro, este rol busco que derive parcialmente en "participante activo" mediante el envío de variables externas a la red interna que rige mi servidor.

**Mis 3 referentes artísticos o técnicos:**
1. **Ryoji Ikeda**: *data.tron* / *Supercodex*
> ![Ryoji Ikeda Estética](https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800)

2. **Autechre (Warp Records)**: *Gantz Graf*
> ![Autechre Estética Glitch](https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800)

3. **Alva Noto (Carsten Nicolai)**: *Xerrox Series*
> ![Alva Noto Minimalismo de Eco](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800)

---

## Actividad 02: Investigación de referentes y técnicas (Seek)

**Los referentes encontrados y por qué son relevantes para mi obra:**
- **Ryoji Ikeda** es vital porque utiliza frecuencias extremas, *clicks* informáticos y estática pura combinada con proyecciones visuales matemáticas hipercodificadas. Es la inspiración directa para mi base estética tecnológica de pings, redes y comportamiento láser.
- **Autechre** es relevante porque su música abraza y expone el caos controlado algorítmico. Su obra *Gantz Graf* muestra visuales abstractos en 3D que reaccionan agudamente a la percusión más fracturada e industrial, demostrando que el error de sistema (el *glitch*) también puede tener bases rítmicas hipnóticas aplicables a mi proyecto.
- **Alva Noto** es relevante por su uso impecable de las reverberaciones inmensas y ecos sintéticos en fallos acústicos. Estas características estéticas me son absolutamente necesarias para darle a la partitura la envergadura y sensación de escala "gigante" requeridas en un escenario como el Mini Domo.

**Las técnicas de audio generativo que planeo usar y por qué se ajustan a mi concepto:**
- **Live Coding Multicapa (Strudel/TidalCycles)**: Usaré programación en vivo con sintaxis de bucles encadenados. Mi obra no debe ser un escenario musical de audio estático; debe evolucionar de manera impredecible y reaccionar a variables modulares algorítmicas en tiempo real.
- **Manipulación Destructiva de Ondas (Bitcrush, Jux rev y LPF/HPF)**: Usaré funciones matemáticas destructivas para machacar los samples introduciendo distorsión opresiva a propósito, encajando a la perfección con los principios teóricos de mi concepto de *Data Overload*.
- **Arreglos Lógicos de Variación Dinámica (0 a 3)**: Almacenaré listas de comportamientos métricos, de forma que un simple ajuste de mis variables en el código desate mutaciones mucho más agresivas y veloces en todas mis 8 subcapas orquestales simultáneamente.

---

## Actividad 03: Implementación del audio generativo (Build)

**El proceso de creación de mi audio generativo:**
Mi proceso creativo inició conceptualizando 8 capas sonoras autónomas, asignándoles un rol narrativo a cada una dentro de la "arquitectura computacional": el ambiente tétrico inicial (Pad y Drone alienígena), la percusión pesada base (Kick 909 y Bass 303), el tráfico estroboscópico de datos (bips y hi-hats de CPU ultrarrápidos) y mi propio exceso destructivo con alarmas críticas. En lugar de escribir ritmos fijos, programé 8 matrices de código donde cada matriz cuenta con umbrales que ascienden desde el silencio contemplativo (caos 0) hasta la avalancha estroboscópica abrumadora (caos 3). Finalmente, orquesté todas las líneas de comando en sincronía usando funciones de evaluación nativas en Strudel (`$: stack`).

**Las decisiones técnicas y estéticas que tomé y por qué:**
1. **Opacidad Industrial:** Buscaba representar el sucio y opresivo espectro del techno primitivo; decidí cargar bancos icónicos (`TR909`), pero apliqué agresivamente filtros sobre la señal (`lpf`) para apagar intencionalmente el color brillante de fábrica, logrando que los impactos se sintieran como pesada maquinaría.
2. **Sincronía Nativa Audio-Visual**: Decidí rechazar clientes de conexión ineficientes en favor de encadenar mi emisión de comandos nativamente con un envío `.osc()` al pie y salida de mis capas. Al reproducir una nota, yo mismo dicto el disparo exacto vía evento UDP hacia mis estroboscopios remotos de Node.js -> p5.js, impidiendo la desincronización por milisegundos.

**El código completo de la pieza de audio:**
```javascript
setcpm(135/4)

// MIS VARIABLES DINÁMICAS (0 a 3) - Cambiables en vivo mediante Shift+Enter
let SYNTH_PAD = 0; let BASS_DRIVE = 0; let KICK_BEAT = 0; let HIHAT_SWARM = 0;
let DATA_NOISE = 0; let GLITCH_STORM = 0; let VOICE_CHOP = 0; let ALARM_STATE = 0;

/* --- 1. SYNTH PAD (Atmósfera) --- */
const padScores = ["c2 ~ ~ ~", "c2 ~ eb2 ~", "c2 g2 eb2 c3", "<[c2 g2] [eb2 c3] [ab1 eb2] [g1 d2]>"]
const PAD = note(padScores[SYNTH_PAD]).s("sawtooth").lpf(800).sustain(4).room(0.9).sz(0.9).gain(0.6)

/* --- 2. BASS DRIVE (Bajo Ácido TB303) --- */
const bassScores = ["~", "c1(3,8)", "c1*8", "[c1 c2]*8"]
const BASS = note(bassScores[BASS_DRIVE]).s("tb303").lpf(600).gain(0.7).jux(rev)

/* --- 3. KICK BEAT (Impacto Industrial) --- */
const kickScores = ["~", "bd(1,4)", "bd(3,8) ~", "bd*4"]
const KICK = s(kickScores[KICK_BEAT]).bank("RolandTR909").lpf(150).room(0.2).gain(1.3)

/* --- 4. HIHAT SWARM (Alta Frecuencia) --- */
const hatScores = ["~", "~ hh", "hh*8", "hh*16"]
const HIHATS = s(hatScores[HIHAT_SWARM]).bank("RolandTR909").gain(0.5).pan(perlin)

/* --- 5. DATA NOISE (Pings de Red y Servidor) --- */
const dataScores = ["~", "bleep(2,8)", "cpu(5,8)", "print(3,8) [cpu*4]"]
const DATA = s(dataScores[DATA_NOISE]).hpf(2000).gain(0.8)

/* --- 6. GLITCH STORM (Destrucción y Bitcrush) --- */
const glitchScores = ["~", "glitch", "hc(3,8) glitch", "[glitch*8, hc*16]"]
const GLITCH = s(glitchScores[GLITCH_STORM]).jux(rev).crush(3).gain(0.8)

/* --- 7. VOICE CHOP (Fragmentación Sintética) --- */
const voiceScores = ["~", "vocal(1,8)", "vocal(3,8)", "vocal*8"]
const VOICE = s(voiceScores[VOICE_CHOP]).chop(8).jux(rev).gain(0.9).room(0.4)

/* --- 8. ALARM STATE (Colapso Crítico) --- */
const alarmScores = ["~", "~", "~", "c6*2"]
const ALARM = note(alarmScores[ALARM_STATE]).s("sine").room(0.8).gain(0.6).chop(4)

/* --- MEZCLA GENERAL (Mi Audio Output) --- */
$: stack(PAD, BASS, KICK, HIHATS, DATA, GLITCH, VOICE, ALARM).gain(0.8)

/* --- TRANSMISIÓN (Mis Señales de Sincronía Visual hacia OSCBridge) --- */
$: stack(PAD.osc(), BASS.osc(), KICK.osc(), HIHATS.osc(), DATA.osc(), GLITCH.osc(), VOICE.osc(), ALARM.osc())
```

**Instrucciones paso a paso para reproducir la instalación:**
1. Despliego el intérprete local iniciando mi puente de red: `node bridge.js` (apertura del canal WebSocket 3000).
2. Inicio en terminal cruzada el servidor Vite interno y aislado: `pnpm dev --port 5000`.
3. Abro desde mi navegador web la dirección reservada `http://localhost:5000/`.
4. Plásmo directamente este bloque de programación dentro del editor principal iterativo (REPL).
5. A continuación, ejecuto con presionar **Shift + Enter**. Intervengo interactivamente los topes de variables entre **0** (Ambiente) hasta empujar al pico **3** (Tormenta Digital).

---

## Actividad 04: Consolidación y metacognición (Reflect)

**Evaluación de si mi audio generativo logra la intención estética. ¿Qué ajustaría?**
Mi partitura estruendosa programática logra el pesado objetivo estético de la obra originaria: la infame "ansiedad digital". Percibo que esto funcionó maravillosamente gracias al contraste que implementé en mis cortes percusivos y mecánicos de la TB303 frente al minimalismo fantasma del Drone 909. Si deseara refinar estructuralmente este proyecto de domo en el futuro, integraría sensores o micrófonos de condensación reales en sala, de forma tal que mi misma "Tormenta Algorítmica" engulla los decibeles humanos del público, y utilice esos umbrales crudos multiplicando el nivel global de Caos, destituyendo mi dependencia de escribir los valores enteros `1, 2, 3` en consola.

**Mi diagrama de sistema oficial actualizado:**
<img width="278" height="694" alt="image" src="https://github.com/user-attachments/assets/7e6bd537-3e53-44e6-bb21-5a68dc62d09c" />


**Principales desafíos que enfrenté y cómo los resolví:**
Mi desafío central procedimental más complejo de sortear fue esquivar ingeniosamente el motor de parser incrustado en el intérprete evaluador de la plataforma web de *Strudel*. Cuando intenté inyectarle directivas variables de sintaxis cruzadas, vi que dicho analizador me destrozaba los bucles rítmicos generándome constantes anomalías visualizadas como `"Mini Parse Errors"` fatales para mi código.

Pude solucionar rotunda y limpiamente la anomalía descartando forzar métodos híbridos en JavaScript crudo. Recurrí e investigué la implementación de los envíos direccionales `() => .osc()` preempaquetados de Strudel nativo. Modifiqué la estrategia, y de esta manera, enjaulé toda la transferencia externa aislada hacia mi código de audio, dotando a la pieza de un 100% de firmeza evaluatoria en ejecución ininterrumpible. Así además logré segmentar sin interferencias estructurales mi ecosistema de red en el canal particular `5000`.
