const knex  = require('../config/dbConfig');
const isCurrentManager=async(req,res,next)=>{
    
    const {projectId} = req.params;
    
    const {userid,role}=req.user;
    
    if(role==="admin"){
       
        // check if the role of the current user is admin then check the project availability
       const [projectRole] = await knex.select('*').from('projectrole').where({projectid:projectId})
       
       //if the project does not exist return error
       if(!projectRole) return res.status(401).json({error:"The project does not exist"})
       
       // otherwise go to the next middleware 
       return next();
    }

    // get the username of the current user from db
    const [user] =  await knex.select('username').from('users').where({id:userid})
    
    // now get the project from the db if the user is its current manager
    const [response] = await knex.select('*').from('projectrole').where({projectid:projectId,username:user.username,role:'project manager'})   

    // if user is not the manager return error
    if(!response){
        return res.status(401).json({error:"user is not the project manager of the project"})
    }

    // and if he is the manager go to next middleware in the middleware chain
    return next()    

}


module.exports = isCurrentManager;