var express = require('express');
var app = express();

app.get('/', (req, res, next) => {
    res.status(200).json({ message: 'todo ok' });
})


module.exports = app;