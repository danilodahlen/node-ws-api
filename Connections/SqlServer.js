var sql         = require('mssql');
global.config   = require("../Config/database.json");


exports.execute = function(v_DB,v_Param,f_CallBack){
    //console.log(v_Param);
    new sql.ConnectionPool(global.config[v_DB].database).connect().then(pool => {
            return pool.request()
            .query(v_Param).then(function(v_retorno) {
                    sql.close();
                    if(f_returnError(v_retorno)){
                        f_CallBack(v_retorno,true);    
                    }
                    else{
                        f_resultJson(v_retorno,'SQL',function(v_retorno){
                            f_CallBack(v_retorno,false);
                        });
                    }
                });
        }).catch(function(v_retorno) {
            sql.close();
            if(f_returnError(v_retorno)){
                f_CallBack(v_retorno,true);
            }
            else{
                f_resultJson(v_retorno,'SQL',function(v_retorno){
                    f_CallBack(v_retorno,false);
                });
            }
        });
}

var f_returnError = function(v_Param){  
    return (v_Param.originalError ? true : false);
}

var f_resultJson = function(res,v_TypeCallExtern,f_CallBack){

    if(v_TypeCallExtern == 'HTTP'){
      const statusCode = res.statusCode;
      const contentType = res.headers['content-type'];
      
      if (statusCode != 200){
        f_Callback("Erro de conexão com o servidor | " + statusCode.toString());
        return;
      }
      res.setEncoding('utf8');
      var rawData = '';
      res.on('data', (dados) => { rawData += dados; });
      res.on('end', () => {
          try {
              const parsedData = JSON.parse(rawData);
                f_CallBack((parsedData ? parsedData : false));
              
          } catch (e) {
              f_CallBack((parsedData ? parsedData : false));
          }
      });
    }
    else if(v_TypeCallExtern == "SQL"){
        f_CallBack((res.recordset ? res.recordset : false));
    }
}

