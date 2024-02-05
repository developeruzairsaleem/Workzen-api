const knex = require('../../config/dbConfig')
const { saveProjectToDB, saveProjectRole, getUserForProject, saveProjectMember } = require('../../services/projectService');
const { createResponseObjectCreateProject } = require('../../utils/responseUtils');


const projectController={
    // POST /api/projects
    // CREATE A NEW PROJECT 
    async createProject(req, res, next){
        const{title, description} = req.body;
        try {
          const response =  await knex.transaction( async (trx)=>{

               // Define and insert the project data in database
               const[author]                =    await getUserForProject(req.user.userid,trx);
               const[registeredProject]     =    await saveProjectToDB(author.username,title,description,trx,author.email);
               const[registeredProjectRole] =    await saveProjectRole(registeredProject.id,author.username,trx);
               await saveProjectMember(registeredProjectRole.projectid,author.username,trx);
               return  createResponseObjectCreateProject(registeredProject,registeredProjectRole,author);

            });

            res.status(201).json(response);
        }
        catch (error) {
            console.error(error)
            res.status(400).json({error:'Error registering project'})
        }
    }

    ,




    // GET /api/projects
    // GET ALL THE PROJECTS (FOR THE PROJECTS PAGE)

    async getAllProjects(req,res,next){

        try {

            // getting all the projects along with their users(who created the project with their roles)
          const response = await knex.select('projects.username','projects.title','projects.description','projects.status','projects.id','userrole.role').from('projects').innerJoin('userrole','projects.email','userrole.email')


          // sending the response back to the client
          return res.status(200).json({response})
        } catch (error) {
            console.log(error);
            res.status(400).json({error:'unable to get the projects'})
        }

    },
}
//      ---------------projects schema--------------
//projects       ----id-----email----------status--------title--------description-------
//projectmembers ----id-----projectid------email------
//projectrole    ----id-----role-----------projectid-----email











module.exports = projectController;