
const knex = require('../config/dbConfig')

const adminAuth =async(req,res,next)=>{

    const{email} = req.body;
   const [response] = await knex.select('*').from('userrole').where({email});

    if(response.role==='admin'){
        return next();
    }
    else{
        return res.status(403).json({error:'Forbidden: Admin access required'})
    }

}

module.exports = adminAuth;