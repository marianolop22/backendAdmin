//punto de entrada a la aplicacion
//requires
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//inicializar variables
var app = express();

//importar rutas
var appRoutes = require('./routes/app.routes');
var usuarioRoutes = require('./routes/usuario.routes');
var loginRoutes = require('./routes/login.routes');
var hospitalRoutes = require('./routes/hospital.routes');
var medicoRoutes = require('./routes/medico.routes');
var busquedaRoutes = require('./routes/busqueda.routes');
var uploadRoutes = require('./routes/upload.routes');
var imagenesRoutes = require('./routes/imagenes.routes');

//conecxion a la base
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true }, (err, res) => {

    if (err) {
        throw err;
    }

    console.log('Base de datos \x1b[32m%s\x1b[0m ', 'online');
})

//server index config, esto es para mostrar las carpetas
var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));

//bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Expose-Headers', 'Authorization');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/', appRoutes);


//escuchar peticiones
app.listen(3000, () => {
    console.log('Express Server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', ' online')
})