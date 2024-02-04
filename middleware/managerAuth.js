// const knex = require('../config/dbConfig')
const managerAuth =(req,res,next)=>{
      if(req?.user?.role==='project manager'||req?.user?.role==='admin'){
          return next();
      }
      return res.status(403).json({error:'Forbidden: Project manager access required'})
      }

module.exports = managerAuth;