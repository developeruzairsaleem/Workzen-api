const request = require("supertest");
const app = require('../../server');
const bcrypt = require('bcrypt')
const knex = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'test',
      database : 'workzen'
    }
  });


describe('Testing post on /api/projects', () => {
  
    
           // testing data with invalid password
           test('It should respond with 200 Success with correct data', async()=>{
            const response =  await request(app)
            .post('/api/login')
            .send({
              email:'uzairsaleemdev@gmail.com',
              password:'thisispass'
            })
            .expect( 'Content-Type', /json/)
            .expect(200)
            expect(response.body).toMatchObject({
            username:'uzairkhan',
            email:'uzairsaleemdev@gmail.com',
            role:'team member'
          })
    })




    // testing data with invalid password
    test('It should respond with 400 Bad Request with invalid password',async()=>{
            const response =  await request(app)
            .post('/api/login')
            .send({
              email:'uzairsaleemdev@gmail.com',
              password:'ubumusal'
            })
            .expect( 'Content-Type', /json/)
            .expect(400)
            expect(response.body).toMatchObject({error:"invalid credentials"})
        
    })





    // testing data with invalid email
    test('It should respond with 400 Bad Request with invalid email',async()=>{

            const response =  await request(app)
            .post('/api/login')
            .send({
              email:'umer@gmail.com',
              password:'thisispass'
            })
            .expect( 'Content-Type', /json/)
            .expect(400)
            expect(response.body).toMatchObject({error:"invalid credentials"})
        
    })




    // testing data without password
    test('It should respond with 400 Bad Request without password',async()=>{

            const response =  await request(app)
            .post('/api/login')
            .send({
              email:'uzairsaleemdev@gmail.com'
            })
            .expect( 'Content-Type', /json/)
            .expect(400)
            expect(response.body).toMatchObject({error:"invalid"})
        
    })



    
    // testing data without email
    test('It should respond with 400 Bad Request without email',async()=>{

            const response =  await request(app)
            .post('/api/login')
            .send({
              password:'thisispass'
            })
            .expect( 'Content-Type', /json/)
            .expect(400)
            expect(response.body).toMatchObject({error:"invalid"})
        
    })


    //testing valid data
    test('It should respond with 200 Success',async()=>{

        const response =  await request(app)
        .post('/api/login')
        .send({
          username:'uzairsalim',
          email:'uzairsalim58@gmail.com',
          password:'abumusalA1!'
        })
        .expect( 'Content-Type', /json/)
        .expect(200)
        expect(response.body).toMatchObject({
              email:'uzairsalim58@gmail.com',
              username:'uzairsalim',
              role:'team member'
        })

      const [resp3] =  await knex.select('*').from('login').where({email:'uzairsalim58@gmail.com'})
      const isCorrect = bcrypt.compareSync('abumusalA1!',resp3.hash);
      expect(isCorrect).toBe(true);

    })


  afterAll(async () => {
    // Cleanup tasks after all tests have run
    await knex.destroy(); // Close the database connection
  }); 




})
