const OpenAI = require('openai');
const User = require('../models/User'); // Importar el modelo de usuario

// Debug: verificar si la API key está cargada
console.log('OPENAI_API_KEY loaded:', process.env.OPENAI_API_KEY ? 'YES' : 'NO');
console.log('API Key length:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0);

// Solo instanciar OpenAI si hay API key
let openai = null;

if (process.env.OPENAI_API_KEY?.trim()) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY.trim(),
  });
} else {
  console.warn('⚠️ No se ha definido OPENAI_API_KEY. El chat con el nutricionista no funcionará.');
}

const chatWithNutrionist = async (req, res) => {
  try {
    const { messages } = req.body;
    const { userId } = req; // ID del usuario desde el middleware de autenticación

    // Buscar al usuario y sus preferencias
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }

    const { preferences } = user;
    
    // Contexto de sistema dinámico con las preferencias del usuario
    let context = `Eres un nutriólogo experto y solo puedes responder preguntas de esa área (si te preguntan otra cosa, amablemente di que no es tu especialidad). `;
    context += `Estás asesorando a ${user.nombre}. `;

    if (preferences) {
      context += `Aquí tienes el contexto sobre ${user.nombre}:
      - Objetivo: ${preferences.objetivo || 'No especificado'}.
      - Requerimientos de salud: ${preferences.requerimientosSalud || 'Ninguno'}.
      - Peso: ${preferences.peso || 'No especificado'} kg.
      - Estatura: ${preferences.estatura || 'No especificada'} cm.
      - Edad: ${preferences.edad || 'No especificada'} años.
      - Tipo de dieta: ${preferences.tipoDieta || 'No especificada'}.
      - Alergias: ${preferences.alergias || 'Ninguna'}.
      - Intolerancias: ${preferences.intolerancias || 'Ninguna'}.
      - Comidas por día: ${preferences.comidasPorDia || 'No especificado'}.
      - Grupos de alimentos preferidos: ${preferences.grupoAlimentosPreferido?.join(', ') || 'No especificados'}.
      - Alimentos favoritos: ${preferences.alimentosFavoritos || 'No especificados'}.
      - Platillos favoritos: ${preferences.platillosFavoritos || 'No especificados'}.
      
      Usa esta información para dar recomendaciones altamente personalizadas. No necesitas volver a preguntar estos datos. Sé proactivo y ofrece consejos basados en sus metas y restricciones. Por ejemplo, si quiere bajar de peso y es vegetariano, sugiérele recetas vegetarianas bajas en calorías. Si es alérgico a algo, NUNCA se lo recomiendes.`;
    } else {
      context += `El usuario aún no ha completado su perfil de preferencias. Anímale a que lo haga para poder darle un mejor servicio.`;
    }

    const systemMessage = {
      role: "system",
      content: context
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