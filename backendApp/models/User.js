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
  peso: { type: Number },
  genero: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true }
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
