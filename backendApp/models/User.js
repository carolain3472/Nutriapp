const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  foto_perfil: {
    data: Buffer,
    contentType: String
  },
  nombre: { type: String, required: true },
  apellidos: { type: String, required: true },
  fecha_nacimiento: { type: Date },
  altura: { type: Number },
  peso: { type: Number }, // Representa el peso actual
  pesoInicial: { type: Number }, // Se establece una vez y no cambia
  genero: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  hasCompletedQuestionnaire: { type: Boolean, default: false },
  preferences: {
    objetivo: { type: String },
    requerimientosSalud: { type: String },
    peso: { type: String },
    estatura: { type: String },
    edad: { type: String },
    tipoDieta: { type: String },
    alergias: { type: String },
    intolerancias: { type: String },
    comidasPorDia: { type: String },
    grupoAlimentosPreferido: [{ type: String }],
    alimentosFavoritos: { type: String },
    platillosFavoritos: { type: String }
  },
  // Nuevos campos para el historial de datos del dashboard
  weightHistory: [{
    date: { type: Date, default: Date.now },
    weight: { type: Number, required: true }
  }],
  mealHistory: [{
    date: { type: Date, default: Date.now },
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    type: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true }
  }],
  caloriesBurnedHistory: [{
    date: { type: Date, default: Date.now },
    calories: { type: Number, required: true }
  }],
  activeHoursHistory: [{
    date: { type: Date, default: Date.now },
    hours: { type: Number, required: true }
  }],
  sleepHoursHistory: [{
    date: { type: Date, default: Date.now },
    hours: { type: Number, required: true }
  }]
});

// Getter para calcular la edad
userSchema.virtual('edad').get(function () {
  if (!this.fecha_nacimiento) return null;
  const hoy = new Date();
  let edad = hoy.getFullYear() - this.fecha_nacimiento.getFullYear();
  const m = hoy.getMonth() - this.fecha_nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < this.fecha_nacimiento.getDate())) {
    edad--;
  }
  return edad;
});

module.exports = mongoose.model('User', userSchema);
