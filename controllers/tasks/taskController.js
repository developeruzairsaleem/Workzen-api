const knex =require('../../config/dbConfig');


const taskController = {

async createTask(req,res, next){



// task routes
// router.post('/api/projects/:projectId/tasks',auth,taskController.createTask)
    // validation for deadline and title description 
   const {title,description,assignedUsername, deadline} = req.body;
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
    // -------id-------title------description-------projectid-------email------assigned------status-------
    // CHECK IF THE ASSINGED USER IS THE PROJECT MEMBER
    try {
       
       const [assignedUser] = await knex.select("*").from('projectmembers').where({username:assignedUsername,projectid:projectId})
       if(!assignedUser){
        return res.status(401).json({error:'assigned user is not the project member'})
       }
      
      
       // insert the task into database
    //   ------------- first get the current time 
       
       const createdTask = await knex.insert({title,description,projectid:projectId,username:user.username,assigned:assignedUsername, start : knex.fn.now(), deadline}).into('tasks').returning('*');
      
       return res.status(201).json({response: createdTask})

    }
     catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal server error"})
    }
    






},






}




module.exports = taskController