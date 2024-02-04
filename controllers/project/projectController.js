const knex = require('../../config/dbConfig')
const bcrypt = require("bcrypt");
const { saveProjectToDB, saveProjectRole, getUserForProject, saveProjectMember } = require('../../services/projectService');
const { createResponseObjectCreateProject } = require('../../utils/responseUtils');


const projectController={
 
    async createProject(req, res, next){
        const{email, title, description} = req.body;
        try {
          const response =  await knex.transaction( async (trx)=>{

               // Define and insert the project data in database
               const[registeredProject]     =    await saveProjectToDB(email,title,description,trx);
               const[registeredProjectRole] =    await saveProjectRole(registeredProject.id,email,trx);
               const[author]                =    await getUserForProject(email,trx);
               await saveProjectMember(registeredProjectRole.projectid,email,trx);
               return  createResponseObjectCreateProject(registeredProject,registeredProjectRole,author)

            });

            res.status(201).json(response);
        }
        catch (error) {
            console.error(error)
            res.status(400).json({error:'Error registering project'})
        }
    }

}
//      ---------------projects schema--------------
//projects       ----id-----email----------status--------title--------description-------
//projectmembers ----id-----projectid------email------
//projectrole    ----id-----role-----------projectid-----email





module.exports = projectController;