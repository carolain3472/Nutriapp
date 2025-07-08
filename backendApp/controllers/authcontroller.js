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
        hasCompletedQuestionnaire: user.hasCompletedQuestionnaire,
        preferences: user.preferences
      },
    });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.updatePreferences = async (req, res) => {
  const { userId } = req;
  const { peso, ...otherPreferences } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Manejar la actualización del peso de forma centralizada
    if (peso !== undefined && peso !== null && !isNaN(parseFloat(peso))) {
      const newWeight = parseFloat(peso);

      // Si no hay peso inicial, establecerlo con el primer peso válido que se ingrese.
      // La comprobación se hace más estricta para no sobreescribir si es 0.
      if (user.pesoInicial === null || user.pesoInicial === undefined) {
        user.pesoInicial = newWeight;
      }
      
      // Actualizar el peso actual del usuario
      user.peso = newWeight;

      // Añadir al historial de peso
      user.weightHistory.push({ weight: newWeight });

      // Mantener la consistencia en el objeto de preferencias también
      user.preferences.peso = newWeight.toString();
    }
    
    // Actualizar el resto de las preferencias
    // Usamos un bucle para evitar sobreescribir el objeto `preferences` completo
    // y mantener el valor de `peso` que acabamos de establecer.
    Object.keys(otherPreferences).forEach(key => {
        user.preferences[key] = otherPreferences[key];
    });

    user.hasCompletedQuestionnaire = true;
    
    await user.save();

    // Devolver el objeto de usuario completo y actualizado
    const userResponse = user.toObject();
    delete userResponse.password; // No enviar el hash de la contraseña

    res.json({ message: 'Preferencias actualizadas correctamente', user: userResponse });
  } catch (error) {
    console.error('Error al actualizar las preferencias:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
