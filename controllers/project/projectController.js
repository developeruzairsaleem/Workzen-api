const knex = require('../../config/dbConfig')
const bcrypt = require("bcrypt");


const projectController={
 
    async createProject(req,res,next){
        const{email, title, description} = req.body;
        const response = {};
        try {
            await knex.transaction(async (trx)=>{

               // Define and insert the data for 'projects' table in database
                const projectData = {email,title,description};
               const[registeredProject] = await trx('projects').insert(projectData).returning('*')
                const[author] = await trx.select('*').from('users').where({email})
               response.title =registeredProject.title;
               response.description= registeredProject.description;
               response.author =author.username;
               response.projectId = registeredProject.id;
               response.status = registeredProject.status;
               response.authorId = author.id;

               // Define and insert the data for 'projectrole' table in database
               const projectRoleData = {role:'project manager', projectid:registeredProject.id,email};
               const[registeredProjectRole] = await trx('projectrole').insert(projectRoleData).returning('*')
               response.authorRole= registeredProject.role;

               // Define and insert the data for 'projectmembers' table in database
               const projectMemberData = {projectid:registeredProjectRole.projectid,email}
               await trx('projectmembers').insert(projectMemberData).returning('*')

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