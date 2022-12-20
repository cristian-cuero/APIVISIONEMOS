const crypto = require("crypto");

let ENC_KEY = "bf3c199c2470cb477d907b1e0917c17b"; // set random encryption key
const encryptAES256 = (val) => {
    // encriptar
    
    let cipher = crypto.createCipheriv("aes-256-ecb", ENC_KEY, null);
    let encrypted = cipher.update(val, "utf8", "base64");
    encrypted += cipher.final("base64");
    //let encrypted2  = cipher.update(ENC_KEY, 'utf8', 'base64');
    //ncrypted2 += cipher.final('base64');
    return encrypted
   //return encrypted
     
      //console.log("LLAVE 64");
     //console.log(buff)
     //console.log("LLAVE NORMAL");
     //console.log(Buffer.from( buff, 'base64').toString('utf8') )
     //decrypt(encrypted);
     // console.log(IV);
  };
  

  const  Base64Encrypt  = () => {
    //console.log(Buffer.from(ENC_KEY, 'utf-8').toString('base64'))
    return Buffer.from(ENC_KEY, 'utf-8').toString('base64');
  }

  module.exports = {
    encryptAES256,
    Base64Encrypt
    
  }