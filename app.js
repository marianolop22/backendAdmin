//punto de entrada a la aplicacion
//requires
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


//inicializar variables
var app = express();

//conecxion a la base
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true }, (err, res) => {

    if (err) {
        throw err;
    }

    console.log('Base de datos \x1b[32m%s\x1b[0m ', 'online');
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({ message: 'todo ok' });
})

//escuchar peticiones
app.listen(3000, () => {
    console.log('Express Server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', ' online')
})