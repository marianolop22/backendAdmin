var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();
var fs = require('fs');


var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// default options
app.use(fileUpload());


app.put('/:tipo/:id', (req, res) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'tipo no valido',
            errors: { message: 'tipos validas son otras ' + tiposValidos.join(',') }
        });
    }


    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'debe seleccionar imagen',
            errors: { message: 'no hay archivos para subir' }
        });
    }

    //obtenr nombe del archivo
    var archivo = req.files.imagenes;
    var nombreCortado = archivo.name.split('.');
    var extension = nombreCortado[nombreCortado.length - 1];

    //extensiones permitidas
    var extensionesValidas = ['png', 'gif', 'jpg', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'formato de archibvo no valido',
            errors: { message: 'extensiones validas son otras ' + extensionesValidas.join(',') }
        });
    }

    //nombre personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    //mover el archivo a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'error al mover el archiv' + err,
                errors: { message: 'error al mover el archivo' }
            });
        }


    });

    subirPorTipo(tipo, id, nombreArchivo, res)

    // res.status(200).json({
    //     message: 'todo ok',
    //     extension: extension
    // });
})


function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo == 'usuarios') {
        Usuario.findById(id, (err, usuario) => {

            var pathViejo = './uploads/usuarios/' + usuario.img;
            //si existe la imagen anterior, la borro
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            usuario.img = nombreArchivo;
            //usuario.password = ':)';
            usuario.save((err, usuarioActualizado) => {

                return res.status(200).json({
                    message: 'se actualizó el usuario',
                    usuario: usuarioActualizado
                });
            });
        });
    }

    if (tipo == 'medicos') {

        Medico.findById(id, (err, medico) => {

            var pathViejo = './uploads/medicos/' + medico.img;

            //si existe la imagen anterior, la borro
            if (medico.img && fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            medico.img = nombreArchivo;
            //medico.password = ':)';
            medico.save((err, medicoActualizado) => {

                return res.status(200).json({
                    message: 'se actualizó el usuario',
                    medico: medicoActualizado
                });
            });
        });


    }

    if (tipo == 'hospitales') {

        Hospital.findById(id, (err, hospital) => {

            var pathViejo = './uploads/hospitales/' + hospital.img;
            //si existe la imagen anterior, la borro
            if (hospital.img && fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            hospital.img = nombreArchivo;
            //hospital.password = ':)';
            hospital.save((err, hospitalActualizado) => {

                return res.status(200).json({
                    message: 'se actualizó el usuario',
                    hospital: hospitalActualizado
                });
            });
        });
    }
}


module.exports = app;