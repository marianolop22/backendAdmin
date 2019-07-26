var express = require('express');
var app = express();
var Usuario = require('../models/usuario');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

//Google
CLIENT_ID = require('../config/config').CLIENT_ID;
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuarios',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuario.password)) {

            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas - password',
                errors: err
            });

        }

        usuario.password = ":)";

        //crear token
        var token = jwt.sign({
                usuario
            }, SEED, { expiresIn: 14400 }) //4horas


        return res.status(200).json({
            ok: true,
            token,
            usuario,
            id: usuario._id
        });

    });
});

//Login de Google
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        imagen: payload.picture,
        google: true
    };
}





app.post ('/google', async (req, resp) =>{

    var token  = req.body.token;

    var googleUser = await verify ( token )
                            .catch ( e=> {
                                return res.status(403).json ( {
                                    ok: false,
                                    mensaje: 'token no valido'
                                });
                            })

    Usuario.findOne ( { email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuarios',
                errors: err
            });
        }


        if (usuarioDB) { //

            if ( usuarioDB.google === false ) {
                return res.status(400).json({
                    ok: false,
                    message: 'Debe usar su autenticacion normal'
                });
            } else {

                var token = jwt.sign({
                    usuarioDB
                }, SEED, { expiresIn: 14400 }) //4horas
    
    
                return res.status(200).json({
                    ok: true,
                    token,
                    usuario,
                    id: usuarioDB._id
                });
            }
        } else {
            //el usuario no existe, hay que crearlo
            var usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.imagen;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save ( (err, usuarioDB )=> {

                var token = jwt.sign({
                    usuarioDB
                }, SEED, { expiresIn: 14400 }) //4horas
    
                return res.status(200).json({
                    ok: true,
                    token,
                    usuario,
                    id: usuarioDB._id
                });
            });
        }
    });

    // res.status(200).json ({
    //     ok: true,
    //     mensaje: 'OK',
    //     googleUser: googleUser
    // })
});






module.exports = app;