# Unidad 3

## Bitácora de proceso de aprendizaje

En esta unidad comenzamos haciendo una prueba básica para entender cómo funciona Open Stage Control antes de integrarlo con mi obra.

Primero cloné el repositorio que nos compartieron desde GitHub y lo abrí en Visual Studio Code. Luego instalé las dependencias con npm install y ejecuté el archivo bridgeUI.js usando node bridgeUI.js. En la consola verifiqué que el servidor estaba escuchando en los puertos correctos (WebSocket 8081 y OSC 9000).

Después descargamos Open Stage Control y creé una interfaz sencilla con un fader. Configuré el host en 127.0.0.1 y el puerto en 9000 para que enviara los mensajes al bridge.

En el archivo sketch.js dejé el ejemplo básico que recibía un valor desde el fader usando la dirección /fader_1. Ese valor controlaba el fondo y una barra visual en pantalla.

Al mover el fader y ver que el fondo cambiaba en tiempo real, confirmé que la conexión entre Open Stage Control, el bridge y p5.js estaba funcionando correctamente.

Esta primera prueba me ayudó a entender la lógica completa del sistema: Open Stage Control envía un mensaje OSC, el bridge lo convierte a WebSocket y el sketch lo recibe para modificar la visual.

## Bitácora de aplicación 



## Bitácora de reflexión
