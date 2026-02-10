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



## Bitácora de reflexión




