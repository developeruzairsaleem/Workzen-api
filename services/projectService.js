
const knex = require('../config/dbConfig')

const saveProjectToDB=(email,title,description,trx)=>{
   return trx('projects').insert({email,title,description}).returning('*')

}

const saveProjectRole=(projectid,email,trx)=>{
    return trx('projectrole').insert({
        role:'project manager',email:email,projectid:projectid
    }).returning('*')
}


const getUserForProject=(email,trx)=>{
    return trx.select('*').from('users').where({email})
}

const saveProjectMember=(projectid,email,trx)=>{
   return trx('projectmembers').insert({projectid,email}).returning('*')
}
module.exports ={
    saveProjectToDB, saveProjectRole, getUserForProject, getUserForProject, saveProjectMember
}