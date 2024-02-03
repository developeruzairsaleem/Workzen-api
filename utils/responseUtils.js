
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


  module.exports = {
    createResponseObjectRegister
  }