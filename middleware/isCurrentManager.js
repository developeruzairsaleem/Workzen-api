const knex  = require('../config/dbConfig');
const isCurrentManager=async(req,res,next)=>{
    
    
    const {userid,role}=req.user;
    if(role==="admin"){
        return next();
    }

    const {projectId} = req.params;
    const response = await knex.select('*').from('projectrole').where({projectid:projectId})    
    console.log(response);
    return next()    

}


module.exports = isCurrentManager;