// estudiante.model.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gestionCSchema = new Schema({
  nombreCurso: { type: String,required: true},
  cantidadAlumno: {type: Number, required:true},
  nombreProfesor:{type: String, required:true},
  rutProfesor: { type: String, required: true }, 
  dias:{type:[String], required:true},
  alumno:{type:[String], required:true}
  
});

module.exports = mongoose.model('Gestion-Curso', gestionCSchema);

