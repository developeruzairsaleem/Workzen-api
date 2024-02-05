
const saveProjectToDB=(username,title,description,trx,email)=>{
   return trx('projects').insert({username,title,description,email}).returning('*')

}

const saveProjectRole=(projectid,username,trx)=>{
    return trx('projectrole').insert({
        role:'project manager',username,projectid
    }).returning('*')
}


const getUserForProject=(id,trx)=>{
    return trx.select('*').from('users').where({id})
}

const saveProjectMember=(projectid,username,trx)=>{
   return trx('projectmembers').insert({projectid,username}).returning('*')
}



module.exports ={
    saveProjectToDB, saveProjectRole, getUserForProject, getUserForProject, saveProjectMember
}