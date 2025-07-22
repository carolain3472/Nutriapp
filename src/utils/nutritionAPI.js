// Funciones para obtener información nutricional de APIs gratuitas

// API gratuita de USDA FoodData Central
const USDA_API_KEY = 'DEMO_KEY'; // Puedes registrarte para una clave gratuita

export const searchFood = async (query) => {
  try {
    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&api_key=${USDA_API_KEY}`
    );
    const data = await response.json();
    return data.foods || [];
  } catch (error) {
    console.error('Error fetching food data:', error);
    return [];
  }
};

// API gratuita de Edamam (requiere registro gratuito)
const EDAMAM_APP_ID = 'your_app_id'; // Registrarse en edamam.com
const EDAMAM_APP_KEY = 'your_app_key';

export const searchRecipes = async (query) => {
  try {
    const response = await fetch(
      `https://api.edamam.com/search?q=${encodeURIComponent(query)}&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}&from=0&to=5`
    );
    const data = await response.json();
    return data.hits || [];
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
};

// Función para obtener información nutricional básica sin API
export const getNutritionFacts = (food) => {
  const nutritionDatabase = {
    'manzana': {
      calories: 52,
      protein: 0.3,
      carbs: 14,
      fat: 0.2
    },
    'pollo': {
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6
    }
  };

  return nutritionDatabase[food.toLowerCase()] || null;
}; 