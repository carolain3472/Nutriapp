const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { register, login } = require('../controllers/authcontroller');
const multer = require('multer');

const User = require('../models/User');

// Configurar multer para almacenamiento en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ruta para registrar usuario
router.post('/register', upload.single('foto_perfil'), async (req, res) => {
  try {
    const { nombre, apellidos, fecha_nacimiento, altura, peso, genero, email, password } = req.body;

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = new User({
      nombre,
      apellidos,
      fecha_nacimiento: fecha_nacimiento ? new Date(fecha_nacimiento) : undefined,
      altura: altura ? Number(altura) : undefined,
      peso: peso ? Number(peso) : undefined,
      genero,
      email,
      password: hashedPassword,
      foto_perfil: req.file
        ? {
            data: req.file.buffer,
            contentType: req.file.mimetype
          }
        : undefined
    });

    await nuevoUsuario.save();
    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});


router.post('/login', login);

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
