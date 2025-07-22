const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

exports.getRecipes = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const { search } = req.query; // search query from frontend

        let prompt = `Eres un chef y nutricionista experto. Genera 5 recetas.`;

        if (user.preferences) {
            const { objetivo, tipoDieta, alergias, intolerancias, alimentosFavoritos, platillosFavoritos, restriccionesReligiosas, detalleRestriccionReligiosa } = user.preferences;
            prompt += ` Basado en las siguientes preferencias del usuario:\n
            - Objetivo: ${objetivo || 'No especificado'}\n
            - Tipo de dieta: ${tipoDieta || 'No especificado'}\n
            - Alergias: ${alergias || 'Ninguna'}\n
            - Intolerancias: ${intolerancias || 'Ninguna'}\n
            - Alimentos que le gustan: ${alimentosFavoritos || 'No especificados'}\n
            - Platillos que le gustan: ${platillosFavoritos || 'No especificados'}\n
            - Restricciones religiosas: ${restriccionesReligiosas || 'Ninguna'}\n
            - Detalle de restricciones religiosas: ${detalleRestriccionReligiosa || 'Ninguno'}\n`;
        }

        if (search) {
            prompt += `\nEl usuario ha buscado: "${search}". Usa esto para filtrar las recetas.`;
        } else {
            prompt += `\nEl usuario no ha buscado nada en específico, genera una variedad de recetas saludables que se ajusten a las preferencias.`;
        }

        prompt += `\nDevuelve el resultado como un array JSON de objetos. Cada objeto debe tener los siguientes campos: "title" (string), "description" (string), "ingredients" (array de strings), "instructions" (array de strings), y "nutrition" (un objeto con "calories" (string), "protein" (string), "carbs" (string), "fats" (string)).\n
        Asegúrate de que el JSON sea válido y no incluyas saltos de línea ni caracteres de formato extraños dentro del JSON. No incluyas nada más en tu respuesta que no sea el array JSON. El JSON debe empezar con '[' y terminar con ']'.
        Aquí tienes un ejemplo de la estructura de un objeto de receta:
        {
          "title": "Ensalada de Quinoa",
          "description": "Una ensalada fresca y nutritiva, perfecta para un almuerzo ligero.",
          "ingredients": ["1 taza de quinoa cocida", "1 pepino, en cubos", "1 tomate, en cubos", "1/4 taza de cebolla roja, picada", "Jugo de 1 limón", "2 cdas de aceite de oliva", "Sal y pimienta al gusto"],
          "instructions": ["En un tazón grande, combina la quinoa, el pepino, el tomate y la cebolla roja.", "En un tazón pequeño, bate el jugo de limón, el aceite de oliva, la sal y la pimienta.", "Vierte el aderezo sobre la ensalada y mezcla bien.", "Sirve inmediatamente o refrigera para más tarde."],
          "nutrition": { "calories": "350 kcal", "protein": "12g", "carbs": "45g", "fats": "15g" }
        }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const recipes = JSON.parse(cleanedText);
            res.json(recipes);
        } catch (e) {
            console.error("Error al parsear JSON de la API de Gemini:", e);
            console.error("Respuesta recibida de Gemini:", cleanedText);
            res.status(500).json({ message: 'Error al generar recetas. La respuesta de la IA no era un JSON válido.' });
        }

    } catch (error) {
        console.error('Error al obtener recetas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}; 