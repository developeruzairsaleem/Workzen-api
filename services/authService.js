 const knex = require('../config/dbConfig')
 const bcrypt = require('bcrypt')


 // hashing and saving password to database for register controller
 const savePasswordHashToDB=(email,password,trx)=>{
    const hash= bcrypt.hashSync(password,10);
    return  knex.insert({email,hash})
    .into('login')
    .returning('*')
    .transacting(trx)

  }

// saving user into 'users' table in database in register
const saveUserToDB= (username,email,trx)=>{
    return knex.insert({username,email})
    .into('users')
    .returning('*')
    .transacting(trx)
  }
  

  // saving user role into 'userrole' table in database in register
 const saveUserRoleToDB=(email,trx)=>{

    return knex.insert({email})
    .into('userrole')
    .returning('*')
    .transacting(trx)
  }


  module.exports={
    savePasswordHashToDB,saveUserToDB,saveUserRoleToDB
  }