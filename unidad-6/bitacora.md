# 📤 Unidad 6 - Bitácora de Proyecto: "Ansiedad Digital (El Astronauta)"

---

## Actividad 01: Estética Visual de la Obra (Define)

**¿Qué tipo de visuales van a acompañar tu audio?**
Para acompañar la historia auditiva opté por representaciones figurativas soportadas por arte generativo en 2D. En lugar de limitarme a formas geométricas abstractas aisladas, utilicé Inteligencia Artificial para ilustrar a un **"Astronauta extraviado en un mar de ciberdatos"** con 4 diferentes niveles de degradación visual.

**¿Qué paleta de colores usarás y por qué?**
Predominancia de fondos negros espaciales con azules fríos y cyan tecnológico/matrix. Mi decisión central (tras probar con alarmas hiper-rojas estroboscópicas que dañaban la inmersión por ser cansinas a la vista) fue apoyarme en la pérdida de la luz. En el estado crítico o de "alarma", elimino el oxígeno visual alterando el lienzo hacia un gris azulado y fúnebre para dar la asfixia real.

**¿Cómo reaccionarán las visuales al audio? (Mapeo)**
- **SYNTH_PAD (Ambiente):** Transiciona entre los 4 fondos base del astronauta.
- **KICK_BEAT (Pulso):** Determina el latido general, causando zips de ahogo o Zoom bruscos a la cámara principal, simulando fallos de frecuencia cardíaca o latidos acelerados.
- **BASS_DRIVE (Bajo 303):** Se refleja en sismos directos; sacude violentamente el encuadre renderizado en el eje X/Y.
- **HIHAT_SWARM:** Multiplica la cantidad, densidad y velocidad de la "lluvia de código Matrix" que cae sobre el casco.
- **DATA_NOISE:** Esparce pop-ups falsos ("Ventanas de advertencia de error") flotando y disolviéndose iterativamente.
- **GLITCH_STORM:** Interviene con un Screen Tearing rítmico, rasgando bandas de la pantalla de forma lateral simulando estática vieja de radiocomunicación.
- **ALARM_STATE:** Absorbe la luz vívida y tiñe la pantalla de gris frío espectral, con el mensaje asfixiante intermitente "S I G N A L  L O S T".

**¿Por qué estas decisiones estéticas sirven al concepto de tu obra?**
Sirven directamente para personificar en pantalla cómo debe sentirse la "sobrecarga de información" en la era del ciber-estrés crónico. Ver a un usuario representado romperse daña más psicológicamente que simplemente ver figuras en pantalla estallar.

---

## Actividad 02: Exploración de Técnicas (Seek y Prototipado)

**Las técnicas exploradas y los prototipos realizados.**
Inicialmente encaré la visualización armando todo un entorno procedural en `WebGL` dentro de *p5.js* (Sistemas 3D generativos de Mallas a partir de *Perlin Noise* con cilindros gigantes y monolitos). Mapeaba la música a estructuras físicas 3D volando a nuestro lado.

**Los resultados de cada prototipo (qué funcionó, qué no, qué ajustaste).**
- El motor en `WebGL` se veía sumamente vanguardista, pero *falló masivamente en rendimiento local*. Al activar todo, los ciclos de bucle destrozaban los fotogramas bajando drásticamente el FPS natural, y haciéndolo muy 'lageado' e insoportable a niveles de intensidad de partituras (BPM alto).
- Fue necesario hacer un "rolback" y rediseñar estructuralmente mi obra. Ajusté la técnica: volví al lienzo puramente en *2D clásico*, pero recargándolo de arte visual inteligente (pre-cacheados a la tarjeta con `.preload()`), y utilizando el procesado de imágenes directo junto a partículas simples.

**La técnica o combinación elegida.**
Un entorno 2D interactivo (`p5.js` básico) con Imágenes base alimentada modularmente por capas alpha y traslaciones bidimensionales cruzadas. Solucionó rotundamente el LAG sin perder carga cognitiva/psicológica.

---

## Actividad 03: Implementación e integración audiovisual (Apply)

**El proceso de implementación y cómo lograste sincronización:**
Implementé toda la infraestructura sobre WebSocket directo, deshaciéndome de VJs intermedios como TouchDesigner para bajar cualquier lag entre comandos. Escribí un puente ligero en **Node.js (`OSCBridge`)** con `ws` que espera los comandos UDP y escucha la directiva nativa pura de `Strudel` (`() => .osc()`). Todo el audio en milisegundos reales se manda en `JSON` al renderizado 2D.

**Código de sincronía (Strudel Core):**
```javascript
$: stack(PAD, BASS, KICK, HIHAT, DATA, GLITCH, VOICE, ALARM).gain(0.8)
$: stack(PAD.osc(), BASS.osc(), KICK.osc(), HIHAT.osc(), DATA.osc(), GLITCH.osc(), VOICE.osc(), ALARM.osc())
```

**Instrucciones de reproducción de la Obra hasta este punto:**
1. Despliega el puente con `node bridge.js` (puerto 8080 local habilitado).
2. Arranca el motor nativo Strudel para Live coding con `pnpm dev --port 5000`.
3. Navega de inmediato a `http://localhost:5000/visualesHouse.html`. 
4. Escribe el loop en Strudel y dispara con **Shift+Enter**. Ajusta las densidades del 0 al 3 desde las declaraciones let en caliente para ver al sistema transicionar las vistas del astronauta y sobrecargar su pantalla con notificaciones y sismos. *(Todo el código fue anexado a este repositorio).*

---

## Actividad 04: Consolidación y metacognición (Reflect)

**Evalúa la coherencia entre audio y visuales... ¿Se logra la experiencia deseada?**
Lo logré satisfactoriamente. Tras varios traspiés intentando geometrías (donde yo mismo y los revisores sentían vacía la propuesta), este *rediseño narrativo/ilustrado* capturó a la perfección ese sentimiento "agotador y ahogante" sin dañar la fluidez cibernética experimental. Me complace altamente haber invertido mi tiempo corrigiendo el efecto de alarma rojo estroboscópico por un color gris pálido tenebroso "SIGNAL LOST", dándole el punto inmersivo y no uno invasivo a la retina.

**Mi Diagrama de Sistema Final:**
```mermaid
flowchart TD
    subgraph S_ROOT ["Sintaxis Audio (Strudel 5000)"]
        SV[Variables Multipropósito 0 a 3] --> SR[Motor Funcional Audio Tidal]
        SR -->|Output .osc() Sync| SE((Paquete UDP de Estados))
    end
    
    subgraph B_ROOT ["Administrador Server (Node.js 3000)"]
        SE -->|Localhost WS In| BT[Parser de Eventos y Broadcast JS]
        BT -->|Variables Transformadas| BW[Emisión en WS Cliente 3000]
    end
    
    subgraph V_ROOT ["Motor Frontal de Narración (p5.js CSS/HTML)"]
        BW -->|Señal JSON| VP[Motor Selector del Astronauta y Canvas State]
        VP --> VC[Interposición de Lluvia Hacker, Zoom, Tearing y Popups]
    end
```

**Principales desafíos enfrentados:**
Entender cómo sacrificar el "gran atractivo técnico" (como las tormentas de WebGL 3D) en favor del "gran funcionamiento técnico" (60 fps ininterrumpibles) sin que la premisa estética visual muriera en el intento. La flexibilidad fue mi gran activo al aprender a reconstruir sistemas visuales combinando métodos pre-renderizados en Canvas.