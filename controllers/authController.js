const knex = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'test',
      database : 'workzen'
    }
  });
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



//       ---------------auth schema------------
//users          ----id-----username-------email-------
//userrole       ----id-----role-----------email-------
//login          ----id-----hash-----------email----------


//       --------------tasks schema ---------------
//tasks          ----id-----email----------status--------title--------description----projectid-----asssigned



const authController = {

  // validation function for checking string length
  isValidStringLength(value,min,max){
    return typeof value==='string' && value.length>=min && value.length<=max;

  },

  // validation function for checking email 
  isValidEmail(email){
    const emailRegex =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof email ==='string' && emailRegex.test(email);

  },

  // validating user data
  validateUser(username, email, password) {
    //validating username
    if(!authController.isValidStringLength(username,5,100)){
      return false;
    }
    // validating email
    else if (!authController.isValidStringLength(email,5,100) || !authController.isValidEmail(email)) {
      return false;
    }
    // validating password
    else if (!authController.isValidStringLength(password,5,100)) {
      return false;
    }
    // if everything is correct returning true
    return true;
  },

  // Can generate either token refresh token or access token
  generateToken(userid, role, expireString){
    return jwt.sign({userid,role},process.env.JWT_SECRET,{expiresIn:expireString})
  }
  ,
  // store the refresh token in database
  storeRefreshToken(token,userid){
   return knex.select('*').from('tokens').where({userid})
    .then(tokenInDB=>{
      if(tokenInDB[0]?.userid){
       return knex('tokens').where({userid}).update({token})
      }
      else{
        return knex('tokens').insert({userid,token})
      }
    })
  }, 


  // saving user into 'users' table in database in register
   saveUserToDB (username,email,trx){
    return knex.insert({username,email})
    .into('users')
    .returning('*')
    .transacting(trx)
  }
  ,

  // saving user role into 'userrole' table in database in register
  saveUserRoleToDB(email,trx){

    return knex.insert({email})
    .into('userrole')
    .returning('*')
    .transacting(trx)
  },

  // hashing and saving password to database for register controller
  savePasswordHashToDB(email,password,trx){

    const hash= bcrypt.hashSync(password,10);
    return  knex.insert({email,hash})
    .into('login')
    .returning('*')
    .transacting(trx)

  }
  ,

  // create response object for the register controller
  createResponseObjectRegister(userData,userRole,userHash){
    const response ={}
    response.username= userData[0].username;
    response.email = userData[0].email;
    response.id = userData[0].id;
    response.role = userRole[0].role;
    response.hash= userHash[0].hash;
    return response;
  }
  ,
/*------------------------------------------------------------------------*/
/*--------------------------Register Controller---------------------------*/
/*------------------------------------------------------------------------*/
  async register(req, res){
    const { username, email, password } = req.body;

    // validating user
    const isValid = authController.validateUser(username, email, password);
    if (!isValid) {
      // if credentials are not valid sending invalid response
      return res.status(400).json({error:"invalid"});
    }
      try {

          // if the credentials are valid creating a transaction for storing data
          const response =  await knex.transaction(async(trx) => {

          // save user data into postgres 
            const userData = await authController.saveUserToDB(username,email,trx);

          // save user role into postgres 
            const userRole = await authController.saveUserRoleToDB(email,trx)

          // save user hash into login table in database  
            const userHash = await authController.savePasswordHashToDB(email,password,trx)

            // create a response object containing all the values returned from above db interaction
            const response = authController.createResponseObjectRegister(userData,userRole,userHash)

            // commit the transaction and return the response OBJ if everything is saved to db
            return response;
         })
          // after the successful transaction sending the response to the client with 'success'
          return  res.status(201).json(response)
        }
      catch (error) {

          // if any error occured during transaction respond with 400 error
          console.log(error)
           return  res.status(400).json({error:'user not created'});
      }
  },










//  login controller
  login(req, res, next) {

    const {email, password } = req.body;
    const response ={};


    // validating user
    const isValid = authController.validateUser("DEFAULT", email, password);
    if(!isValid){
      return res.status(400).json({ error:"invalid"});
    }


    // Retrieving user data from the database
      knex.select("*").from("login").where({email}).first()
      .then(user=>{
        if(!user){
          throw new Error("User not found!")
        }
        // Comparing passwords  
        return bcrypt.compare(password, user.hash);
      })

      //handling the password match
      .then(passwordMatch=>{
        if(!passwordMatch){
         throw new Error('password did not match');
        }
        return knex.select('*').from('users').where({email}).first()
      })

      //handling the user data
      .then(user=>{
        response.username= user.username;
        response.email= user.email;
        response.id = user.id;
        return knex.select("*").from('userrole').where({email}).first()
      })

      //handling the role data
      .then(userRole=>{
        response.role= userRole.role;
        return res.status(200).json(response)
      })
      .catch((err)=> {
        console.log(err)
        res.status(400).json({error:"invalid credentials"})})


  },




  logout(req, res, next) {},
};

module.exports = authController;