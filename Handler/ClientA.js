module.exports = function(){
    
    var express = require('express');
    var app = express();
    var Method = require('../Functions/methods.js');
    
    app.post('/gravarClientes', function (req, res) {
        let parametros = new Array();

        parametros.push(['string', req.query.id]);
        parametros.push(['string', req.query.nome]);
        parametros.push(['date', req.query.data_nascimento]);

        Method.f_executeProcedure('BASEA',parametros, 'nsp_GravarCliente', function (v_retorno, err) {
            res.send(v_retorno);
        });
    });

    return app;
}();
