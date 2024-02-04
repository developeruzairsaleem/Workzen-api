const jwt = require('jsonwebtoken')
const auth =(req,res,next)=>{
   const header = req.headers['Authorization'];
   if (typeof header!=='undefined'){
   const token = header.split(' ')[1];

   }

}