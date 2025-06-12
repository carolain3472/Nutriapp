import { GoogleGenerativeAI } from '@google/generative-ai';

// Configuración de Gemini AI
const API_KEY = 'AIzaSyCfY7YTSZRJmLdu5bmonFR1Dnlj3aZGHV4';

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(API_KEY);

// Configurar el modelo
const model = genAI.getGenerativeModel({ 
  model: "gemini-pro"
});

// Prompt del sistema para nutrición
const NUTRITION_SYSTEM_PROMPT = `
Eres un asistente nutricional experto llamado NutriChat. 

INSTRUCCIONES:
- Responde SIEMPRE en español
- Sé amigable y profesional
- Incluye emojis relevantes
- Mantén respuestas concisas (máximo 200 palabras)
- Enfócate solo en nutrición y alimentación

Responde de manera conversacional.
`;

// Función para generar respuesta con Gemini
export const generateGeminiResponse = async (userMessage) => {
  const prompt = `Eres NutriChat, un asistente nutricional. Responde en español: ${userMessage}`;
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

// Función de respaldo si falla Gemini
const getFallbackResponse = (userMessage) => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('hola') || lowerMessage.includes('buenos días')) {
    return '¡Hola! Soy NutriChat, tu asistente nutricional. ¿En qué puedo ayudarte hoy? 😊';
  } else if (lowerMessage.includes('perder peso')) {
    return 'Para perder peso de manera saludable, te recomiendo crear un déficit calórico moderado, incluir proteínas en cada comida y mantenerte hidratado. ¿Te gustaría un plan más específico? 💪';
  } else if (lowerMessage.includes('receta')) {
    return 'Me encanta ayudar con recetas saludables. ¿Hay algún ingrediente específico que te gustaría usar o algún tipo de comida que prefieras? 🍽️';
  } else {
    return 'Como tu asistente nutricional, puedo ayudarte con planes de alimentación, recetas saludables, información nutricional y consejos de bienestar. ¿Qué te gustaría saber? 🥗';
  }
};

// Función para verificar si la API está funcionando
export const testGeminiConnection = async () => {
  try {
    const result = await model.generateContent('Hola, ¿puedes responder brevemente que eres un asistente nutricional?');
    const response = await result.response;
    return { success: true, message: response.text() };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const test = 'test'; 