const Firebird = require('node-firebird');
var options = {};

// options.host = '181.143.125.162';
// options.port = '3051';
options.host = '26.242.194.209';
//options.host = "177.253.202.242";
options.port = 3051;
options.database = "BDPISCO";
options.user = 'SYSDBA';
options.password = 'masterkey';
options.lowercase_keys = false; // set to true to lowercase keys
options.role = null;            // default
options.pageSize = 4096;        // default when creating database
options.pageSize = 4096;        // default when creating database
options.retryConnectionInterval = 1000; // reconnect interval in case of connection drop
options.blobAsText = false; // set to true to get blob as text, only affects blob subtype 1


const consulta  = async ( sql = "", parametor = []) => {

    return new Promise((resolve, reject  ) => {
        Firebird.attach(options, function(err, db) {

            if (err)
                reject(err);
        
            // db = DATABASE
            try {
                db.query(sql,parametor,function(err, result) {
                
                    if(err){
                        reject(err);
                    }
                    resolve(result)
                    //console.log(result);
                    db.detach();
                });
            } catch (error) {
                
            }
          
        
        });


    })
   
}



module.exports =  consulta