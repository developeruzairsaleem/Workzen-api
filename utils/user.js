const knex= require('../config/dbConfig'); // import the knex config where we have setup the db connection

//------------------------------------------------------------------------
// get the user by providing the userId in argument from db in 'users' tbl
//------------------------------------------------------------------------
const getUser=async(userid)=>{
  // knex returns an array even for single response so we have to destructure it
  const [user] =  await knex.select('*').from('users').where('id','=',userid);
  return user;
}



module.exports ={
    getUser,
}; // exporting functions to use in our application as an object