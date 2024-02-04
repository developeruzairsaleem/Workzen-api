const jwt = require('jsonwebtoken')
const knex = require('../config/dbConfig')

// Can generate access token
 const generateAccessToken=(userid, role)=>{
    return jwt.sign({userid,role},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'})
  }
  

  // Will generate a refresh Token
  const generateRefreshToken=(userid,role)=>{
    return jwt.sign({userid,role},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'24h'})

  }
  

  // store the refresh token in database
 const storeRefreshToken=(token,userid,trx)=>{
   return knex.select('*').from('tokens').where({userid}).transacting(trx)
    .then(tokenInDB=>{
      if(tokenInDB[0]?.userid){
       return trx('tokens').where({userid}).update({token})
      }
      else{
        return trx('tokens').insert({userid,token})
      }
    })
  }


  module.exports ={
    storeRefreshToken,generateRefreshToken,generateAccessToken
  }