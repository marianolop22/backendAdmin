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

        next();

        // return res.status(200).json({
        //     ok: true,
        //     decoded
        // });


    });
}