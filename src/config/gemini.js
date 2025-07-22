import { GoogleGenerativeAI } from '@google/generative-ai';

// Tu API Key de Gemini
const API_KEY = 'AIzaSyCfY7YTSZRJmLdu5bmonFR1Dnlj3aZGHV4';

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Función para generar respuesta con Gemini
export const generateGeminiResponse = async (userMessage, conversationHistory = []) => {
  try {
    // Crear un prompt especializado en nutrición
    const nutritionPrompt = `
Eres NutriChat, un asistente nutricional experto y amigable. 

INSTRUCCIONES IMPORTANTES:
- Responde SIEMPRE en español
- Sé amigable, profesional y empático
- Incluye emojis relevantes para hacer las respuestas más atractivas
- Mantén las respuestas concisas pero informativas (máximo 250 palabras)
- Enfócate SOLO en nutrición, alimentación saludable, recetas y bienestar
- Si no estás seguro, recomienda consultar con un profesional

CONTEXTO: El usuario te está consultando sobre nutrición.

Usuario pregunta: ${userMessage}

Responde como NutriChat:`;

    const result = await model.generateContent(nutritionPrompt);
    const response = await result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error('Error con Gemini AI:', error);
    
    // Respuesta de fallback si falla Gemini
    return 'Lo siento, tengo problemas técnicos temporales. ¿Podrías intentar de nuevo en un momento? 😅\n\nMientras tanto, recuerda que puedo ayudarte con:\n🥗 Planes de alimentación\n🍽️ Recetas saludables\n💪 Consejos nutricionales\n💧 Hidratación';
  }
};

// Función para probar la conexión
export const testGeminiConnection = async () => {
  try {
    const result = await model.generateContent('Hola, responde brevemente que eres NutriChat');
    const response = await result.response;
    return { success: true, message: response.text() };
  } catch (error) {
    return { success: false, error: error.message };
  }
}; 