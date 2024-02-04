const jwt = require('jsonwebtoken')
const knex = require("../config/dbConfig")
const auth = async(req,res,next)=>{
   const accessToken = req.headers['Authorization'];
   if (!accessToken){
      return res.status(401).json({error:"unauthorized"})
   }
try{

   jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET,async(err,decoded)=>{
      if(err){
         return res.status(401).json({error:"Invalid token"})
      }
      
      req.user = decoded;
    const user = await knex.select('*').from('users').where({id:decoded.userid}).first();
    if(!user) {return res.status(401).json({error:"user not found"}) } 
    return next();
   })
   
}
catch(error){
   return res.status(401).json({error:"unauthorized"})
}
}


module.exports = auth;