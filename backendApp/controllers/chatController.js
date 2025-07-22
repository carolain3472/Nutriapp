const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

const buildSystemPrompt = (user) => {
    let prompt = `Eres un asistente de nutrición amigable y experto llamado NutriChat. Tu objetivo es ayudar a los usuarios a alcanzar sus metas de salud.`;

    if (user && user.preferences) {
        const { objetivo, tipoDieta, alergias, intolerancias, alimentosFavoritos, peso, estatura } = user.preferences;
        prompt += `\nAquí tienes información sobre el usuario actual para personalizar tus respuestas:\n`;
        if (objetivo) prompt += `- Objetivo principal: ${objetivo}.\n`;
        if (tipoDieta) prompt += `- Tipo de dieta: ${tipoDieta}.\n`;
        if (alergias) prompt += `- Alergias: ${alergias}.\n`;
        if (intolerancias) prompt += `- Intolerancias: ${intolerancias}.\n`;
        if (alimentosFavoritos) prompt += `- Alimentos favoritos: ${alimentosFavoritos}.\n`;
        if (peso && estatura) {
             const heightInMeters = parseFloat(estatura) / 100;
             const bmi = (parseFloat(peso) / (heightInMeters * heightInMeters)).toFixed(2);
             prompt += `- Peso: ${peso}kg, Estatura: ${estatura}cm, lo que da un IMC de ${bmi}.\n`;
        }
    }
    prompt += `\nSé conciso, amigable y proporciona información precisa y útil.`;
    return prompt;
}

const chatWithNutrionist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('preferences');
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const { history, message } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'El mensaje no puede estar vacío.' });
        }

        const systemInstruction = buildSystemPrompt(user);
        
        const geminiHistory = (history || []).map(h => ({
            role: h.role,
            parts: [{ text: h.parts }]
        }));

        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: systemInstruction }] },
                { role: "model", parts: [{ text: "¡Hola! Soy NutriChat. ¿En qué puedo ayudarte hoy?" }] },
                ...geminiHistory
            ],
            generationConfig: {
              maxOutputTokens: 800,
              temperature: 0.7,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error('Error in chatWithNutrionist:', error);
        if (error.message && error.message.includes('API key')) {
             return res.status(500).json({ message: 'Error de configuración: La clave de API de Gemini no es válida o no se ha proporcionado.' });
        }
        res.status(500).json({ message: 'Error interno del servidor en el chat' });
    }
};

module.exports = {
    chatWithNutrionist,
}; 