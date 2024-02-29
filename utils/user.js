const knex= require('../config/dbConfig')


//--------------------------------------------------------
// get the user by providing the userId in argument from db
//--------------------------------------------------------
const getUser=async(userid)=>{
  const [user] =  await knex.select('*').from('users').where('id','=',userid)
    return user;
}


module.exports ={
    getUser,
}