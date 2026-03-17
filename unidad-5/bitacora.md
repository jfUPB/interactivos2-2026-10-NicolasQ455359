# Unidad 5
## Bitácora de proceso de aprendizaje

### Conceptualización de la obra
 ### Intención artística

La idea de mi obra es explorar la relación entre lo humano y lo digital, específicamente cómo un sistema puede parecer “vivo” cuando responde en tiempo real a la presencia de una persona.

Me interesa provocar en el público una sensación de curiosidad y también un poco de duda, como si no estuvieran seguros de si el sistema solo está reaccionando o si realmente está “percibiendo” lo que hacen. La obra busca que el usuario sienta que su cuerpo tiene un impacto directo en lo que está ocurriendo, especialmente a nivel sonoro.

También quiero trabajar esa idea de que lo digital no es algo completamente separado de lo humano, sino que puede comportarse de manera orgánica dependiendo de cómo interactuemos con él.

### Contexto de presentación

La obra está pensada para un domo pequeño y en un espacio oscuro. Esto permite que la experiencia sea más inmersiva, ya que se eliminan distracciones externas y el público puede concentrarse completamente en el sonido y en la interacción.

El domo también refuerza la sensación de estar “dentro” del sistema, no solo observándolo desde afuera.

### Experiencia del público

La experiencia que quiero generar es principalmente inmersiva, pero con una transición hacia lo participativo.

Al inicio, el sistema puede estar en un estado más pasivo o “dormido”. A medida que el público entra o se mueve, el audio comienza a activarse y cambiar. La idea es que el usuario descubra poco a poco que su presencia tiene un efecto en la obra.

No quiero que sea una interacción explícita tipo “botón”, sino algo más sutil, donde el usuario entienda la relación a través de la exploración.

### Rol del público

El público no es solo un observador, sino que cumple un rol activo dentro del sistema.

Su cuerpo funciona como input, es decir, como una fuente de datos que el sistema utiliza para generar el sonido. En ese sentido, el usuario se convierte en una especie de co-creador de la obra, ya que sin su presencia o movimiento, el sistema no se activa de la misma manera.

### Arquitectura del sistema (primer planteamiento)

El sistema está pensado como una cadena de procesos donde cada parte cumple un rol específico:

El público entra al espacio y genera datos a través de su presencia o movimiento.

Estos datos son capturados por un sistema de entrada (por ejemplo, cámara o sensores).

Luego, esa información se procesa (posiblemente con p5.js o visión artificial).

Los datos procesados se envían a Strudel.

Finalmente, el sonido se reproduce en el espacio.

### Referentes
  ### Ryoji Ikeda
  <img width="1000" height="668" alt="image" src="https://github.com/user-attachments/assets/683c7b1b-dcd9-4809-a7ee-489fedf056be" /> <img width="2400" height="1223" alt="image" src="https://github.com/user-attachments/assets/12c51724-171d-4bb0-ae53-a2983b9cf6fd" />
  Me interesa su trabajo porque utiliza el sonido de forma muy precisa y estructurada, generando experiencias que se sienten muy inmersivas y casi físicas. Su enfoque minimalista también me inspira para pensar en cómo pocos elementos pueden generar una experiencia fuerte.

  ### Rafael Lozano-Hemmer
  <img width="1200" height="630" alt="image" src="https://github.com/user-attachments/assets/5624b991-e8da-4758-a43e-9fa525164873" />
  Su trabajo es clave porque pone al público en el centro de la obra. Me interesa especialmente cómo utiliza datos del cuerpo para generar experiencias, y cómo la obra no existe de la misma manera sin la participación de las personas.

  ### Holly Herndon
  <img width="2560" height="1706" alt="image" src="https://github.com/user-attachments/assets/ee706199-9474-49e1-ad45-c52f81f3d559" />
  Holly Herndon trabaja con sistemas generativos y el uso de tecnología para producir sonido en tiempo real. Su enfoque mezcla lo humano y lo artificial, lo cual conecta directamente con la intención de mi obra. Me interesa cómo el audio no es completamente predefinido, sino que emerge a partir de un sistema. Esto me inspira a pensar el sonido como algo vivo, que cambia dependiendo de la interacción del usuario.

  ### Brian Eno (música generativa)
  <img width="1000" height="668" alt="image" src="https://github.com/user-attachments/assets/36db6320-8a17-4b40-a7c6-2987daf8c8f0" />
  Brian Eno es uno de los referentes más importantes en música generativa. Su enfoque se basa en sistemas que producen variaciones constantes sin repetirse exactamente. Esto es clave para mi proyecto porque quiero evitar loops evidentes y generar una sensación de evolución continua en el sonido, dependiendo de la presencia del público.

  
- Mi intención es que la obra funcione como un sistema sensible a la presencia humana, donde el sonido actúe como una manifestación de esa interacción. Más que controlar directamente la obra, el usuario la influye, generando una relación más orgánica entre cuerpo, espacio y sistema digital.


### Técnicas de audio generativo que voy a usar

1. Generación de patrones dinámicos

Voy a usar Strudel para generar patrones rítmicos o sonoros que no sean completamente fijos, sino que puedan variar en el tiempo.

¿Por qué?
Porque quiero que el sonido se sienta vivo, no repetitivo. Esto conecta con la idea de que el sistema responde y evoluciona.

2. Modulación de parámetros en tiempo real

Planeo controlar variables como:

Velocidad (tempo)

Densidad de eventos sonoros

Volumen

Filtros (frecuencia)

Estos parámetros van a cambiar según la interacción del usuario.

¿Por qué?
Esto permite que el cuerpo del usuario influya directamente en el comportamiento del sistema, reforzando la idea de co-creación.

3. Relación input → sonido (mapping)

Voy a trabajar un mapping donde los datos del usuario (por ejemplo, movimiento o presencia detectada por cámara) se traduzcan en cambios en el audio.

Ejemplo:

Más movimiento → más densidad sonora

Menos movimiento → sonido más ambiental o vacío

¿Por qué?
Porque quiero que la relación sea intuitiva, aunque no sea explícita, para que el usuario la descubra explorando.

4. Capas sonoras (layering)

El sistema tendrá varias capas de sonido:

Base ambiental (siempre presente)

Capas que se activan con interacción

Elementos más intensos según mayor actividad

¿Por qué?
Esto permite construir una experiencia progresiva, donde el sistema “despierta” poco a poco.

5. Variación continua (no loops evidentes)

Voy a evitar estructuras repetitivas muy marcadas y trabajar con variaciones constantes.

¿Por qué?
Para que la experiencia se sienta orgánica y no mecánica, alineada con la idea de un sistema “vivo”.

Conclusión

Los referentes me ayudaron a entender cómo el audio generativo puede ser usado no solo como sonido de fondo, sino como el elemento principal de una experiencia interactiva. A partir de esto, decidí trabajar con un sistema donde el sonido responde en tiempo real a la presencia del usuario, utilizando variaciones, capas y modulación de parámetros para generar una experiencia inmersiva y cambiante.


## Bitácora de aplicación 



## Bitácora de reflexión
