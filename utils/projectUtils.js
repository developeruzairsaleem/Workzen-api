const knex= require('../config/dbConfig'); // import the knex config where we have setup the db connection

//------------------------------------------------------------------------
// get the project member  by providing the 'username' and 'projectId' 
// in argument from db in 'projectmembers' tbl
//------------------------------------------------------------------------
const getProjectMember=async(username,projectId)=>{
  // knex returns an array even for single response so we have to destructure it
  const [projectMember] =  await knex.select('*').from('projectmembers').where({projectid:projectId,username});
  return projectMember;
}



//------------------------------------------------------------------------
// Add a user to the project  by providing 'username' and 'projectId'
//------------------------------------------------------------------------

const addProjectMember=async(username,projectId)=>{

    // transaction to insert user data if one of them is unsuccessful the db will revert back to original state
    const transactionResponse = await knex.transaction(
        async function(trx){
        const [projectMember]  = await trx('projectmembers').insert({projectid:projectId,username}).returning('*');// will return the saved data in array form
        console.log(projectMember)

        // will return the saved data in array form
        const [projectRole] = await trx('projectrole').insert({username,projectid:projectId}).returning('*');
        return {projectMember,projectRole}
    })
    return transactionResponse;

}


//-----------------------------------------------------------
// Update the projectRole of a project member in a project 
//-----------------------------------------------------------

const updateProjectRole=async(role,username,projectId)=>{
    const [projectRole] =  await knex('projectrole')
    .update({role})
    .where({username,projectid:projectId})
    .returning('*');
    return projectRole;
}





module.exports ={
    getProjectMember, addProjectMember, updateProjectRole
}; // exporting functions to use in our application as an object