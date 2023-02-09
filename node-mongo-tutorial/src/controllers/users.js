import User from '../models/usersmodel.js';
import bcrypt from 'jsonwebtoken';
import pkg from 'bcryptjs';
import dotenv from 'dotenv';
import { deleteImage, uploadImage } from '../utils/cloudinary.js';
import { Strategy as PassportLocalStrategy } from 'passport-local';
import passport from 'passport';

const { hash, compare } = pkg;
const { sign } = bcrypt;


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const createUser =  ( async (req, res) => {
    let password = await hash(req.body.password, 10);
    const data = {
        email: req.body.email, 
        username: req.body.username, 
        password: password,
        publicId: "",
        imageUrl: "",
        admin: false
    }
    User.register(new User(data), 
      req.body.password, (err, user) => {
      if(user) {
          passport.authenticate('local')(req, res, () => {
              res.status(201).json({
                  code: 201,
                  message: "User Created",
                  UserCreated: user
              })
          });
    }
    else {
          if (err.code == 11000) {
              res.status(409).json({
                  code: 409,
                  message: "User Already Exists",
              })
          }
      }
    });
})

const createAdmin =  ( (req, res) => {
    User.findOne({ email: req.body.email }, async (error, data) => {
        if (data) {
            res.status(409).json({
                code: 409,
                message: "User Already Exists",
            })
        }
        else {
            let password = await hash(req.body.password, 10);
            const data = {
                email: req.body.email, 
                username: req.body.username, 
                password: password,
                publicId: "",
                imageUrl: "",
                admin: true
            }
            User.register(new User(data), 
              req.body.password, (err, user) => {
              if(user) {
                  passport.authenticate('local')(req, res, () => {
                      res.status(201).json({
                          code: 201,
                          message: "Admin User Created",
                          UserCreated: user
                      })
                  });
            }
            });
            
        }
    })
})

const loginUser = ((req,res) => {
    res.status(200).json({
        code: 200,
        message: "Logged In",
        LoggedInAs: req.user.id
    })
})

const users = ((req,res) => {
    const usr = req.user.username
    User.find({}, (err, data) => {
        if (!err) {
            if (data.length === 0 ) {
                res.status(404).json({
                    code: 404,
                    message: "No Users Found"
                })
            }
            else {
                res.status(200).json({
                    code: 200,
                    message: "Users Found",
                    UserWhoFetched: usr,
                    Users: data
                })
            }
        } else {
            res.status(500).json({
                code: 500,
                message: "Bad Request",
                Error: err,
            })
        }
    })

})

const getSingleUser = ((req,res) => {
    User.findOne( { _id: req.params.id } , (err, data) => {
        if (data) {
            res.status(200).json({
                code: 200,
                message: "User Fetched",
                data: data,
            })
        } else {
            res.status(404).json({
               code: 404,
               message: "No User Found. Invalid Id",
            })
        }
    })

})

const editUserName = ( async (req,res) => {

    const username = req.body.username;
    User.findOneAndUpdate( { _id: req.user._id },{ $set: { "username" : username } },{ new:true }, (err,data) => {
        if (!err) {
            res.status(200).json({
                code: 200,
                message: "UserName updated",
                UpdatedUser: data,
            })
        }
    })
})

const editPassword = ( async (req,res) => {
    const password = await hash(req.body.password, 10);
    User.findOneAndUpdate( { _id: req.user._id } ,{ $set: { "password" : password } },{ new:true }, (err,data) => {
        if (!err) {
            res.status(200).json({
                code: 200,
                message: "Password Changed",
                UpdatedUser: data,
            })
        }
    })
})

const editDp = ( async (req,res) => {
    const user = User.findOne( { _id : req.user._id }  );
    if (!user) {
        res.status(404).json({
            code: 404,
            message: "User to Update Not found",
        })
    }
    else {
        const data = await uploadImage(req.file.path, "profile_pictures")
        const usertodeleteimage = await User.findOne({ _id: req.user._id })
        if ( usertodeleteimage.publicId == "" ) {
            
        }
        else {
            const publicId = usertodeleteimage.publicId
            await deleteImage(publicId)
        }
        User.findOneAndUpdate( { _id : req.user._id } ,{ $set: { "imageUrl" : data.url, "publicId": data.public_id } },{ new:true }, (err,data) => {
            if (!err) {
                res.status(200).json({
                    code: 200,
                    message: "Profile Picture Changed",
                    UpdatedUser: data,
                })
            }
        })
    }
})

const deleteUser = ((req,res) => {
    User.deleteOne( { _id: req.params.id }, (err, data) => {
        if (!err) {
            res.status(200).json({
                code: 200,
                message: "User Deleted",
             })
        } else {
            res.status(404).json({
                code: 404,
                message: "User to Delete not found",
                error: err,
            })
        }
    })
})

export  { 
    users, 
    createUser, 
    createAdmin,
    loginUser,
    deleteUser, 
    getSingleUser,
    editUserName,
    editPassword,
    editDp
}