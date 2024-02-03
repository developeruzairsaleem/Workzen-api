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
    .then(result=>{
      if(result[0]?.userid){
       return knex('tokens').where({userid}).update({token})
      }
      else{
        return knex('tokens').insert({userid,token})
      }
    })
  }, 













  register: function (req, res, next) {
    const { username, email, password } = req.body;
    const response = {};
    // validating user
    const isValid = authController.validateUser(username, email, password);
    if (isValid) {
      // if valid sending data to postgres
      knex.transaction((trx) => {
        const hash= bcrypt.hashSync(password,10);
        return knex.insert({username,email})
         .into('users')
         .returning('*')
         .transacting(trx)
         .then(userData=>{
          console.log("USERDATA INSERTED:",userData);
          response.username= userData[0].username;
          response.email = userData[0].email;
          response.id = userData[0].id;
          return knex.insert({email})
          .into('userrole')
          .returning('*')
          .transacting(trx)
         })
         .then(userRole=>{
           response.role = userRole[0].role;
          console.log("USERROLE INSERTED:", userRole);
          return  knex.insert({email,hash})
          .into('login')
          .returning('*')
          .transacting(trx)
         })
         .then(res=>{
           response.hash= res[0].hash;
           console.log("USER HASH INSERTED",res);
         })
         .then( trx.commit)
         .catch(trx.rollback);
       })
       .then(_=>{
          
         return  res.status(201).json(response)

       })
       .catch(err=>{
         return  res.status(400).json({error:'user not created'});
       })

    } else {
      return res.status(400).json({error:"invalid"});
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