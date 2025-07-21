const express = require('express');
const router = express.Router();
const { register, login, updatePreferences } = require('../controllers/authcontroller');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');

const User = require('../models/User');

// Configurar multer para almacenamiento en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ruta para registrar usuario
router.post('/register', upload.single('foto_perfil'), register);


router.post('/login', login);

// Ruta para actualizar las preferencias del usuario
router.put('/preferences', authMiddleware, updatePreferences);

// Ruta para actualizar el perfil del usuario (peso y/o foto)
router.post('/update-profile', upload.single('photo'), async (req, res) => {
  try {
    const { userId, weight } = req.body;

    const usuario = await User.findById(userId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Actualizar peso si se envió
    if (weight) {
      usuario.peso = Number(weight);
    }

    // Actualizar foto si se envió
    if (req.file) {
      usuario.foto_perfil = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    await usuario.save();

    // Devolver datos actualizados
    res.json({
      message: 'Perfil actualizado',
      weight: usuario.peso,
      photoUrl: `/api/auth/usuario/${usuario._id}/foto`, // Esta URL ya existe
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
});


router.get('/usuario/:id/foto', async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id);
    if (!usuario || !usuario.foto_perfil || !usuario.foto_perfil.data) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    // Establecer el Content-Type correcto
    res.setHeader('Content-Type', usuario.foto_perfil.contentType);

    // Devolver la imagen como respuesta binaria sin forzar descarga
    res.contentType(usuario.foto_perfil.contentType).end(usuario.foto_perfil.data);


  } catch (error) {
    console.error('Error al obtener la imagen:', error);
    res.status(500).json({ error: 'Error al obtener la imagen' });
  }
});


module.exports = router;
