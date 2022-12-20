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
    this.app = express()
    this.port = process.env.puerto

    //paths de rutas
    this.paths = {
      usuarios: "/api/users",
    };

    this.middleware();
    //rutas de la aplicacion
    // this.routes();
     this.conectarDD();
  }

  //para que escuche la aplicacion
  listen() {
    this.app.listen(this.port, () => {
      console.log(`Backend corriendo en http://localhost:${this.port}`);
    });
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
       
       //CierreContable();
        //setInterval( async () =>  await CierreContable(), 5000)
        //const estado = false
        Logs() 
       while(true) {
        console.log("INICIO")
        await Promise.all([
          CierreContable(),
          this.timeout(60000)
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
 
  //middlewares de mi app
  middleware() {
    // uso de cors
    this.app.use(cors());
    //lectura y pareson de json
    this.app.use(express.json());
    //use rutas estaticas;
    //directorio publico siempre llama el index para el get / solo 
    this.app.use(express.static('public'))
    //acepta archiva desde peticiones rest es una configuracion
    // this.app.use(
    //   fileUpload({
    //     useTempFiles: true,
    //     tempFileDir: "/tmp/",
    //     createParentPath: true, //mucho cuidado que esto crea carpeta donde sea
    //   })
    // );
  }

  //importar Rutas

}
//exportar
module.exports = Server;