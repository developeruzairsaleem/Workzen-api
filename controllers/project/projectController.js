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
    //      ---------------projects schema--------------
    //projects       ----id-----email----------status--------title--------description-------
//projectmembers ----id-----projectid------email------
//projectrole    ----id-----role-----------projectid-----email
// tasks ---id----title-----description-----projectid------username--------assigned--------status-------start-----------deadline
// Get Project by ID:---------ONGOING
// GET /api/projects/:projectId

async getProjectById(req,res,next){

   const {projectId} = req.params;
   let response ={};
    // get the project first

    // {
    //     "title": "This is the title of usman project",
    //     "description": "This is the description of usman project",
    //     "author": "usman",
    //     "projectId": 4,
    //     "status": "pending",
    //     "authorId": 2248,
    //     "authorRole": "project manager"
    // }


    // get the project
    try {
       const [project] = await knex.select("projects.title","projects.description","projects.username","projects.id","projects.status","projectrole.role").from('projects').innerJoin('projectrole','projects.username','projectrole.username').where('projects.id','=',projectId)
       response=project;

       
    //   return res.status(200).json(project)
       
       
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({error:'project does not found!'})
    }
    
    
    
    // now get the members of the project
    
    try{
            const members = await knex.select('projectmembers.username as member_username','projectrole.role as member_role').from('projectmembers')
            .innerJoin('projectrole', function() {
                this.on('projectmembers.username', '=', 'projectrole.username')
                .andOn('projectmembers.projectid', '=', 'projectrole.projectid')
            })
            .where("projectmembers.projectid",'=',projectId)

        response.members = members;
    }
    catch(error){
        console.log(error);
        return res.status(500).json({error:"error getting members of project"})
    }
    
    
    // now its time to  work for the tasks
    try {
        const tasks  =  await knex.select('*').from('tasks').where({projectid:projectId})
        response.tasks = tasks;
        return res.status(200).json(response)
    } catch (error) {
    return res.status(500).json({error:"Error getting the tasks for the project"})        
    }  
}
,

async updateProject(req,res,next){


    return res.status(200).json({status:'success'})




}

}







module.exports = projectController;