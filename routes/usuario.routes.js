var express = require('express');
var app = express();
var Usuario = require('../models/usuario');
var bcrypt = require('bcryptjs');
var mdAutenticacion = require('../middlewares/autenticacion');

//lista de usuarios
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role google')
        .skip(desde)
        .limit(5)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error en la base de datos',
                    errors: err
                });
            }

            Usuario.count({}, (err, conteo) => {
                return res.status(200).json({
                    ok: true,
                    usuarios,
                    total: conteo
                });
            });
        });
})

//crear un nuevo usuario
app.post('/', (req, res) => {

    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuario) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al crear usuario',
                errors: err
            });
        }

        return res.status(201).json({
            ok: true,
            usuario,
            usuarioToken: req.usuario
        });
    });
});

//Actualizar usuario
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body
    var id = req.params.id;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al nbuscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                message: 'el usuario no existe',
                errors: { message: `no existe el usuario con id ${id}` }
            });
        } else {

            usuario.nombre = body.nombre;
            usuario.email = body.email;
            usuario.role = body.role;

            usuario.save((err, user) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Error al actualizar usuario',
                        errors: err
                    });
                }

                user.password = ':)';
                return res.status(200).json({
                    ok: true,
                    usuario: user
                });
            });
        }
    });
});


//borrar usuario por id
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuario) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al actualizar usuario',
                errors: err
            });
        }

        if (!usuario) {


            return res.status(400).json({
                ok: true,
                mensaje: 'no existe el usuario ',
                error: { message: 'el usuario no se borró' }
            });

        }

        return res.status(200).json({
            ok: true,
            usuario
        });
    });
});




module.exports = app;