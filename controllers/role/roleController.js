const knex = require('../../config/dbConfig')


const roleController={

   async assignUserToProject(req,res,next){
        const{projectId,userId}=req.params;
        // check if the user is already a member of the project
         console.log(typeof projectId,typeof userId)
        return res.status(400).json({projectId,userId})

        let username;
        //--------------------------------------
        // get the username of the registering user
        try {
            const [user] =   await knex.select("*").from("users").where({id:userId})
                if(!user){
                    return res.status(400).json({error:"The assignee to the project is not a user"})
                }
           username = user.username;
            
        } catch (error) {
            console.log(error)
            return res.status({error:"Error assigning a user to the project"})
        }  


        //---------------------------------------------
        // now check if the user is the member of the current project if so then don't register him to the project;

        try {
            const [assignee]=  await  knex.select('*').from('projectmembers').where({username,projectid:projectId})
            if(assignee){
                return res.status(400).json({error:"user is already a member of the project"})
            }


            knex('project')




        } catch (error) {
            console.log(error)
            return res.status(400).json({error:"error adding the user to the project"})
        }



      

        knex.select()
        // if so then just don't add him to the project

        res.status(200).json({success:'success'})

    }



}










module.exports = roleController;




