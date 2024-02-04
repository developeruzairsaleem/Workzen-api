const express = require("express");
const router = express.Router();
const authController = require('../controllers/auth/authController')
const projectController = require('../controllers/project/projectController');
const managerAuth = require("../middleware/managerAuth");
const auth = require('../middleware/auth')
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
module.exports = router;


/*
Authentication Routes:

User Registration:----------DONE
POST /api/register


User Login:  --------------DONE
POST /api/login


User Logout:
POST /api/logout




Project Routes:

Create Project:----------ONGOING
POST /api/projects


Get All Projects:
GET /api/projects


Get Project by ID:
GET /api/projects/:projectId


Update Project:
PUT /api/projects/:projectId


Delete Project:
DELETE /api/projects/:projectId


Task Routes:


Create Task:
POST /api/projects/:projectId/tasks


Get All Tasks for a Project:
GET /api/projects/:projectId/tasks


Get Task by ID:
GET /api/projects/:projectId/tasks/:taskId


Update Task:
PUT /api/projects/:projectId/tasks/:taskId


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
