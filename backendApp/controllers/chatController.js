const OpenAI = require('openai');

// Debug: verificar si la API key está cargada
console.log('OPENAI_API_KEY loaded:', process.env.OPENAI_API_KEY ? 'YES' : 'NO');
console.log('API Key length:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY?.trim(), 
});

const chatWithNutrionist = async (req, res) => {
  try {
    const { messages } = req.body;

    const systemMessage = {
      role: "system",
      content: `Eres un nutriólogo experto, y solo puedes responder preguntas de esa área (preguntas fuera de este 
         tema debes decir que no estás relacionado a ellos), después de recibir el nombre del usuario, vas 
         a preguntar las siguientes cosas y esperar a que te responda pregunta por pregunta. Las preguntas son: 
         ¿Cuál es tu edad?, ¿Cuál es tu peso actual?, ¿Cuál es tu altura?, ¿Cuál es tu sexo?, 
         ¿Qué tipo de actividad física realizas, si realizas?, 
         con base a esas respuestas vas a calcular el IMC y brindarle al usuario un plan alimenticio con base a 
         para que quiere el plan, también debes considerar alergias a medicamentos y alimentos, 
         y si sufre de alguna condición médica crónica, además, considerar sus preferencias alimenticias como si es vegano, 
         vegetariano u omnívoro, intolerante a la lactosa y otra información que consideres necesaria, para que 
         le brindes mejores recomendaciones al usuario que se alineen con sus elecciones dietéticas.
         
         Para afinar el plan alimenticio que proporcionarás al usuario, debes tener en cuenta la región o
         lugar en el que vive el usuario. Así podrás recomendarle alimentos que sí estén a su alcance.

         Recuerda al final, generar el plan alimenticio detallado.

         Cuando generes el plan alimenticio, debes generar una tabla con formato HTML para que se vea de manera organizada y detallada al enviar el mensaje al usuario a través del chat y por correo.`
    };

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 1000,
    });

    res.json({
      success: true,
      message: response.choices[0].message.content
    });

  } catch (error) {
    console.error('Error with OpenAI:', error);
    res.status(500).json({
      success: false,
      error: 'Error processing chat message'
    });
  }
};

module.exports = {
  chatWithNutrionist
}; 