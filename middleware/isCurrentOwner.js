const knex  = require('../config/dbConfig');
const isCurrentOwner=async(req,res,next)=>{
    
    const {projectId,userId} = req.params;
    
    const {userid,role}=req.user;
    if(userId===userid+''){
        return res.status(400).json({error:"The owner cannot be upgraded"})
    }
    if(role==="admin"){
       
        // check if the role of the current user is admin then check the project availability
       const [project] = await knex.select('*').from('projects').where({id:projectId})
       
       //if the project does not exist return error
       if(!project) return res.status(401).json({error:"The project does not exist"})
       
       // otherwise go to the next middleware 
       return next();
    }

    // get the username of the current user from db
    const [user] =  await knex.select('username').from('users').where({id:userid})
    
    // now get the project from the db if the user is its current manager
    const [project] = await knex.select('*').from('projects').where({id:projectId,username:user.username})   

    // if user is not the manager return error
    if(!project){
        return res.status(401).json({error:"user is not the project owner"})
    }

    // and if he is the manager go to next middleware in the middleware chain
    return next()    

}


module.exports = isCurrentOwner;