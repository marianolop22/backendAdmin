var express = require('express');
var app = express();
const path = require('path');
const fs = require('fs');

app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var pathimagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathimagen)) {
        res.sendFile(pathimagen)
    } else {
        var noImagen = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendfile(noImagen);
    }
})


module.exports = app;