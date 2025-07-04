// Sistema avanzado de lógica nutricional

export const analyzeUserMessage = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Detectar intención
  const intent = detectIntent(lowerMessage);
  
  // Extraer información relevante
  const entities = extractEntities(lowerMessage);
  
  return { intent, entities };
};

const detectIntent = (message) => {
  if (message.includes('perder peso') || message.includes('adelgazar')) {
    return 'weight_loss';
  }
  if (message.includes('ganar músculo') || message.includes('masa muscular')) {
    return 'muscle_gain';
  }
  if (message.includes('receta') || message.includes('cocinar')) {
    return 'recipe_request';
  }
  return 'general';
};

const extractEntities = (message) => {
  const foods = ['pollo', 'arroz', 'huevo', 'manzana', 'salmón'];
  const foundFoods = foods.filter(food => message.includes(food));
  
  return { foods: foundFoods };
};

export class NutritionAssistant {
  constructor() {
    this.userProfile = {
      age: null,
      weight: null,
      height: null,
      activityLevel: null,
      goals: [],
      restrictions: []
    };
    this.conversationContext = [];
  }

  // Analizar el mensaje del usuario
  analyzeMessage(message) {
    const analysis = {
      intent: this.detectIntent(message),
      entities: this.extractEntities(message),
      sentiment: this.analyzeSentiment(message),
      context: this.getContext()
    };
    return analysis;
  }

  // Generar respuesta personalizada
  generateResponse(analysis) {
    const { intent, entities } = analysis;

    switch (intent) {
      case 'weight_loss':
        return this.generateWeightLossAdvice(entities);
      case 'muscle_gain':
        return this.generateMuscleGainAdvice(entities);
      case 'recipe_request':
        return this.generateRecipeResponse(entities);
      case 'nutrition_info':
        return this.generateNutritionInfo(entities);
      default:
        return this.generateGeneralResponse();
    }
  }

  generateWeightLossAdvice(entities) {
    const baseAdvice = "Para perder peso de manera saludable:\n\n";
    const tips = [
      "🔸 Crea un déficit calórico moderado (300-500 kcal/día)",
      "🔸 Incluye proteína en cada comida",
      "🔸 Llena la mitad del plato con verduras",
      "🔸 Mantente hidratado (2-3L agua/día)",
      "🔸 Combina con ejercicio regular"
    ];

    if (entities.foods.length > 0) {
      tips.push(`\n🔸 Los alimentos que mencionaste (${entities.foods.join(', ')}) pueden ser parte de tu plan`);
    }

    return baseAdvice + tips.join('\n');
  }

  generateMuscleGainAdvice(entities) {
    const baseAdvice = "Para ganar masa muscular:\n\n";
    const tips = [
      "💪 Superávit calórico de 300-500 kcal/día",
      "💪 Proteína: 1.6-2.2g por kg de peso",
      "💪 Carbohidratos para energía de entrenamiento",
      "💪 Grasas saludables (20-35% de calorías totales)",
      "💪 Entrenamiento de fuerza consistente"
    ];

    return baseAdvice + tips.join('\n');
  }

  generateRecipeResponse(entities) {
    if (entities.foods.length > 0) {
      const food = entities.foods[0];
      return this.getRecipeForFood(food);
    }
    
    return "Te puedo sugerir recetas saludables. ¿Hay algún ingrediente específico que te gustaría usar?";
  }

  getRecipeForFood(food) {
    const recipes = {
      'pollo': "🍗 **Pollo al Limón y Hierbas**\n\nIngredientes:\n- 200g pechuga de pollo\n- Jugo de 1 limón\n- Romero y tomillo\n- Aceite de oliva\n\nMarinar 30 min y cocinar a la plancha.",
      'arroz': "🍚 **Arroz Integral con Vegetales**\n\nIngredientes:\n- 1 taza arroz integral\n- Brócoli, zanahoria, guisantes\n- Ajo y jengibre\n- Salsa de soja baja en sodio",
      'salmón': "🐟 **Salmón al Horno con Aspárragos**\n\nIngredientes:\n- 150g filete de salmón\n- Espárragos frescos\n- Aceite de oliva\n- Limón y eneldo"
    };

    return recipes[food] || `Me gustaría ayudarte con una receta de ${food}, pero necesito más detalles sobre cómo te gusta prepararlo.`;
  }

  // Simular análisis de sentimiento
  analyzeSentiment(message) {
    const positiveWords = ['bien', 'genial', 'perfecto', 'gracias'];
    const negativeWords = ['mal', 'difícil', 'problema', 'no puedo'];
    
    const lowerMessage = message.toLowerCase();
    
    if (positiveWords.some(word => lowerMessage.includes(word))) {
      return 'positive';
    } else if (negativeWords.some(word => lowerMessage.includes(word))) {
      return 'negative';
    }
    return 'neutral';
  }

  getContext() {
    return this.conversationContext.slice(-3); // Últimos 3 mensajes
  }

  generateGeneralResponse() {
    return "Como tu asistente nutricional, puedo ayudarte con planes de alimentación, recetas saludables, información nutricional y consejos personalizados. ¿Qué te gustaría saber?";
  }
}

// Instancia global del asistente
export const nutritionAssistant = new NutritionAssistant(); 