const Connection = require('../Connections/SqlServer.js');

const f_convertJsonToArray = function(v_Param) {
    var keys = Object.keys(v_Param);
    var v_result = new Array(keys.length * 2);
    var j = 0;

    for (var i = 0; i < keys.length; i++) {
        v_result[j] = keys[i];
        v_result[j + 1] = v_Param[keys[i]];
        j = j + 2;
    }

    return v_result;
}

function _f_montarQuery(v_Param, v_Proc) {
    var retorno = 'EXEC ' + v_Proc + ' ';
    for (var i = 0; i < v_Param.length; i++) {

        if (v_Param[i][0] == "string") {
            retorno += (v_Param[i][1] ? '"' + v_Param[i][1] + '"' : null) + ',';
        }
        if (v_Param[i][0] == "date") {
            retorno += (v_Param[i][1] ? '"' + f_toDate(v_Param[i][1]) + '"' : null) + ',';
        }
        if (v_Param[i][0] == "float") {
            retorno += (v_Param[i][1] ? '' + f_toFloat(v_Param[i][1]) + '' : null) + ',';
        }
        if (v_Param[i][0] == "decimal") {
            retorno += (v_Param[i][1] ? '' + f_toDecimal(v_Param[i][1]) + '' : null) + ',';
        }
        if (v_Param[i][0] == "int") {
            retorno += (v_Param[i][1] ? '' + f_toInt(v_Param[i][1]) + '' : null) + ',';
        }
        if (v_Param[i][0] == "bool") {
            retorno += '' + f_toInt(v_Param[i][1]) + '' + ',';
        }
    }

    retorno = retorno.substring(0, retorno.length - 1);

    return retorno;
}

const f_executeProcedure = function(v_DB,v_Param, v_Proc, f_CallBack) {
    Connection.execute(v_DB,_f_montarQuery(v_Param, v_Proc), function(v_Dados, err) {
        f_CallBack(v_Dados, err);
    });
}

const f_converterJsonToString = function(v_Param) {
    return JSON.stringify(v_Param);
}

const f_toInt = function(v_Param) {
    return f_replaceAll(f_replaceAll(v_Param, '.', ''), ',', '');
}

const f_toFloat = function(v_Param) {
    return f_replaceAll(v_Param, ',', '.');
}

const f_toDecimal = function(v_Param) {
    return f_replaceAll(v_Param, ',', '.');
}

const f_replaceAll = function(v_Texto, Substituir_De, Substituir_Por) {
    v_Texto = v_Texto.toString();
    while (v_Texto.indexOf(Substituir_De) > -1) {
        v_Texto = v_Texto.replace(Substituir_De, Substituir_Por);
    }

    return v_Texto;
}

const f_toDate = function(v_Param) {
    return v_Param.split("/")[2] + '-' + v_Param.split("/")[1] + '-' + v_Param.split("/")[0];
}

const f_zeroEsquerda = function(v_Valor, v_Tamanho) {
    v_Valor = v_Valor.toString();
    while (v_Valor.length < v_Tamanho)
        v_Valor = 0 + v_Valor;
    return v_Valor;
}


module.exports = {
    f_toInt: f_toInt,
    f_toFloat: f_toFloat,
    f_toDecimal: f_toDecimal,
    f_toDate: f_toDate,
    f_zeroEsquerda: f_zeroEsquerda,
    f_replaceAll: f_replaceAll,
    f_executeProcedure: f_executeProcedure,
    f_converterJsonToString: f_converterJsonToString,
    f_convertJsonToArray: f_convertJsonToArray
}