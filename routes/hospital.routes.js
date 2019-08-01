var express = require('express');
var app = express();
var mdAutenticacion = require('../middlewares/autenticacion');
var HospitalController = require('../controllers/hospital.controller');


app.get('/', HospitalController.getHospitalList);
app.get('/byid', HospitalController.getHospital);
app.post('/', mdAutenticacion.verificaToken, HospitalController.saveHospital);
app.put('/:id', mdAutenticacion.verificaToken, HospitalController.updateHospital);
app.delete('/:id', mdAutenticacion.verificaToken, HospitalController.removeHospital);

module.exports = app;