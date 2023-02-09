import User from '../models/usersmodel.js';
import chai from 'chai';
import server from '../../index.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import chaiHttp from 'chai-http';
import cookieParser from 'cookie-parser';
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();


chai.should();
chai.use(chaiHttp);
chai.use(cookieParser)


describe('Database Testing... Waiting for Connection', function() {
    var testUserSignup = {
        username: "admin103",
        email: "admin103@mail.com",
        password: "Qwert@12345"
      };
      var testUserLogin = {
        email: "admin105@mail.com",
        password: "Qwert@12345"
      };

    console.log(__dirname)
    before(function (done) {
      mongoose.connect(process.env.MONGO_URI);
      const db = mongoose.connection;
      db.on('error', console.error.bind(console, 'connection error'));
      db.once('open', function() {
      console.log('We are connected to test database!');
        done();
      });
    });

    describe('Testing User Routes ',function () {

      it('it should *NOT** GET all the Users Not logged In', (done) => {
        chai.request(server)
        .get('/users')
        .end((err, res) => {
            res.should.have.status(406);
            res.body.should.be.a('object');
            done();
          });
      });
      
      it('it should **Not** POST a user to database *SignUp* due to bad email format ', (done) => {
        const number = Math.floor(Math.random() * 100 )
        var testUser = {
          username: `Test User${number} Created`,
          email: `Test${number}@mailcom`,
          password: 'Qwerty@'
        };
        chai.request(server)
        .post('/users/signup').send(testUser)
        .end((err, res) => {
          res.should.have.status(406);
          res.body.should.be.a('object');
          res.body.should.have.property('Error')
          done();
        });
      });
      it('it should **Not** POST a user to database *SignUp* due to short username ', (done) => {
        const number = Math.floor(Math.random() * 100 )
        var testUser = {
          username: `${number}`,
          email: `Test${number}@mail.com`,
          password: 'Qwerty@'
        };
        chai.request(server)
        .post('/users/signup').send(testUser)
        .end((err, res) => {
          res.should.have.status(406);
          res.body.should.be.a('object');
          res.body.should.have.property('Error')
          done();
        });
      });
      it('it should **Not** POST a user to database *SignUp* due to wrong password ', (done) => {
        const number = Math.floor(Math.random() * 100 )
        var testUser = {
          username: `Test User${number} Created`,
          email: `Test${number}@mail.com`,
          password: 'Qwerty@'
        };
        chai.request(server)
        .post('/users/signup').send(testUser)
        .end((err, res) => {
          res.should.have.status(406);
          res.body.should.be.a('object');
          res.body.should.have.property('Error').eql('Password must have 8 characters, Uppercase and Lowercase, a number and a Symbol');
          done();
        });
      });


      it('it should **Not** Login a user due to wrong missing fields ', (done) => {
        var testUser = {
          password: 'Qwerty@12345'
        };
        chai.request(server)
        .post('/users/login').send(testUser)
        .end((err, res) => {
          res.should.have.status(406);
          res.body.should.be.a('object');
          res.body.should.have.property('Error').eql('Email is required ');
          done();
        });
      });
      it('it should **Send** **GET**  **DELETE** a message and get and delete', (done) => {

        chai.request(server)
        .post('/users/login')
        .set('content-type', 'application/json')
        .send(testUserLogin)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Logged In');
          res.body.should.have.property('LoggedInAs');
          const cookie = res.header['set-cookie']
          const message = {
                name: "message test",
                email: "message@mail.com",
                message: "Hello 202"
            }
          chai.request(server)
          .post('/messages/send').send(message)
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Message Sent');
            res.body.should.have.property('MessageSent')
            const msg = res.body.MessageSent._id

            chai.request(server)
            .get('/messages/msg/63d7d81e2db5ec234d9485a8').set('Cookie', cookie)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              });

            chai.request(server)
            .get('/messages').set('Cookie', cookie)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              });

            chai.request(server)
            .delete(`/messages/delete/${msg}`).set('Cookie', cookie)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              done()
              });

          });
        });

      })
      it('it should **CREATE** **GET** **UPDATE** **DELETE** a blog and get and delete', (done) => {

      chai.request(server)
      .post('/users/login')
      .set('content-type', 'application/json')
      .send(testUserLogin)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Logged In');
        res.body.should.have.property('LoggedInAs');
        const cookie = res.header['set-cookie']

         chai.request(server)
        .post('/blogs/create')
        .set('content-type', 'application/json')
        .set('Cookie', cookie)
        .field('title', 'Admin can Post Blog')
        .field('content', 'Blog Post')
        .attach('blogImage',
        fs.readFileSync(path.join(__dirname, '../assets/test_image.jpg')),
        'test_image.jpg')
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          if (err) { console.log(err) }
          const blog = res.body.BlogCreated._id

          chai.request(server)
            .get(`/blogs/b/${blog}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
            });
          chai.request(server)
            .get('/blogs')
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
            });

          chai.request(server)
          .put(`/blogs/b/${blog}/like`)
          .set('Cookie', cookie)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');

            chai.request(server)
            .put(`/blogs/b/${blog}/like`)
            .set('Cookie', cookie)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
            });
          });

          chai.request(server)
          .post(`/blogs/b/${blog}/c`)
          .set('Cookie', cookie)
          .send({ comment: "My First Comment" })
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
          })

          chai.request(server)
          .get(`/blogs/b/${blog}/c`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
          })


          chai.request(server)
          .put(`/blogs/edit/${blog}`)
          .set('content-type', 'application/json')
          .set('Cookie', cookie)
          .field('title', 'Admin can Post Blog Updated')
          .field('content', 'Blog Post Updated')
          .attach('blogImage',
          fs.readFileSync(path.join(__dirname, '../assets/test_image.jpg')),
          'test_image.jpg')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            if (err) { console.log(err) }
            
            chai.request(server)
            .delete(`/blogs/delete/${blog}`)
            .set('Cookie', cookie)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              if (err) { console.log(err) }
              done()
            });

          });

        });
      });

      })
      it('it should **CREATE** **UPDATE** USERNAME **READ** **DELETE** a user ', (done) => {

      chai.request(server)
        .post('/users/login')
        .set('content-type', 'application/json')
        .send(testUserLogin)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Logged In');
          res.body.should.have.property('LoggedInAs');
          const cookie = res.header['set-cookie']
          

          chai.request(server).post('/users/signup')
          .set('content-type', 'application/json')
          .send(testUserSignup)
          .end((err, res) => {

            const user = res.body.UserCreated._id
            const cookie2 = res.header['set-cookie']
            res.should.have.status(201);
            res.body.should.be.a('object');

            chai.request(server)
            .get(`/users/u/${user}`)
            .end(( err, res ) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
            })

            chai.request(server)
            .get('/users')
            .set('Cookie', cookie)
            .end(( err, res ) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
            })

            chai.request(server)
            .put('/users/edit/username')
            .send({ username: "admin105 updated" })
            .set('Cookie', cookie2)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
            });

            chai.request(server)
            .delete('/users/delete/' + user)
            .set('Cookie', cookie)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('message').eql("User Deleted");
              done();
            });
          })

        });

      })
      it('it should  **UPDATE** PROFILE PICTURE **READ** **DELETE** a user ', (done) => {

      chai.request(server)
        .post('/users/login')
        .set('content-type', 'application/json')
        .send(testUserLogin)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Logged In');
          res.body.should.have.property('LoggedInAs');
          const cookie = res.header['set-cookie']
          

          chai.request(server).post('/users/signup-admin')
          .set('content-type', 'application/json')
          .send(testUserSignup)
          .end(async (err, res) => {

            const user = res.body.UserCreated._id
            const cookie2 = res.header['set-cookie']
            res.should.have.status(201);
            res.body.should.be.a('object');

            await chai.request(server).put('/users/edit/profilepic')
            .set('Cookie', cookie2)
            .attach('profile_pic',
            fs.readFileSync(path.join(__dirname, '../assets/test_image.jpg')),
            'test_image.jpg')
            .then((res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              done()
            })

            chai.request(server)
            .delete('/users/delete/' + user)
            .set('Cookie', cookie)
            .then((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('message').eql("User Deleted");
              done();
            });
          })

        });

      })
      it('it should **UPDATE** PASSWORD **READ** **DELETE** a user ', (done) => {

      chai.request(server)
        .post('/users/login')
        .set('content-type', 'application/json')
        .send(testUserLogin)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Logged In');
          res.body.should.have.property('LoggedInAs');
          const cookie = res.header['set-cookie']
          

          chai.request(server).post('/users/signup')
          .set('content-type', 'application/json')
          .send(testUserSignup)
          .end((err, res) => {

            const user = res.body.UserCreated._id
            const cookie2 = res.header['set-cookie']
            res.should.have.status(201);
            res.body.should.be.a('object');
          

            chai.request(server)
            .put('/users/edit/password')
            .send({ password: "Qwerty@12345" })
            .set('Cookie', cookie2)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
            });

            chai.request(server)
            .delete('/users/delete/' + user)
            .set('Cookie', cookie)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('message').eql("User Deleted");
              done();
            });
          })

        });

      })
      it('it should **NOT** get **Comments**', (done) => {
        chai.request(server)
        .get('/blogs/b/29102338400/c')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('Error')
          done();
        });
      })
      it('it should **NOT** POST an Admin user to database *SignUpAdmin* duplicate admins ', (done) => {
        chai.request(server)
        .post('/users/signup-admin').send({ username: "admin105", email: "admin105@mail.com", password: "Qwerty@12345" })
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.a('object');
          done();
        });
      });   
      it('it should login and logout safely', (done) => {
        chai.request(server)
        .post('/users/login')
        .set('content-type', 'application/json')
        .send(testUserLogin)
        .end((err, res) => {
          res.should.have.status(200);
          chai.request(server)
          .get('/users/logout')
          .end((err,res) => {
            res.should.have.status(200);
            done()
          })
        })
      }) 
      it('it should login With Errors', (done) => {
        chai.request(server)
        .post('/users/login')
        .set('content-type', 'application/json')
        .send({ email: "eddy@mail.com", password: "WrongP@12345" })
        .end((err, res) => {
          res.should.have.status(401);
        })

        chai.request(server)
        .post('/users/login')
        .set('content-type', 'application/json')
        .send({ email: "admin105@mail.com", password: "WrongP@12345" })
        .end((err, res) => {
          res.should.have.status(401);
          done()
        })

      }) 
      it('it should try to get users but no admin privileges', (done) => {
        chai.request(server)
        .get('/users')
        .end((err, res) => {
          res.should.have.status(406);
          done()
        })
      }) 

    })




});

