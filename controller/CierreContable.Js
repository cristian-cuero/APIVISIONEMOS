const consulta = require("../db/DBConection");
const moment = require("moment");
const Cuenta = require("../model/Cuenta");
var ip = require("ip");
const crypto = require("crypto");
const { encryptAES256, Base64Encrypt } = require("../helper/cifrado");
const { EnvioData } = require("../helper/EnvioData");

//** clase encargada de realizar el cierre contable y enviarlo a visionemos
const CierreContable = async () => {
  //validamos si hay un token por si no lo hay havemos la peticion y lo obtenemos

  //iniciamos seccion y obtebemos el token
  //await LoginController();

  //!se realiza la consulta  de los pagos que estan sin sincroniozar en la BD Y Se Crea La Estructura
  //? variable que arma la sentencia "sql"
  let sql = "select *  from P_CONSULTAPAGOSVISIONAMOS ";

  //**realizamos la consulta (Consulta es una funcion que recibe un string y un arreglo de condiciones del where)
  const pagos = await consulta(sql, []);

  //? crea un objeto JSON con los debitos y creditos del pago tal  y como lo solicita visionemos  Ver El README
  let Moviemiento = {};

  //? variable donde se guardan las cuentas del  moviemito
  let CuentasMovimitos = [];

  let Recibo = "";
  let clientesID = "";

  let notificar = "";
  let i = 0;

  //**Se Realiza  Un Ciclo de los pagos Y Arma El Objeto JSON el foreach No Acepta El Await En Los Ciclos
  for (const element of pagos) {
    //**Si Hay Varios Pagos
    if (element.NORECIBO != Recibo) {
      if (Object.keys(Moviemiento).length != 0) {
        Moviemiento.accountingMovementDTO = CuentasMovimitos;

        //CuentasMovimitos = [Moviemiento];
        //console.log("Moviemiento :>> ", Moviemiento);
        const data = encryptAES256(JSON.stringify(Moviemiento));
        const key = Base64Encrypt();
        // console.log(Moviemiento)
        CuentasMovimitos = [];
        Moviemiento = {};
        clientesID = "";
        const p = await EnvioData(Recibo, data, key, notificar, clientesID);
        //console.log(Recibo);
        clientesID = "";
        //encrypt();
      }

      Moviemiento.date = moment(element.FECHA).format("YYYY-MM-DD");
      Moviemiento.hour = moment(element.FECHANOW).format("YYYY-MM-DD HH:MM");
      Moviemiento.channel = "VISIONEMOS";
      Moviemiento.ip = ip.address();
      Moviemiento.user = element.USUARIO;
      Moviemiento.idAccountingVoucher = "03";
      notificar = element.NOTIFICADO;

      //debito
      let cuenta = new Cuenta(
        element.CUENTAPUENTE,
        element.CLIENTEPAGO,
        element.DETALLE + " MOVIMIENTO PISCO",
        element.VALORDEBITO,
        "0",
        element.NORECIBO,
        element.IDAGENCIA
      );
      clientesID = clientesID + " " + element.CLIENTEPAGO;
      let texto = JSON.stringify(cuenta);
      let objeto = JSON.parse(texto);
      CuentasMovimitos.push(objeto);
      //credito
      cuenta = new Cuenta(
        element.NROCUENTA,
        element.CLIENTE,
        element.DETALLE + " MOVIMIENTO PISCO",
        "0",
        String(element.VALORCUENTA),
        element.NORECIBO,
        element.IDAGENCIA
      );
      texto = JSON.stringify(cuenta);
      objeto = JSON.parse(texto);
      CuentasMovimitos.push(objeto);

      clientesID = clientesID + " " + element.CLIENTE;
    } else {
      //es credito
      if (element.TIPO === 0) {
        const cuenta = new Cuenta(
          element.NROCUENTA,
          element.CLIENTE,
          element.DETALLE + " MOVIMIENTO PISCO",
          "0",
          String(element.VALORCUENTA),
          element.NORECIBO,
          element.IDAGENCIA
        );
        const texto = JSON.stringify(cuenta);
        const objeto = JSON.parse(texto);
        CuentasMovimitos.push(objeto);
      } else {
        //es debito
        const cuenta = new Cuenta(
          element.NROCUENTA,
          element.CLIENTE,
          element.DETALLE + " MOVIMIENTO PISCO",
          String(element.VALORCUENTA),
          "0",
          element.NORECIBO,
          element.IDAGENCIA
        );
        const texto = JSON.stringify(cuenta);
        const objeto = JSON.parse(texto);
        CuentasMovimitos.push(objeto);
      }
      clientesID = clientesID + " " + element.CLIENTE;
    }

    Recibo = element.NORECIBO;

    i++;
    //*si Hay Uno Solo O Traaer El Ultimo Elemento
    if (i === pagos.length) {
      Moviemiento.accountingMovementDTO = CuentasMovimitos;
      //CuentasMovimitos = [Moviemiento];
      await EnvioData(
        Recibo,
        encryptAES256(JSON.stringify(Moviemiento)),
        Base64Encrypt(),
        notificar,
        clientesID
      );
      //encrypt();
      CuentasMovimitos = [];
      Moviemiento = {};
      clientesID = "";
    }
  }

  return true;
};

//se proceede a encriptar la informacion
// var encrypt = (val) => {
//   // encriptar
//   const ENC_KEY = "bf3c199c2470cb477d907b1e0917c17b"; // set random encryption key
//   const IV = "5183666c72eec9e4" // set random initialisation vector
//   const buff = Buffer.from(ENC_KEY, 'utf-8').toString('base64');
//   let cipher = crypto.createCipheriv("aes-256-ecb", ENC_KEY, null);
//   let encrypted = cipher.update(val, "utf8", "base64");
//   encrypted += cipher.final("base64");
//   //let encrypted2  = cipher.update(ENC_KEY, 'utf8', 'base64');
//   //ncrypted2 += cipher.final('base64');
//    console.log(encrypted);
//     console.log("LLAVE 64");
//    console.log(buff)
//    console.log("LLAVE NORMAL");
//    console.log(Buffer.from( buff, 'base64').toString('utf8') )
//    //decrypt(encrypted);
//    // console.log(IV);
// };

module.exports = CierreContable;
