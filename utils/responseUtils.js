const { response } = require("../server");

  // create response object for the register controller
 const createResponseObjectRegister=(userData,userRole,userHash)=>{
    const response ={}
    response.username= userData[0].username;
    response.email = userData[0].email;
    response.id = userData[0].id;
    response.role = userRole[0].role;
    response.hash= userHash[0].hash;
    return response;
  }


  // save tokens in register response obj
  const saveTokensInResponseObj=(responseObj,accessToken,refreshToken)=>{
    responseObj.accessToken= accessToken;
    responseObj.refreshToken = refreshToken;
    return responseObj;

  }


  module.exports = {
    createResponseObjectRegister, saveTokensInResponseObj
  }