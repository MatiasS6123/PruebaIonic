const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Agregada la importación de bcrypt

// Ruta para obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const { rut, nombre, apellido, edad,tipo_usuario, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash de la contraseña

    const user = new User({
        rut: rut,
        nombre: nombre,
        apellido: apellido,
        edad: edad,
        tipo_usuario:tipo_usuario,
        email: email,
        password: hashedPassword // Guardar la contraseña cifrada
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

function generateAuthToken(user) {
    return jwt.sign({ userId: user._id }, 'tu_clave_secreta'); // Definir tiempo de expiración del nuevo token (por ejemplo, 1 hora)
}

// Middleware para verificar el token de autenticación
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, 'tu_clave_secreta', (err, user) => {
        if (err) {
            // Verificar si el error es debido a que el token ha expirado
            if (err.name === 'TokenExpiredError') {
                // Generar un nuevo token con una nueva fecha de expiración
                const newToken = jwt.sign({ userId: user ? user._id : null }, 'tu_clave_secreta', { expiresIn: '1h' });
                
                // Enviar el nuevo token al cliente
                res.setHeader('Authorization', `Bearer ${newToken}`);
                // Continuar con la ejecución de la solicitud
                next();
            } else {
                return res.sendStatus(403); // Forbidden
            }
        } else {
            req.user = user;
            next();
        }
    });
}

// Ruta para el perfil del usuario
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        // Buscar al usuario por su ID almacenado en el token de autenticación
        const user = await User.findById(req.user.userId);
        // Devolver la información del usuario como respuesta
        res.json(user);
    } catch (err) {
        // Manejar cualquier error que ocurra durante la búsqueda del usuario
        console.error('Error al obtener el perfil del usuario:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
// Ruta para el login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Inicio de sesión solicitado para el usuario con correo electrónico:', email);

        // Buscar al usuario por su correo electrónico
        const user = await User.findOne({ email });

        // Verificar si el usuario existe
        if (!user) {
            console.log('Usuario no encontrado.');
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        console.log('Usuario encontrado:', user);

        // Verificar si la contraseña es válida utilizando bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log('Contraseña incorrecta.');
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        console.log('Contraseña válida.');

        // Generar un token de autenticación
        const token = generateAuthToken(user);
        console.log('Token de autenticación generado:', token);

        // Enviar el token como respuesta
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error al realizar el login:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});


// Ruta para actualizar un estudiante por su ID
router.put('/:rut', async (req, res) => {
    try {
        // Validar que la solicitud tenga datos para actualizar
        if (!req.body) {
            return res.status(400).json({ message: 'No se proporcionaron datos para actualizar' });
        }

        // Buscar el estudiante por su RUT
        const user = await User.findOne({ rut: req.params.rut });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        // Actualizar los datos del estudiante con los datos proporcionados en la solicitud
        Object.assign(user, req.body);
        console.log('usuario actualizado:', user); // Registrar el estudiante actualizado

        // Guardar el estudiante actualizado en la base de datos
        const userActualizado = await user.save();
        res.json(userActualizado);
    } catch (error) {
        console.error('Error al actualizar usuario:', error); // Registrar el error
        res.status(500).json({ message: 'Error interno del servidor al actualizar el usuario' });
    }
});

router.delete('/:rut', async (req, res) => {
    try {
        const result = await User.deleteOne({ rut: req.params.rut });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'usuario no encontrado' });
        }
        
        console.log('usuario eliminado correctamente');
        res.json({ message: 'usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ message: error.message });
    }
});


router.get('/profesores', async (req, res) => {
    try {
      // Registra un log de inicio de la consulta
      console.log('Consultando profesores...');
      
      const profesores = await User.find({ tipo_usuario: 'profesor' });
  
      // Registra un log si se encontraron profesores
      console.log('Profesores encontrados:', profesores);
      
      res.json(profesores);
    } catch (err) {
      // Registra un log si ocurre un error durante la consulta
      console.error('Error al obtener los profesores:', err);
      
      res.status(500).json({ message: 'Error al obtener los profesores' });
    }
  });

module.exports = router;

