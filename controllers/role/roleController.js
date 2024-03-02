const knex = require('../../config/dbConfig'); // import the knex config where we have setup the db connection
const { isValidStringLength,isValidProjectRole } = require('../../utils/validationUtils');
const {getUser} =  require("../../utils/user");
const { getProjectMember,addProjectMember, updateProjectRole } = require('../../utils/projectUtils');

// these controllers will work on roles, like giving access for certain users to perform certain actions
const roleController={









    



    // this controller will add a registered user to a particular project
    async addUserToProject(req,res,next){

        // the 'userId' of User we want to add to the project with projectid --> 'projectId'
        const{projectId,userId}=req.params; 

        //---------------------------------------------------
        // check if the user is already a member of the project
        //---------------------------------------------------
        // get the username of the registering user
        // ----------------------------------------
        let username;
        try {
            const user =   await getUser(userId); // getUser will query user from 'users' tbl by using userId

            // if the user does not exist in db that means user is not registered
            if(!user){
               return res.status(400).json({error:"userId is invalid"});
            }
            username = user.username; // assign to 'username' if the 'user' is returned
        } catch (error) {
            console.log(error);
            return res.status(500).json({error:"Server error while checking user validity"});
        }

        // now check if user is already the member of the project
        // -------------------------------------------------------
        try {
            // 'getProjectMember' will query in 'projectmembers' tbl with 'username' and 'projectId'
            const memberOfProject =  await getProjectMember(username,projectId);
            if(memberOfProject){
                return res.status(400).json({error:"user is already a project member"});
            }
        } catch (error) {
            console.log(error);
            return res.status(400).json({error:"error adding the user to the project"});
        }


        // if user is not the member of the project just add him to the project
        // ---------------------------------------------------------------------
        try {
            // 'addProjectMember' returns data after adding in 'projectmembers' and 'projectrole' tbl
            const memberData = await addProjectMember(username,projectId);
            return res.status(200).json({response:memberData});
        } catch (error) {
            console.log(error);
            return res.status(500).json({error:"Server error while adding user to project"});

        }

    },


























    async deleteUserFromProject(req,res,next){

       const{userId,projectId} = req.params;
       // get the username of the user
       let username;
       try {
        const user =   await getUser(userId); // getUser will query user from 'users' tbl by using userId
       if(!user) return res.status(400).json({error:"userId is invalid"}) 
       username = user.username;// if user exist then assign to username
    
} catch (error) {
    console.log(error); 
    return res.status(400).json({error:"Error getting user"})
    
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
    
    //------------------------
    //get the info from the client
    //------------------------
    const{userId,projectId} = req.params;
    const {role} = req.body;
    
    //--------------------------------
    //check if the role data is valid
    //--------------------------------
    if(!isValidProjectRole(role)){
        return res.status(400).json({error:"Invalid input for role"})
    }


    //---------------------------------------------------------------------------
    // now get the username of the user we have to update the role of in a project
    //---------------------------------------------------------------------------

    let username;
    try {
        const user = await getUser(userId); // getUser will query user from 'users' tbl by using userId
        if(!user) {
            return res.status(400).json({error:"userId is invalid"}) 
        }
        username = user.username;
    } catch (error) {
        console.log(error); 
        return res.status(500).json({error:"Server error while checking user validity"})
    }


    //--------------------------------------------------
    // now update the role for the user
    //--------------------------------------------------

    try {
     const projectRole = await updateProjectRole(role,username,projectId);
        if(!projectRole){
            return res.status(400).json({error:"User is not in the current project"})
        }
       return res.status(200).json({response:projectRole})
    } catch (error) {
        console.log(error)
        return res.status(400).json({error:"Error updating the role of user"})
    }

        }




}










module.exports = roleController;




