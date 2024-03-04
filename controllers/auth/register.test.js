const request = require("supertest");
const app = require('../../server');
const bcrypt = require('bcrypt')
const knex = require('../../config/dbConfig')

const cleanUpDatabase=async(email)=>{
    try {
        await knex('userrole').where({email}).del();
        await knex('login').where({email}).del();
        await knex('users').where({email}).del();
      } catch (error) {
        console.error('Error cleaning up the database:', error);
      }
}


describe('Testing POST on /api/register',()=>{



  
    // testing data with invalid password
    test('It should respond with 400 Bad Request with invalid email',async()=>{
    
            const response =  await request(app)
            .post('/api/register')
            .send({
              username:'usman',
              email:'usmangmail.com',
              password:'thisispass'
            })
            .expect( 'Content-Type', /json/)
            .expect(400)
            expect(response.body).toMatchObject({error:"invalid"})
        
    })




    // testing data with invalid password
    test('It should respond with 400 Bad Request with invalid password',async()=>{
    
            const response =  await request(app)
            .post('/api/register')
            .send({
              username:'usman',
              email:'usman@gmail.com',
              password:'this'
            })
            .expect( 'Content-Type', /json/)
            .expect(400)
            expect(response.body).toMatchObject({error:"invalid"})
        
    })




    // testing data with invalid username
    test('It should respond with 400 Bad Request with invalid username',async()=>{
    
            const response =  await request(app)
            .post('/api/register')
            .send({
              username:'usm',
              email:'usman@gmail.com',
              password:'thisispass'
            })
            .expect( 'Content-Type', /json/)
            .expect(400)
            expect(response.body).toMatchObject({error:"invalid"})
        
    })






    // testing data without password
    test('It should respond with 400 Bad Request without password',async()=>{
    
            const response =  await request(app)
            .post('/api/register')
            .send({
              username:'usman',
              email:'usman@gmail.com'
            })
            .expect( 'Content-Type', /json/)
            .expect(400)
            expect(response.body).toMatchObject({error:"invalid"})
        
    })





    // testing data without username
    test('It should respond with 400 Bad Request without email',async()=>{
    
            const response =  await request(app)
            .post('/api/register')
            .send({
              username:'usman',
              password:'thisispass'
            })
            .expect( 'Content-Type', /json/)
            .expect(400)
            expect(response.body).toMatchObject({error:"invalid"})
        
    })






    // testing data without username
    test('It should respond with 400 Bad Request without username',async()=>{
    
            const response =  await request(app)
            .post('/api/register')
            .send({
              email:'usman@gmail.com',
              password:'thisispass'
            })
            .expect( 'Content-Type', /json/)
            .expect(400)
            expect(response.body).toMatchObject({error:"invalid"})
        
    })






    //testing valid data
    test('It should respond with 201 Created',async()=>{
    
        const response =  await request(app)
        .post('/api/register')
        .send({
          username:'usman',
          email:'usman@gmail.com',
          password:'thisispass'
        })
        .expect( 'Content-Type', /json/)
        .expect(201)
        expect(response.body).toMatchObject({
              username:'usman',
              email:'usman@gmail.com',
              role:'team member'
        })
      const [resp] =  await knex.select('*').from('users').where({email:'usman@gmail.com'})
      expect(resp.email).toBe('usman@gmail.com')
      const [resp2] =  await knex.select('*').from('userrole').where({email:'usman@gmail.com'})
      expect(resp2.role).toBe('team member')
      const [resp3] =  await knex.select('*').from('login').where({email:'usman@gmail.com'})
      const isCorrect = bcrypt.compareSync('thisispass',resp3.hash)
      expect(isCorrect).toBe(true);
    
})





    //testing if username exist in database
    test('It should respond with 400 Bad Request username already exist',async()=>{
    
        const response =  await request(app)
        .post('/api/register')
        .send({
          username:'uzairkhan',
          email:'usman@gmail.com',
          password:'thisispass'
        })
        .expect( 'Content-Type', /json/)
        .expect(400)
        expect(response.body).toMatchObject({
          error:'user not created'
        })
    
})




    //testing if email exist in database
    test('It should respond with 400 Bad Request email already exist',async()=>{
    
        const response =  await request(app)
        .post('/api/register')
        .send({
          username:'uzairkhan',
          email:'uzairsaleemdev@gmail.com',
          password:'thisispass'
        })
        .expect( 'Content-Type', /json/)
        .expect(400)
        expect(response.body).toMatchObject({
          error:'user not created'
        })
    
})



    //testing if data is stored in the database
    test('It should respond with 400 Bad Request email already exist',async()=>{
    
        const response =  await request(app)
        .post('/api/register')
        .send({
          username:'uzairkhan',
          email:'uzairsaleemdev@gmail.com',
          password:'thisispass'
        })
        .expect( 'Content-Type', /json/)
        .expect(400)
        expect(response.body).toMatchObject({
          error:'user not created'
        })
    
})



    afterEach(async () => {
        // Cleanup database after each test
        await cleanUpDatabase('usman@gmail.com');
    });



    afterAll(async () => {
      // Cleanup tasks after all tests have run
      await knex.destroy(); // Close the database connection
  });

})