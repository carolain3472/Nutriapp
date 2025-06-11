const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Nutriapp');
});

console.log("OPENAI_API_KEY cargada:", process.env.OPENAI_API_KEY ? "SI" : "NO");
console.log("Longitud de API Key:", process.env.OPENAI_API_KEY?.length || 0);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(5000, () => console.log('Servidor corriendo en puerto 5000'));
  })
  .catch(err => console.error(err));
