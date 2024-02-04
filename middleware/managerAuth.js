const knex = require('../config/dbConfig')
const managerAuth =async(req,res,next)=>{
  
  
  try{
      if(user&&req.user?.role==='project manager'||req.user?.role==='admin'){
          return next();
      }
      return res.status(403).json({error:'Forbidden: Project manager access required'})
      }
      catch(error){
          return res.status(403).json({error:'Forbidden: Project manager access required'})
    }

}
module.exports = managerAuth;