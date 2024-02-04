

const memberAuth =async(req,res,next)=>{

    if(req.user.role==='admin'||req.user.role==='project manager'||req.user.role==="team member"){
        return next();
    }
        return res.status(403).json({error:'Forbidden: Authorized User Access Required'})

}

module.exports = memberAuth;