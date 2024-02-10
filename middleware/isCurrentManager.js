const knex  = require('../config/dbConfig');
const isCurrentManager=async(req,res,next)=>{
    
    
    const {userid,role}=req.user;
    if(role==="admin"){
        return next();
    }

    const {projectId} = req.params;
                   const [user] =  await knex.select('username').from('users').where({id:userid})
    const [response] = await knex.select('*').from('projectrole').where({projectid:projectId,username:user.username,role:'project manager'})   

    if(!response){
        return res.status(401).json({error:"user is not the project manager of the project"})
    }


    return next()    

}


module.exports = isCurrentManager;