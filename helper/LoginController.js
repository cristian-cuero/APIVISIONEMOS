// Aqui Se realiza la Validacion del loguin para obtener el token
const axios = require("axios");

const LoginController = async () => {
  //creo el x-www-form-utlencode
  const params = new URLSearchParams();
  params.append("client_id", process.env.client_id);
  params.append("client_secret", process.env.client_secret);
  params.append("grant_type", process.env.grant_type);
  params.append("scope", process.env.scope);
  //parametros de la peticiom
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  const resp = await axios.post(process.env.urlLogin, params, config)
    if (resp.status === 200) {
      const { access_token } = await resp.data;
      process.env.token = access_token
    } else {
      console.log("Error Al Autenticares", resp.json());
    }

    return true
};

module.exports = LoginController;
