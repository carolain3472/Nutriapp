const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const recipeRoutes = require('./routes/recipeRoutes');


const app = express();

const allowedOrigins = [
  'https://nutriapp-alpha-sage.vercel.app',
  'http://localhost:3000'
];


app.use(cors({
  origin: function(origin, callback) {
    // Permitir requests sin origin (como Postman) o si está en la lista
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true // Si usas cookies, si no puedes quitarlo
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/recipes', recipeRoutes);

app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Nutriapp');
});

console.log("OPENAI_API_KEY cargada:", process.env.OPENAI_API_KEY ? "SI" : "NO");
console.log("REACT_APP_GEMINI_API_KEY cargada:", process.env.REACT_APP_GEMINI_API_KEY ? "SI" : "NO");
console.log("Longitud de API Key (OpenAI):", process.env.OPENAI_API_KEY?.length || 0);
console.log("Longitud de API Key (Gemini):", process.env.REACT_APP_GEMINI_API_KEY?.length || 0);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(5000, () => console.log('Servidor corriendo en puerto 5000'));
  })
  .catch(err => console.error(err));
