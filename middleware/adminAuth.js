
const knex = require('../config/dbConfig')

const adminAuth =async(req,res,next)=>{

    if(req.user.role==='admin'){
        return next();
    }
    else{
        return res.status(403).json({error:'Forbidden: Admin access required'})
    }

}

module.exports = adminAuth;