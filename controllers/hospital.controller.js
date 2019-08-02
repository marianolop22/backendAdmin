var Hospital = require('../models/hospital');

function getHospitalList(req, res) {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        //.skip(desde)
        //.limit(5)
        .populate('usuario', 'nombre img email')
        .exec((err, hospitales) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error en la base de datos',
                    errors: err
                });
            }

            Hospital.countDocuments({}, (err, conteo) => {
                return res.status(200).json({
                    ok: true,
                    hospitales,
                    total: conteo
                });
            });
        });
}

function saveHospital(req, res) {

    var body = req.body;
    console.log ( 'body',body.img);


    if ( !body.img ) {
        body.img = "";
    }

    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id
    });

    hospital.save((err, hospital) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al crear hospital',
                errors: err
            });
        }

        return res.status(201).json({
            ok: true,
            hospital
        });
    });


}

function updateHospital(req, res) {

    var body = req.body
    var id = req.params.id;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al nbuscar hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                message: 'el hospital no existe',
                errors: { message: `no existe el hospital con id ${id}` }
            });
        } else {

            hospital.nombre = body.nombre;
            hospital.usuario = req.usuario._id;

            hospital.save((err, hospitalActualizado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Error al actualizar hospital',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    hospitalActualizado
                });
            });
        }
    });
}

function removeHospital(req, res) {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospital) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al actualizar hospital',
                errors: err
            });
        }

        if (!hospital) {


            return res.status(400).json({
                ok: true,
                mensaje: 'no existe el hospital ',
                error: { message: 'el hospital no se borró' }
            });

        }

        return res.status(200).json({
            ok: true,
            hospital
        });
    });
}

function getHospital(req, res) {

    var id = req.query.id;

    Hospital.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, hospital) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error en la base de datos',
                    errors: err
                });
            }

            return res.status(200).json({
                ok: true,
                hospital
            });
        });
}





module.exports = {
    getHospital,
    getHospitalList,
    saveHospital,
    updateHospital,
    removeHospital
};