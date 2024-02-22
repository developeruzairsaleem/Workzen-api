const express = require("express");
const router = express.Router();
const authController = require('../controllers/auth/authController')
const projectController = require('../controllers/project/projectController');
const managerAuth = require("../middleware/managerAuth");
const auth = require('../middleware/auth');
const taskController = require("../controllers/tasks/taskController");
const isCurrentManager = require("../middleware/isCurrentManager");
//testing the server so everyting's working
router.get('/testing',(req,res)=>{
    res.json('Just testing it!');
});

// authentication routes

router.post('/api/register',authController.register);
router.post('/api/login',authController.login);
router.post('/api/logout',auth,authController.logout);

// project routes

router.post('/api/projects',auth, managerAuth, projectController.createProject);
router.get('/api/projects/',auth, projectController.getAllProjects);
router.get('/api/projects/:projectId',auth, projectController.getProjectById);
router.put('/api/projects/:projectId',auth,isCurrentManager, projectController.updateProject);
router.delete('/api/projects/:projectId',auth,isCurrentManager, projectController.deleteProject);
// task routes
router.post('/api/projects/:projectId/tasks',auth,taskController.createTask)
router.get('/api/projects/:projectId/tasks',auth,taskController.getAllTasksForProject)
router.get('/api/projects/:projectId/tasks/:taskId',auth,taskController.getTaskById)
router.put('/api/projects/:projectId/tasks/:taskId',auth,taskController.updateTask)
router.delete('/api/projects/:projectId/tasks/:taskId',auth,taskController.deleteTask)
module.exports = router;


/*
Authentication Routes:

Token Refresh 
PUT /api/refresh 

User Logout
POST /api/logout



User Registration:----------DONE
POST /api/register


User Login:  --------------DONE
POST /api/login




project routes

Create Project:----------DONE
POST /api/projects


Get All Projects:--------DONE
GET /api/projects


Get Project by ID:---------DONE
GET /api/projects/:projectId


Update Project:
PUT /api/projects/:projectId----------------DONE 


Delete Project:
DELETE /api/projects/:projectId-------------DONE


Task Routes:


Create Task:
POST /api/projects/:projectId/tasks------ DONE


Get All Tasks for a Project:
GET /api/projects/:projectId/tasks ---------DONE


Get Task by ID:
GET /api/projects/:projectId/tasks/:taskId-----------------DONE


Update Task:
PUT /api/projects/:projectId/tasks/:taskId--------------DONE


Delete Task:
DELETE /api/projects/:projectId/tasks/:taskId

User Roles Routes:


Assign User to Project:
POST /api/projects/:projectId/users/:userId



Remove User from Project:
DELETE /api/projects/:projectId/users/:userId


Update User Role in Project:
PUT /api/projects/:projectId/users/:userId/role



Miscellaneous Routes:


Get User Profile:
GET /api/users/:userId


Update User Profile:
PUT /api/users/:userId


Change Password:
PUT /api/users/:userId/change-password


Forgot Password (if needed):
POST /api/forgot-password


Reset Password (if needed):
POST /api/reset-password
*/
