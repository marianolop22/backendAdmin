var SEED = require('../config/config').SEED;
var jwt = require('jsonwebtoken');

exports.verificaToken = function(req, res, next) {

    var token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'Token no valido',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        console.log('usuario decodificado', decoded);

        next();

        // return res.status(200).json({
        //     ok: true,
        //     decoded
        // });


    });
}

exports.verificaADM = function(req, res, next) {

    var usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            message: 'Token no valido - no es admin',
            errors: { message: 'no eres administrador' }
        });
    }
}

exports.verificaADMUSER = function(req, res, next) {

    var usuario = req.usuario;
    var id = req.params.id;

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            message: 'Token no valido - no es admin ni el mismo user',
            errors: { message: 'no eres administrador' }
        });
    }
}