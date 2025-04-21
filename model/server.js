//modelo del servidor
//libreria Externa
const express = require("express");
//uso de cors
const cors = require("cors");
const consulta = require("../db/DBConection");

const CierreContable = require("../controller/CierreContable.Js");
const { Logs } = require("../helper/Logs");




class Server {
  //constructor
  constructor() {
    //this.app = express()
    //this.port = process.env.puerto

    //paths de rutas
   // this.paths = {
     // usuarios: "/api/users",
   // };

    //this.middleware();
    //rutas de la aplicacion
    // this.routes();
     this.conectarDD();
  }

  //para que escuche la aplicacion
  listen() {
    
      console.log(`Backend corriendo en http://localhost De Manera Satisfactoria`);
  }


  //crea la configuracion de los parametros necesarias para loguearse
  async conectarDD(){

    try {
      const data =  await consulta("select *  from TBLPARAMETOSCONTABLES") ;
       process.env.client_id = data[0].CLIENT_ID
       process.env.client_secret = data[0].CLIENT_SECRET
       process.env.grant_type = data[0].GRANT_TYPE
       process.env.scope = data[0].SCOPE
       process.env.date =   data[0].FECHAINICIO
       process.env.passwordmail =  data[0].CORREOPASWORD
       process.env.correosNoti = data[0].CORREONOTIFICA;
       
       //CierreContable();
        //setInterval( async () =>  await CierreContable(), 5000)
        //const estado = false
        Logs() 
       while(true) {
        console.log("INICIO")
        await Promise.all([
          CierreContable(),
          this.timeout(30000)
      ]);
      
    
       }
       

    } catch (error) {
      if(error.gdsparams){
        console.log ("Error En La Conexion Con La BD", error)
        Logs(error) 
        this.conectarDD();
      }else{
        console.log ("Error En La Consulta PRINCIPAL", error)
        Logs(error) 
        this.conectarDD();
      }
     
    }

   
     

  }

 
  timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


  //importar Rutas

}
//exportar
module.exports = Server;