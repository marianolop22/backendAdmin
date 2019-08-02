var Medico = require('../models/medico');

function getMedicoList(req, res) {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(99)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error en la base de datos',
                    errors: err
                });
            }

            Medico.count({}, (err, conteo) => {
                return res.status(200).json({
                    ok: true,
                    medicos,
                    total: conteo
                });
            });

        });
}

function saveMedico(req, res) {

    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospital
    });


    medico.save((err, medico) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al crear medico',
                errors: err
            });
        }

        return res.status(201).json({
            ok: true,
            medico
        });
    });


}

function updateMedico(req, res) {

    var body = req.body
    var id = req.params.id;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al nbuscar medico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                message: 'el medico no existe',
                errors: { message: `no existe el medico con id ${id}` }
            });
        } else {

            medico.nombre = body.nombre;
            medico.usuario = req.usuario._id;
            medico.hospital = body.hospital;

            medico.save((err, medicoActualizado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Error al actualizar medico',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    medicoActualizado
                });
            });
        }
    });
}

function removeMedico(req, res) {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medico) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al actualizar medico',
                errors: err
            });
        }

        if (!medico) {


            return res.status(400).json({
                ok: true,
                mensaje: 'no existe el medico ',
                error: { message: 'el medico no se borró' }
            });

        }

        return res.status(200).json({
            ok: true,
            medico
        });
    });
}

function getMedico(req, res) {

    var id= req.params.id;

    Medico.findById(id)
        .populate('usuario', 'nombre email img')
//        .populate('hospital')
        .exec((err, medico) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error en la base de datos',
                    errors: err
                });
            }

            if ( !medico ) {
                return res.status(400).json({
                    ok: false,
                    message: 'No existe el medico',
                    errors: err
                });
            }

            return res.status(200).json({
                ok: true,
                medico
            });

        });
}





module.exports = {
    getMedico,
    getMedicoList,
    saveMedico,
    updateMedico,
    removeMedico
};