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
            res.should.have.status(401);
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

      it('it should **CREATE** **GET** **UPDATE** **DELETE** a message and get and delete', (done) => {

        chai.request(server)
        .post('/users/login')
        .set('content-type', 'application/json')
        .send(testUserLogin)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('token')
          const token = res.body.token
  
           chai.request(server)
          .post('/messages/send')
          .set('content-type', 'application/json')
          .send({ email: "hello@mail.com", name: "testing", message: "messages" })
          .set({ "Authorization": `Bearer ${token}` })
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
            if (err) { console.log(err) }
            const msg = res.body.MessageSent._id
  
            chai.request(server)
              .get(`/messages/msg/${msg}`)
              .set({ "Authorization": `Bearer ${token}` })
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
              });
            chai.request(server)
              .get('/messages')
              .set({ "Authorization": `Bearer ${token}` })
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
              });
          
            chai.request(server)
            .delete(`/messages/delete/${msg}`)
            .set({ "Authorization": `Bearer ${token}` })
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              if (err) { console.log(err) }
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
        res.body.should.have.property('token')
        const token = res.body.token
         chai.request(server)
        .post('/blogs/create')
        .set('content-type', 'application/json')
        .set({ "Authorization": `Bearer ${token}` })
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
            })
          chai.request(server)
          .put(`/blogs/b/${blog}/like`)
          .set({ "Authorization": `Bearer ${token}` })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            chai.request(server)
            .put(`/blogs/b/${blog}/like`)
            .set({ "Authorization": `Bearer ${token}` })
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
            });
          });
          chai.request(server)
          .post(`/blogs/b/${blog}/c`)
          .set({ "Authorization": `Bearer ${token}` })
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
          .set({ "Authorization": `Bearer ${token}` })
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
            .set({ "Authorization": `Bearer ${token}` })
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

      it('it should **UPDATE** USERNAME **READ** **DELETE** a user ', (done) => {

        chai.request(server)
          .post('/users/login')
          .set('content-type', 'application/json')
          .send(testUserLogin)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('token')
            const token = res.body.token
            
            chai.request(server).post('/users/signup')
            .set('content-type', 'application/json')
            .send(testUserSignup)
            .end((err, res) => {
  
              const user = res.body.UserCreated._id
              res.should.have.status(201);
              res.body.should.be.a('object');
              const newuser = {
                email: res.body.UserCreated.email,
                password: "Qwert@12345"
              }
              chai.request(server)
              .post('/users/login')
              .set('content-type', 'application/json')
              .send(newuser)
              .end( async(err, res) => {
                const token2 = res.body.token
                await chai.request(server)
                .put('/users/edit/username')
                .send({ username: "usernameupdated" })
                .set({ "Authorization": `Bearer ${token2}` })
                .then((res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                });

                chai.request(server)
                .get('/users')
                .set({ "Authorization": `Bearer ${token2}` })
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                });
              })
              
              chai.request(server)
              .delete('/users/delete/' + user)
              .set({ "Authorization": `Bearer ${token}` })
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql("User Deleted");
                done();
              });
            })
  
          });
  
      })
      it('it should **UPDATE** PROFILE PIC **READ** **DELETE** a user ', (done) => {

          chai.request(server)
            .post('/users/login')
            .set('content-type', 'application/json')
            .send(testUserLogin)
            .end( async (err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('token')
              const token = res.body.token
              
              await chai.request(server).post('/users/signup')
              .set('content-type', 'application/json')
              .send(testUserSignup)
              .then(async (res) => {
    
                const user = res.body.UserCreated._id
                res.should.have.status(201);
                res.body.should.be.a('object');
                const newuser = {
                  email: res.body.UserCreated.email,
                  password: "Qwert@12345"
                }
                chai.request(server)
                .post('/users/login')
                .set('content-type', 'application/json')
                .send(newuser)
                .then( async(res) => {
                  const token2 = res.body.token
                  await chai.request(server)
                  .put('/users/edit/profilepic')
                  .attach('profile_pic',
                  fs.readFileSync(path.join(__dirname, '../assets/test_image.jpg')),
                  'test_image.jpg')
                  .set({ "Authorization": `Bearer ${token2}` })
                  .then((res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                  });
                })

                await chai.request(server)
                .delete('/users/delete/' + user)
                .set({ "Authorization": `Bearer ${token}` })
                .then((res) => {
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
          res.body.should.have.property('token')
          const token = res.body.token
          
          chai.request(server).post('/users/signup')
          .set('content-type', 'application/json')
          .send(testUserSignup)
          .end((err, res) => {

            const user = res.body.UserCreated._id
            res.should.have.status(201);
            res.body.should.be.a('object');
            const newuser = {
              email: res.body.UserCreated.email,
              password: "Qwert@12345"
            }
            chai.request(server)
            .post('/users/login')
            .set('content-type', 'application/json')
            .send(newuser)
            .end( async(err, res) => {
              const token2 = res.body.token
              await chai.request(server)
              .put('/users/edit/password')
              .send({ password: "Qwerty@12345" })
              .set({ "Authorization": `Bearer ${token2}` })
              .then((res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
              });
            })

            chai.request(server)
            .delete('/users/delete/' + user)
            .set({ "Authorization": `Bearer ${token}` })
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('message').eql("User Deleted");
            });

            chai.request(server)
            .delete('/users/delete/3294324')
            .set({ "Authorization": `Bearer ${token}` })
            .end((err, res) => {
                  res.should.have.status(404);
                  res.body.should.be.a('object');
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
          res.should.have.status(406);
        })

        chai.request(server)
        .post('/users/login')
        .set('content-type', 'application/json')
        .send({ email: "admin105@mail.com", password: "WrongP@12345" })
        .end((err, res) => {
          res.should.have.status(406);
          done()
        })

      })
      it('it should **Test** for errors', (done) => {

        chai.request(server)
        .post('/users/login')
        .set('content-type', 'application/json')
        .send(testUserLogin)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('token')
          const token = res.body.token
  
           chai.request(server)
          .post('/messages/send')
          .set('content-type', 'application/json')
          .send({ email: "hello@mail.com", name: "testing", message: "messages" })
          .set({ "Authorization": `Bearer ${token}` })
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a('object');
            if (err) { console.log(err) }
            const msg = res.body.MessageSent._id
  
            chai.request(server)
              .get(`/messages/msg/313456`)
              .set({ "Authorization": `Bearer ${token}` })
              .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
              });
            chai.request(server)
              .get('/messages')
              .set({ "Authorization": `Bearer ${token}` })
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
              });
          
            chai.request(server)
            .delete(`/messages/delete/3245`)
            .set({ "Authorization": `Bearer ${token}` })
            .end((err, res) => {
              res.should.have.status(400);
              res.body.should.be.a('object');
              if (err) { console.log(err) }
              done()
            });
  
          });
        });
  
      })

      it('it should create ADMIN user ', (done) => {

        chai.request(server)
          .post('/users/login')
          .set('content-type', 'application/json')
          .send(testUserLogin)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('token')
            const token = res.body.token
            
            chai.request(server).post('/users/signup-admin')
            .set('content-type', 'application/json')
            .send(testUserSignup)
            .end((err, res) => {
              chai.request(server)
              .delete('/users/delete/' + res.body.AdminUserCreated._id )
              .set({ "Authorization": `Bearer ${token}` })
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql("User Deleted");
                done();
              });
            })
  
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
          res.body.should.have.property('token')
          const token = res.body.token
          chai.request(server)

          chai.request(server)
            .get(`/blogs/b/23457`)
            .end((err, res) => {
              res.should.have.status(404);
              res.body.should.be.a('object');
            });

          chai.request(server)
            .get('/blogs')
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
            })


          chai.request(server)
          .put(`/blogs/edit/423456`)
          .set('content-type', 'application/json')
          .set({ "Authorization": `Bearer ${token}` })
          .field('title', 'Admin can Post Blog Updated')
          .field('content', 'Blog Post Updated')
          .attach('blogImage',
          fs.readFileSync(path.join(__dirname, '../assets/test_image.jpg')),
          'test_image.jpg')
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a('object');
            if (err) { console.log(err) }
          });

          chai.request(server)
          .put(`/blogs/edit/63eb9dbbc28c96f9ac0e9e71`)
          .set('content-type', 'application/json')
          .set({ "Authorization": `Bearer ${token}` })
          .field('title', 'Admin can Post Blog Updated')
          .field('content', 'Blog Post Updated')
          .attach('blogImage',
          fs.readFileSync(path.join(__dirname, '../assets/test_image.jpg')),
          'test_image.jpg')
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a('object');
            if (err) { console.log(err) }
            done()
          });

          chai.request(server)
          .delete(`/blogs/delete/63eb9dbbc28c96f9ac0e9e71`)
          .set({ "Authorization": `Bearer ${token}` })
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a('object');
            if (err) { console.log(err) }
            done()
          });
        });
  
        })
      

    })




});

