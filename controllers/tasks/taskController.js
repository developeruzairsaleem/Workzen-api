const knex =require('../../config/dbConfig');


const taskController = {

async createTask(req,res, next){



// task routes
// router.post('/api/projects/:projectId/tasks',auth,taskController.createTask)
   const {title,description,assignedUsername} = req.body;
   const{projectId} = req.params;
   const {userid,role}=req.user;
   let user ;

   // -----------1 get the username of the user
    try {
       user = await knex.select('*').from('users').where({id:userid}).first();
    } catch (error) {
        console.log(error);
       return res.status(500).json({error:'error getting the user from db'})
    }



    // -----------2 first we have to verify that the current user is the member of the project or 'admin'
    // ---projectmembers schema  id--------projectid----------username
        try {
         const userMember = await  knex.select('*').from('projectmembers').where({username:user.username,projectid:projectId})

         if( !userMember[0] && role !== 'admin' ){
            return res.status(401).json({error:'user is not the member'})
         }

        } catch (error) {
            console.log('Server error', error);
            return res.status(401).json({error:"Internal server error"})
        }



    // ------3 -----------
    // task schema 
    // ----------id-------title------description-------projectid-------email------assigned------status
    // save the user task
    try {
        
        assignedUsername
    }
     catch (error) {
        console.log(error);
   
    }
    






},






}




module.exports = taskController