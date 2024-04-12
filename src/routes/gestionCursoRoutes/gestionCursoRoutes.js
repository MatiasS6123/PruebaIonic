const express = require('express');
const router = express.Router();
const GestionCurso= require('../../models/gestionCModels')

router.post('/', async (req, res) => {
    const { nombreCurso, cantidadAlumno, nombreProfesor, dias,alumno } = req.body;

    const nuevagestionCurso = new GestionCurso({
        nombreCurso: nombreCurso,
        cantidadAlumno: cantidadAlumno,
        nombreProfesor: nombreProfesor,
        dias: dias,
        alumno:alumno
    });

    console.log('Clase a guardar :', nuevagestionCurso); // Agregar log

    try {
        const asignacionGuardada = await nuevagestionCurso.save();
        console.log('gestion guardada:', asignacionGuardada); // Agregar log
        res.status(201).json(asignacionGuardada);
    } catch (error) {
        console.error('error al guardar la asignacion del curso', error); // Agregar log
        res.status(400).json({ message: error.message });
    }
});
// Ruta para actualizar un estudiante por su ID
router.put('/:nombreCurso', async (req, res) => {
    try {
        // Validar que la solicitud tenga datos para actualizar
        if (!req.body) {
            return res.status(400).json({ message: 'No se proporcionaron datos para actualizar' });
        }

        // Buscar el estudiante por su RUT
        const curso = await GestionCurso.findOne({ nombreCurso: req.params.nombreCurso });
        if (!curso) {
            return res.status(404).json({ message: 'curso no encontrado' });
        }
        
        // Actualizar los datos del estudiante con los datos proporcionados en la solicitud
        Object.assign(curso, req.body);
        console.log('Estudiante actualizado:', curso); // Registrar el estudiante actualizado

        // Guardar el estudiante actualizado en la base de datos
        const cursoActualizado = await curso.save();
        res.json(cursoActualizado);
    } catch (error) {
        console.error('Error al actualizar curo:', error); // Registrar el error
        res.status(500).json({ message: 'Error interno del servidor al actualizar el estudiante' });
    }
});



// Ruta para eliminar un estudiante por su ID
router.delete('/:nombreCurso', async (req, res) => {
    try {
        const result = await GestionCurso.deleteOne({ nombreCurso: req.params.nombreCurso });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }
        
        console.log('curso eliminado correctamente');
        res.json({ message: 'curso eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar curso:', error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/:nombreCurso', async (req, res) => {
    try {
        const curso = await GestionCurso.findOne({ nombreCurso: req.params.nombreCurso }).lean(false);
        if (!curso) {
            return res.status(404).json({ message: 'curso no encontrado' });
        }
        console.log('curso encontrado:', curso); // Agregar log
        res.json(curso);
    } catch (error) {
        console.error('Error al obtener curso por nombre:', error); // Agregar log
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;