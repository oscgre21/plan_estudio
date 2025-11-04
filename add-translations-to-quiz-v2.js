const fs = require('fs');
const path = require('path');

// Traducciones para science-quiz-data_V2.json
const translationsV2 = {
  // Exam 1: The Reproductive System
  "The female reproductive system has both internal and external organs.": {
    questionES: "El sistema reproductivo femenino tiene órganos internos y externos.",
    explanationES: "Esto es VERDADERO. El sistema reproductivo femenino tiene órganos internos como los ovarios, el útero y las trompas de Falopio, y órganos externos como la vulva y la vagina."
  },
  "The ovaries are where eggs are formed and matured.": {
    questionES: "Los ovarios son donde se forman y maduran los óvulos.",
    explanationES: "Esto es VERDADERO. Los ovarios son dos órganos del tamaño de una almendra donde se forman y maduran los óvulos, que son las células reproductivas femeninas."
  },
  "The uterus is where the future baby develops.": {
    questionES: "El útero es donde se desarrolla el futuro bebé.",
    explanationES: "Esto es VERDADERO. El útero es una cavidad con paredes musculares gruesas donde se desarrolla el futuro bebé durante el embarazo."
  },
  "The male reproductive system has only internal organs.": {
    questionES: "El sistema reproductivo masculino solo tiene órganos internos.",
    explanationES: "Esto es FALSO. El sistema reproductivo masculino está formado solo por órganos externos, no internos."
  },
  "Fallopian tubes communicate the ovaries with the uterus.": {
    questionES: "Las trompas de Falopio comunican los ovarios con el útero.",
    explanationES: "Esto es VERDADERO. Las trompas de Falopio son dos conductos que comunican los ovarios con el útero, permitiendo que los óvulos viajen."
  },
  "The vagina is an internal reproductive organ.": {
    questionES: "La vagina es un órgano reproductivo interno.",
    explanationES: "Esto es VERDADERO. La vagina es un órgano interno que comunica el útero con el exterior."
  },
  "The vulva is formed by a set of folds that protect the entrance to the vagina.": {
    questionES: "La vulva está formada por un conjunto de pliegues que protegen la entrada de la vagina.",
    explanationES: "Esto es VERDADERO. La vulva es la parte externa del sistema reproductivo formada por un conjunto de pliegues que protegen la entrada de la vagina."
  },
  "Choose: Which of the following is NOT part of the female reproductive system?": {
    questionES: "Elige: ¿Cuál de los siguientes NO es parte del sistema reproductivo femenino?",
    explanationES: "¡Corazón es correcto! El corazón es parte del sistema circulatorio, no del sistema reproductivo. Los ovarios, el útero y la vagina son todos partes del sistema reproductivo femenino."
  },
  "Choose: What are the two main functions of the female reproductive system?": {
    questionES: "Elige: ¿Cuáles son las dos funciones principales del sistema reproductivo femenino?",
    explanationES: "¡Interna y Externa es correcto! El sistema reproductivo femenino tiene dos funciones principales: órganos internos (como ovarios y útero) y órganos externos (como la vulva)."
  },

  // Exam 2: Sexual Characteristics
  "Sexual characteristics can be primary or secondary.": {
    questionES: "Las características sexuales pueden ser primarias o secundarias.",
    explanationES: "Esto es VERDADERO. Hay dos tipos de características sexuales: primarias (órganos reproductivos presentes al nacer) y secundarias (cambios físicos durante la pubertad)."
  },
  "Primary sexual characteristics appear during puberty.": {
    questionES: "Las características sexuales primarias aparecen durante la pubertad.",
    explanationES: "Esto es FALSO. Las características sexuales primarias son los órganos reproductivos que ya están formados al nacer, no durante la pubertad."
  },
  "Secondary sexual characteristics are accentuated during adolescence.": {
    questionES: "Las características sexuales secundarias se acentúan durante la adolescencia.",
    explanationES: "Esto es VERDADERO. Las características sexuales secundarias son las diferencias físicas que se acentúan en la adolescencia, como el vello corporal, los cambios de voz y el desarrollo físico."
  },
  "Puberty happens between 12 to 16 years old.": {
    questionES: "La pubertad ocurre entre los 12 y 16 años.",
    explanationES: "Esto es VERDADERO. Durante la adolescencia temprana (de 12 a 16 años), el cuerpo comienza a cambiar. Este período se llama pubertad."
  },
  "Hair growth is a primary sexual characteristic.": {
    questionES: "El crecimiento del vello es una característica sexual primaria.",
    explanationES: "Esto es FALSO. El crecimiento del vello es una característica sexual secundaria que aparece durante la pubertad, no una primaria."
  },
  "Choose: Which is an example of a secondary sexual characteristic?": {
    questionES: "Elige: ¿Cuál es un ejemplo de una característica sexual secundaria?",
    explanationES: "¡Cambios de voz es correcto! Los cambios de voz son una característica sexual secundaria que aparece durante la pubertad. Los ovarios, el útero y la vagina son características sexuales primarias (órganos reproductivos)."
  },
  "Choose: Primary sexual characteristics are:": {
    questionES: "Elige: Las características sexuales primarias son:",
    explanationES: "¡Órganos reproductivos es correcto! Las características sexuales primarias son los órganos reproductivos que ya están formados al nacer."
  },

  // Exam 3: Life Stages
  "Infancy is the stage from 0 to 5 years.": {
    questionES: "La infancia es la etapa de 0 a 5 años.",
    explanationES: "Esto es VERDADERO. La infancia es la primera etapa de la vida de 0 a 5 años cuando los bebés dependen completamente de sus padres."
  },
  "During childhood, children are completely dependent on their parents.": {
    questionES: "Durante la niñez, los niños dependen completamente de sus padres.",
    explanationES: "Esto es FALSO. Durante la niñez (6-11 años), los niños tienen algo de independencia y pueden hacer cosas como ponerse la ropa. La dependencia completa es durante la infancia."
  },
  "Adolescence is from 12 to 18 years.": {
    questionES: "La adolescencia es de 12 a 18 años.",
    explanationES: "Esto es VERDADERO. La adolescencia es la etapa de 12 a 18 años cuando los adolescentes son muy independientes pero aún necesitan a sus padres."
  },
  "In old age, the reproductive system stops working.": {
    questionES: "En la vejez, el sistema reproductivo deja de funcionar.",
    explanationES: "Esto es VERDADERO. En la vejez (a partir de los 70 años), el sistema reproductivo deja de funcionar."
  },
  "Youth is the stage from 26 to 70 years.": {
    questionES: "La juventud es la etapa de 26 a 70 años.",
    explanationES: "Esto es FALSO. La juventud es de 19 a 25 años. La etapa de 26 a 70 años se llama madurez o adultez."
  },
  "Adults are fully developed mentally, physically and emotionally.": {
    questionES: "Los adultos están completamente desarrollados mental, física y emocionalmente.",
    explanationES: "Esto es VERDADERO. Durante la madurez/adultez, las personas están completamente desarrolladas mental, física y emocionalmente, lo que les permite volverse independientes."
  },
  "Choose: What stage comes after childhood?": {
    questionES: "Elige: ¿Qué etapa viene después de la niñez?",
    explanationES: "¡Adolescencia es correcto! Después de la niñez (6-11 años) viene la adolescencia (12-18 años)."
  },
  "Choose: In which stage are people completely dependent on their parents?": {
    questionES: "Elige: ¿En qué etapa las personas dependen completamente de sus padres?",
    explanationES: "¡Infancia es correcto! Durante la infancia (0-5 años), los bebés dependen completamente de sus padres. En etapas posteriores, las personas ganan más independencia."
  },
  "Choose: The longest stage of life is:": {
    questionES: "Elige: La etapa más larga de la vida es:",
    explanationES: "¡Madurez es correcto! La madurez/adultez es la etapa más larga de 26 a 70 años (44 años en total)."
  },
  "Choose: During which stage do the most physical changes occur?": {
    questionES: "Elige: ¿Durante qué etapa ocurren más cambios físicos?",
    explanationES: "¡Adolescencia es correcto! Durante la adolescencia (12-18 años), ocurren muchos cambios físicos y emocionales debido a la pubertad."
  },
  "Choose: What happens to the reproductive system in old age?": {
    questionES: "Elige: ¿Qué le sucede al sistema reproductivo en la vejez?",
    explanationES: "¡Deja de funcionar es correcto! En la vejez (a partir de los 70 años), el sistema reproductivo deja de funcionar."
  },

  // Exam 4: Reproduction Function
  "Reproduction is the function that allows humans to have children.": {
    questionES: "La reproducción es la función que permite a los humanos tener hijos.",
    explanationES: "Esto es VERDADERO. La reproducción es la función biológica que permite a los humanos tener hijos y continuar la especie."
  },
  "All stages of life are related to reproduction.": {
    questionES: "Todas las etapas de la vida están relacionadas con la reproducción.",
    explanationES: "Esto es FALSO. No todas las etapas están relacionadas con la reproducción. Por ejemplo, la infancia y la vejez no son etapas reproductivas."
  },
  "Humans go through different stages of growth and development.": {
    questionES: "Los humanos pasan por diferentes etapas de crecimiento y desarrollo.",
    explanationES: "Esto es VERDADERO. Los humanos tienen diferentes etapas de crecimiento y desarrollo: infancia, niñez, adolescencia, juventud, madurez/adultez y vejez."
  },
  "Choose: When can humans have children?": {
    questionES: "Elige: ¿Cuándo pueden los humanos tener hijos?",
    explanationES: "¡Adolescencia y adultez es correcto! Los humanos pueden tener hijos durante la adolescencia (después de la pubertad) y durante toda la adultez, pero no durante la infancia, la niñez o la vejez."
  }
};

console.log('🔄 Updating science-quiz-data_V2.json with Spanish translations...\n');

const quizDataPath = path.join(__dirname, 'public', 'science-quiz-data_V2.json');
const quizData = JSON.parse(fs.readFileSync(quizDataPath, 'utf8'));

let updatedCount = 0;

const updatedQuizData = quizData.map((item) => {
  if (item.type === 'reading') {
    return item; // Skip reading sections
  }

  const translation = translationsV2[item.question];

  if (translation) {
    updatedCount++;
    return {
      ...item,
      questionES: translation.questionES,
      explanationES: translation.explanationES
    };
  }

  return item;
});

fs.writeFileSync(quizDataPath, JSON.stringify(updatedQuizData, null, 2));
console.log(`✅ Updated science-quiz-data_V2.json: ${updatedCount} questions with translations`);

console.log('\n🎉 Done! Translations added successfully.');
