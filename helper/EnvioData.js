//** IMPORTACIONES NECESARIAS
const LoginController = require("./LoginController");
const axios = require("axios");
const consulta = require("../db/DBConection");
const EnviarCorreo = require("./EnviarCorreo");

//TODO: Metodo que envia  la informacion a visionemos y registra si  fue exitoso y crea el logs de registro
const EnvioData = async (Norecibo = "", Data = "", Key = "", notificado = 0, clientesID = "") => {
  //!metodo encargado de traer las credenciales del login

  await LoginController();

  console.log("ENVIO");

  // console.log( 'NO RECIBO ', Norecibo);
  let sql;
  let parametros = [];
  //!peticion a visionemos cierre contable
  //!armamos la data
  const json = JSON.stringify({
    entityId: "00000196",
    data: Data,
    key: Key,
  });

  //armamos el header
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.token,
    },
  };
  try {
    const resp = await axios.post(process.env.urlCierreContable, json, config);
    if (resp.status === 201) {
     // sql =
       // "update tblpagos p set p.sincronizadocontable = 1 where p.norecibo = ?";

      parametros.push(Norecibo);
      try {
        //const pagos = await consulta(sql, parametros);

        sql =
          "INSERT INTO TBLTRANSACCIONESCIERRE ( NORECIBO, CODIGO, DETALLE) VALUES ( ?, ?, ?);";
        parametros.push("200");
        parametros.push("ENVIADO CON EXITO");
        //console.log(parametros);
        await consulta(sql, parametros);
      } catch (error) {
        console.log(error);
      }
    } else {
     
      parametros = [];
      parametros.push(Norecibo);
      sql =
        "INSERT INTO TBLTRANSACCIONESCIERRE ( NORECIBO, CODIGO, DETALLE) VALUES ( ?, ?, ?);";
      const res = await resp.json();
      parametros.push("500");
      parametros.push(res.substring(0, 1000));
      console.log(parametros);
      try {
        await consulta(sql, parametros);
        if(notificado === "0"){
           await EnviarCorreo(res.substring(0, 1000) ,clientesID)
        }
      } catch (error) {
        //console.log(error);
      }

      //console.log();
    }
  } catch (error) {
    let detalle = "Error Al Enviar El Movimiento";
    let sql = "";
    let parametros = [];
    let codigo = "500";
    if (error.response.data.response) {
      codigo = String(error.response.data.response);
    }
    if (error.response.data.errorDescription) {
      detalle = JSON.stringify(error.response.data.errorDescription);
    }
    sql =
      "INSERT INTO TBLTRANSACCIONESCIERRE ( NORECIBO, CODIGO, DETALLE) VALUES ( ?, ?, ?);";
    parametros.push(Norecibo);
    parametros.push(codigo);
    parametros.push(detalle);

    try {
      await consulta(sql, parametros);
      if(notificado === 0 ){
        await EnviarCorreo(detalle ,clientesID)
      }
      //console.log("ERROR AL ENVIAR");
    } catch (error) {
      console.log(error);
    }
    //convierto esto a un objeto
    //console.log(error.response.data.errorDescription);
    //console.log( detalle , codigo);
  }

  return true;
};

module.exports = {
  EnvioData,
};
