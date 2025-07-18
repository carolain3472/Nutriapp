const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const {
    nombre,
    apellidos,
    fecha_nacimiento,
    altura,
    peso,
    genero,
    email,
    password
  } = req.body;

  try {
    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email ya registrado' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
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
    res.status(201).json({ message: 'Usuario creado' });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // Enviar todos los campos del usuario (menos la imagen y contraseña)
    res.json({
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        fecha_nacimiento: user.fecha_nacimiento,
        edad: user.edad,
        altura: user.altura,
        peso: user.peso,
        genero: user.genero,
        fotoUrl: `/api/auth/usuario/${user._id}/foto`,
      },
    });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
