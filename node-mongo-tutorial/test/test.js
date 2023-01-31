import User from '../models/usersmodel.js';
import chai from 'chai';
import server from '../index.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import chaiHttp from 'chai-http';


const should = chai.should(); 
dotenv.config();
chai.should();
chai.use(chaiHttp);

describe('Database Testing... Waiting for Connection', function() {
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

      it('it should GET all the Users', (done) => {
        chai.request(server)
        .get('/users')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            // res.body.length.should.be.eql(0);
            done();
          });
      });

      it('it should POST a user to database', (done) => {
        var testUser = {
          username: 'Test User Created',
          email: 'Test@mail.com',
          password: '12345'
        };
        chai.request(server)
        .post('/users/signup').send(testUser)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('User created');
          res.body.createdUser.should.have.property('username');
          res.body.createdUser.should.have.property('email');
          res.body.createdUser.should.have.property('password');
          done();
        });
      });

      it('it should **NOT** POST a user to database due to Duplicate Emails', (done) => {
        var testUser = {
          username: 'Test',
          email: 'Test@mail.com',
          password: '12345'
        };
        chai.request(server)
        .post('/users/signup').send(testUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('User Already Exists');
          res.body.should.have.property('Error');
          done();
        });
      });

      it('it should DELETE a user from the given id', (done) => {
        let userdata = new User({ 
          username: 'Test User Created',
          email: 'TestCreate@mail.com',
          password: '12345'
        });
        userdata.save((err, data) => {
          chai.request(server)
          .get('/users/user/' + data._id)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql("User Fetched");
            done();
          });
        });
      })

      it('it should **NOT** GET a user from the given id', (done) => {
        chai.request(server)
        .get('/users/user/' + 3123)
        .end((err, res) => {
              res.should.have.status(400);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql("Invalid ID");
              res.body.should.have.property('Error');
          done();
        });
      });

      it('it should DELETE a user from the given id', (done) => {
        let userdata = new User({ 
          username: 'Test User Deleted',
          email: 'TestDelete@mail.com',
          password: '12345'
        });
        userdata.save((err, data) => {
          chai.request(server)
          .delete('/users/delete/' + data._id)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql("User Deleted");
                // res.body.data.should.have.property('username');
                // res.body.data.should.have.property('email');
                // res.body.data.should.have.property('password');
                // res.body.should.have.property('_id').eql(data._id);
            done();
          });
        });
      })

      it('it should **NOT** DELETE a user, returns an error', (done) => {
        
        chai.request(server)
        .delete('/users/delete/' + "32345sq1355")
        .end((err, res) => {
              res.should.have.status(400);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql("User Not Deleted");
              // res.body.data.should.have.property('username');
              // res.body.data.should.have.property('email');
              // res.body.data.should.have.property('password');
              // res.body.should.have.property('_id').eql(data._id);
          done();
        });
      })
    })

    after(function (done) {
      User.collection.drop(function() {
        mongoose.connection.close(done);
      });
    })
});

