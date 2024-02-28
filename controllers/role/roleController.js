const knex = require('../../config/dbConfig')


const roleController={

   async assignUserToProject(req,res,next){
        const{projectId,userId}=req.params;
        // check if the user is already a member of the project
         console.log(typeof projectId,typeof userId)

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

        // if so then just don't add him to the project
        try {
            const [assignee]=  await  knex.select('*').from('projectmembers').where({username,projectid:projectId})
            if(assignee){
                return res.status(400).json({error:"user is already a member of the project"})
            }
            
        } catch (error) {
            console.log(error)
            return res.status(400).json({error:"error adding the user to the project"})
        }


        // else add the user to the project
        try {
          const response = await knex.transaction(async(trx)=>{
                const [member]  = await trx('projectmembers').insert({projectid:projectId,username}).returning('*')
               const [role] = await trx('projectrole').insert({username,projectid:projectId}).returning('*')
                return {member,role}
            })

        return res.status(200).json({response})
        } catch (error) {
            console.log(error);
            return res.status(400).json({error:"Error in transaction"})

        }

    },

    async deleteUserFromProject(req,res,next){


       const{userId,projectId} = req.params;
       // get the username of the user
       let username;
       try {
       const [user]= await knex.select('*').from('users').where({id:userId})
       if(!user) return res.status(400).json({error:"user does not exist to add"}) 
       username = user.username;
    
} catch (error) {
        console.log(error); 

    }

    // now after getting the username check if this is the user who created the project
    // if so don't delete the user else delete the user from the project


    try {
        const response =await knex.transaction(async trx=>{
            // deleting the projectrole
            const roleDel = await trx('projectrole').where({username,projectid:projectId,role:"team member"}).del();
          console.log(roleDel)
            if(!roleDel) throw Error;
            const memberDel = await trx('projectmembers').where({username,projectid:projectId}).del();
            console.log(roleDel,memberDel)
            return{roleDel,memberDel}
        })
        return res.status(200).json({response})
    } catch (error) {
        console.log(error);
        return res.status(400).json({error:"error in removing user from project"})
    }
    
    
    
    
    
},
async updateRoleInProject(req,res,next){
    
    

    const{userId,projectId} = req.params;
    



    }




}










module.exports = roleController;




