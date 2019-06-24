var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');

require('dotenv').config()

var porta = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/clientA', require('./Handler/ClientA.js'));
app.use('/clientB', require('./Handler/ClientB.js'));

app.listen(porta);
