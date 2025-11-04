const fs = require('fs');
const path = require('path');

// Traducciones manuales para science-quiz-data.json (V1)
const translationsV1 = {
  // Reading sections don't need translations

  // Exam 1: The Planets of Our Solar System
  "The Sun is a planet that moves around the Earth.": {
    questionES: "El Sol es un planeta que se mueve alrededor de la Tierra.",
    explanationES: "Esto es FALSO. El Sol es una estrella, no un planeta. La Tierra y todos los demás planetas se mueven alrededor del Sol, no al revés."
  },
  "There are eight planets in our Solar System.": {
    questionES: "Hay ocho planetas en nuestro Sistema Solar.",
    explanationES: "Esto es VERDADERO. Nuestro Sistema Solar tiene ocho planetas: Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano y Neptuno."
  },
  "The inner planets are made mostly of gas.": {
    questionES: "Los planetas interiores están hechos principalmente de gas.",
    explanationES: "Esto es FALSO. Los planetas interiores (Mercurio, Venus, Tierra y Marte) están hechos principalmente de roca. Los planetas exteriores son los que están hechos principalmente de gas."
  },
  "Earth is the only planet where life is known to exist.": {
    questionES: "La Tierra es el único planeta donde se sabe que existe vida.",
    explanationES: "Esto es VERDADERO. La Tierra es el único planeta en nuestro Sistema Solar donde se sabe que existe vida. Tiene agua, aire y la temperatura adecuada para la vida."
  },
  "Jupiter is the smallest planet in our Solar System.": {
    questionES: "Júpiter es el planeta más pequeño de nuestro Sistema Solar.",
    explanationES: "Esto es FALSO. Júpiter es en realidad el planeta MÁS GRANDE de nuestro Sistema Solar, ¡no el más pequeño!"
  },
  "Saturn is known for its rings.": {
    questionES: "Saturno es conocido por sus anillos.",
    explanationES: "Esto es VERDADERO. Saturno es famoso por sus hermosos anillos hechos de partículas de hielo y roca."
  },
  "The time a planet takes to go around the Sun is called a year.": {
    questionES: "El tiempo que tarda un planeta en dar la vuelta al Sol se llama año.",
    explanationES: "Esto es VERDADERO. Una órbita completa alrededor del Sol equivale a un año para ese planeta. La Tierra tarda 365 días en completar un año."
  },
  "The outer planets are larger than the inner planets.": {
    questionES: "Los planetas exteriores son más grandes que los planetas interiores.",
    explanationES: "Esto es VERDADERO. Los planetas exteriores (Júpiter, Saturno, Urano y Neptuno) son mucho más grandes que los planetas interiores."
  },
  "Mars is one of the outer planets.": {
    questionES: "Marte es uno de los planetas exteriores.",
    explanationES: "Esto es FALSO. Marte es uno de los planetas interiores. Los planetas interiores son Mercurio, Venus, Tierra y Marte."
  },
  "All the planets move around the Sun in orbits.": {
    questionES: "Todos los planetas se mueven alrededor del Sol en órbitas.",
    explanationES: "Esto es VERDADERO. Todos los planetas viajan alrededor del Sol en caminos llamados órbitas. Esto es lo que los mantiene en el Sistema Solar."
  },
  "Choose: Which of the following is an inner planet?": {
    questionES: "Elige: ¿Cuál de los siguientes es un planeta interior?",
    explanationES: "¡Marte es correcto! Marte es uno de los cuatro planetas interiores (Mercurio, Venus, Tierra y Marte). Júpiter, Neptuno y Saturno son planetas exteriores."
  },
  "Pluto is no longer considered a planet because it does not meet all the requirements to orbit cleanly around the Sun.": {
    questionES: "Plutón ya no se considera un planeta porque no cumple con todos los requisitos para orbitar limpiamente alrededor del Sol.",
    explanationES: "Esto es VERDADERO. Plutón fue reclasificado como 'planeta enano' porque no limpia su trayectoria orbital de otros objetos."
  },
  "The Earth rotates on its axis every:": {
    questionES: "La Tierra gira sobre su eje cada:",
    explanationES: "¡24 horas es correcto! La Tierra tarda 24 horas en completar una rotación completa sobre su eje, lo que nos da el día y la noche."
  },

  // Exam 2: Geography - Hemispheres & Earth
  "The continent of Africa is located in 4 hemispheres.": {
    questionES: "El continente de África está ubicado en 4 hemisferios.",
    explanationES: "Esto es VERDADERO. África es el único continente ubicado en los cuatro hemisferios: Norte, Sur, Este y Oeste."
  },
  "Alaska is in the Northern Hemisphere.": {
    questionES: "Alaska está en el Hemisferio Norte.",
    explanationES: "Esto es VERDADERO. Alaska está ubicada en el Hemisferio Norte, sobre el Ecuador."
  },
  "South Africa is in both the Northern and Southern hemisphere.": {
    questionES: "Sudáfrica está tanto en el hemisferio Norte como en el Sur.",
    explanationES: "Esto es FALSO. Sudáfrica solo está en el Hemisferio Sur, debajo del Ecuador."
  },
  "Every place on earth can only be in one hemisphere.": {
    questionES: "Cada lugar en la tierra solo puede estar en un hemisferio.",
    explanationES: "Esto es FALSO. Los lugares pueden estar en DOS hemisferios al mismo tiempo. Por ejemplo, un lugar puede estar tanto en el hemisferio Norte como en el Este."
  },
  "The continent of South America is in the Western hemisphere.": {
    questionES: "El continente de América del Sur está en el hemisferio Oeste.",
    explanationES: "Esto es VERDADERO. América del Sur está ubicada en el Hemisferio Oeste, al oeste del Meridiano de Greenwich."
  },
  "Antarctica is located in three hemispheres.": {
    questionES: "La Antártida está ubicada en tres hemisferios.",
    explanationES: "Esto es FALSO. La Antártida está principalmente en el Hemisferio Sur. Aunque técnicamente toca múltiples hemisferios en sus bordes, se considera principalmente en el Hemisferio Sur."
  },
  "The Indian Ocean is in three hemispheres.": {
    questionES: "El Océano Índico está en tres hemisferios.",
    explanationES: "Esto es VERDADERO. El Océano Índico está ubicado en el Hemisferio Sur, Este y partes del Hemisferio Norte."
  },
  "Which hemisphere is shown by the picture? <img src='quiz_images/hemispheres.jpeg' class='question-image' alt='Globe showing Eastern Hemisphere'>": {
    questionES: "¿Qué hemisferio se muestra en la imagen? <img src='quiz_images/hemispheres.jpeg' class='question-image' alt='Globo mostrando Hemisferio Este'>",
    explanationES: "¡Hemisferio Este es correcto! La imagen muestra África y Asia, que son continentes en el Hemisferio Este."
  },
  "What do the lines in this picture show? <img src='quiz_images/globe.jpeg' class='question-image' alt='Globe with longitude lines'>": {
    questionES: "¿Qué muestran las líneas en esta imagen? <img src='quiz_images/globe.jpeg' class='question-image' alt='Globo con líneas de longitud'>",
    explanationES: "La respuesta correcta es LONGITUD (o meridianos). Estas líneas verticales que van del Polo Norte al Polo Sur se llaman líneas de longitud o meridianos."
  },
  "Which of the following explains why we have day and night?": {
    questionES: "¿Cuál de los siguientes explica por qué tenemos día y noche?",
    explanationES: "¡La Tierra gira sobre su eje es correcto! Mientras la Tierra gira sobre su eje, diferentes partes miran hacia el Sol (día) mientras otras miran hacia afuera (noche). Esta rotación tarda 24 horas."
  },
  "Which of the following explains why we have seasons?": {
    questionES: "¿Cuál de los siguientes explica por qué tenemos estaciones?",
    explanationES: "¡La Tierra gira alrededor del Sol y la inclinación de su eje es correcto! La inclinación de 23.5 grados del eje de la Tierra hace que diferentes partes reciban cantidades variables de luz solar durante el año, creando las estaciones."
  },
  "The Equator is a line of:": {
    questionES: "El Ecuador es una línea de:",
    explanationES: "¡Latitud es correcto! El Ecuador es la línea principal de latitud a 0 grados. Divide la Tierra en Hemisferios Norte y Sur."
  },
  "Lines of longitude run:": {
    questionES: "Las líneas de longitud van:",
    explanationES: "¡Norte a Sur es correcto! Las líneas de longitud (meridianos) corren verticalmente del Polo Norte al Polo Sur."
  },
  "The Prime Meridian divides the Earth into:": {
    questionES: "El Meridiano de Greenwich divide la Tierra en:",
    explanationES: "¡Hemisferios Este y Oeste es correcto! El Meridiano de Greenwich (0 grados de longitud) divide la Tierra en Hemisferios Este y Oeste, al igual que el Ecuador la divide en Norte y Sur."
  },
  "What shape is the planet Earth?": {
    questionES: "¿Qué forma tiene el planeta Tierra?",
    explanationES: "¡Esfera es correcto! La Tierra tiene forma de esfera (una bola redonda tridimensional). No es una esfera perfecta porque está ligeramente aplanada en los polos."
  },
  "Which Hemisphere are both North America and South America found in?": {
    questionES: "¿En qué hemisferio se encuentran tanto América del Norte como América del Sur?",
    explanationES: "¡Hemisferio Oeste es correcto! Ambos continentes están ubicados en el Hemisferio Oeste, al oeste del Meridiano de Greenwich."
  },
  "Which Hemisphere are Asia, Australia, and most of Europe found in?": {
    questionES: "¿En qué hemisferio se encuentran Asia, Australia y la mayor parte de Europa?",
    explanationES: "¡Hemisferio Este es correcto! Asia, Australia y la mayor parte de Europa están ubicadas en el Hemisferio Este, al este del Meridiano de Greenwich."
  },
  "Which Hemisphere are both South America and Antarctica found in?": {
    questionES: "¿En qué hemisferio se encuentran tanto América del Sur como la Antártida?",
    explanationES: "¡Hemisferio Sur es correcto! Tanto América del Sur como la Antártida están principalmente ubicadas en el Hemisferio Sur, debajo del Ecuador."
  },
  "Weather describes:": {
    questionES: "El tiempo (weather) describe:",
    explanationES: "¡Las condiciones a corto plazo de la atmósfera es correcto! El tiempo es lo que está pasando ahora o en un período corto - como soleado, lluvioso o nevado hoy."
  },
  "Climate is:": {
    questionES: "El clima es:",
    explanationES: "¡El patrón usual del tiempo en un lugar durante muchos años es correcto! El clima es las condiciones meteorológicas promedio durante un período largo (más de 30 años), no solo un día."
  },
  "Which of the following can describe weather?": {
    questionES: "¿Cuál de los siguientes puede describir el tiempo (weather)?",
    explanationES: "¡Soleado y cálido hoy es correcto! Esto describe las condiciones actuales (tiempo). Las otras opciones describen patrones a largo plazo (clima)."
  },
  "Which inner planet is known as the Red Planet?": {
    questionES: "¿Qué planeta interior es conocido como el Planeta Rojo?",
    explanationES: "¡Marte es correcto! Marte es llamado el 'Planeta Rojo' debido al color rojizo de su superficie, causado por el óxido de hierro (óxido) en su suelo."
  },
  "Why Pluto is no longer considered a planet?": {
    questionES: "¿Por qué Plutón ya no se considera un planeta?",
    explanationES: "¡No limpia su órbita de otros objetos es correcto! Para ser un planeta, un objeto debe limpiar su trayectoria orbital. Plutón comparte su órbita con otros objetos en el Cinturón de Kuiper, por lo que se clasifica como 'planeta enano'."
  }
};

console.log('🔄 Updating science-quiz-data.json with translations and audio paths...\n');

const quizDataPath = path.join(__dirname, 'public', 'science-quiz-data.json');
const quizData = JSON.parse(fs.readFileSync(quizDataPath, 'utf8'));

let updatedCount = 0;

const updatedQuizData = quizData.map((item, index) => {
  if (item.type === 'reading') {
    return item; // Skip reading sections
  }

  const translation = translationsV1[item.question];

  if (translation) {
    updatedCount++;
    const questionSlug = item.question
      .toLowerCase()
      .replace(/<[^>]*>/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);

    return {
      ...item,
      questionES: translation.questionES,
      explanationES: translation.explanationES,
      audioQuestion: `audios/science-q${index + 1}-${questionSlug}.mp3`
    };
  }

  return item;
});

fs.writeFileSync(quizDataPath, JSON.stringify(updatedQuizData, null, 2));
console.log(`✅ Updated science-quiz-data.json: ${updatedCount} questions with translations`);

console.log('\n🎉 Done! Translations added successfully.');
