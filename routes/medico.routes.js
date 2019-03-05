var express = require('express');
var app = express();
var mdAutenticacion = require('../middlewares/autenticacion');
var MedicoController = require('../controllers/medico.controller');


app.get('/', MedicoController.getMedico);
app.post('/', mdAutenticacion.verificaToken, MedicoController.saveMedico);
app.put('/:id', mdAutenticacion.verificaToken, MedicoController.updateMedico);
app.delete('/:id', mdAutenticacion.verificaToken, MedicoController.removeMedico);

module.exports = app;