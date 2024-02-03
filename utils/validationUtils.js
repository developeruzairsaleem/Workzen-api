

// validation function for checking string length
 const isValidStringLength=(value,min,max)=>{
    return typeof value==='string' && value.length>=min && value.length<=max;

  }


  // validation function for checking email 
  const isValidEmail=(email)=>{
    const emailRegex =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof email ==='string' && emailRegex.test(email);

  }



  // validating user data
 const validateUser=(username, email, password)=> {
    //validating username
    if(!isValidStringLength(username,5,100)){
      return false;
    }
    // validating email
    else if (!isValidStringLength(email,5,100) || !isValidEmail(email)) {
      return false;
    }
    // validating password
    else if (!isValidStringLength(password,5,100)) {
      return false;
    }
    // if everything is correct returning true
    return true;
  }


  module.exports ={
    validateUser,isValidEmail,isValidStringLength
  }