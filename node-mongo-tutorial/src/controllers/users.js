import User from '../models/usersmodel.js';
import bcrypt from 'jsonwebtoken';
import pkg from 'bcryptjs';
import dotenv from 'dotenv';
import { deleteImage, uploadImage } from '../utils/cloudinary.js';
import { Strategy as PassportLocalStrategy } from 'passport-local';

const { hash, compare } = pkg;
const { sign } = bcrypt;


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const createUser =  ( async (req,res) => {
    try {
        const check = User.find({ email: req.body.email }, async (err, data) => {
            if (data) {
                if (data.length != 0 ) {
                    res.status(409).json({
                        code: 409,
                        message: "Email already Exists"
                    })
                }
                else {
                    let password = await hash(req.body.password, 10);
                    const userdata = {
                        email: req.body.email,
                        username: req.body.username,
                        password: password,
                        publicId: "",
                        imageUrl: ""
                    }
                    const user = User.create(userdata, (err, user) => {
                        res.status(201).json({
                            code: 201,
                            message: "User created",
                            createdUser: user,
                        })
                    })
                }
            }
        })
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: "User Not Created. Internal Error",
            Error: error,
        })
    }
    
})

const loginUser = ((req,res) => {
    try {
        User.findOne({ email : req.body.email }, async (err, data) => {
            if (data) {
                const passCheck = await compare( req.body.password, data.password )
                if (passCheck) {
                    const token = sign({ userId: data._id, username: data.username, email: data.email, imageUrl: data.imageUrl }, JWT_SECRET)
                    res.cookie('token',token,{ maxAge: 2 * 60 * 60 * 1000, httpOnly: true });
                    // res.setHeader('Authorization', 'Bearer '+ token);
                    res.json({ token })
                } else {
                    res.status(200).json({ error: "Password is Invalid" });
                }
            } else {
                res.status(200).json({ error: "User doesn't exist" });
            }
        })
    } catch(err) {
        res.status(400).json({ err  })
    }
})

const users = ((req,res) => {
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

    const user = User.findOne( { _id: req.params.id} );
    if (!user) {
        res.status(404).json({
            code: 404,
            message: "User to Update Not found",
        })
    }
    else {
        const username = req.body.username;
        User.findOneAndUpdate( { _id: req.params.id },{ $set: { "username" : username } },{ new:true }, (err,data) => {
            if (!err) {
                res.status(200).json({
                    code: 200,
                    message: "UserName updated",
                    UpdatedUser: data,
                })
            } else {
                res.status(404).json({
                    code: 404,
                    message: "User Not Updated. No User Found",
                })
            }
        })
    }
})

const editPassword = ( async (req,res) => {

    const user = User.findOne( { _id: req.params.id } );
    if (!user) {
        res.status(404).json({
            code: 404,
            message: "User to Update Not found",
        })
    }
    else {
        const password = await hash(req.body.password, 10);
        User.findOneAndUpdate( { _id: req.params.id } ,{ $set: { "password" : password } },{ new:true }, (err,data) => {
            if (!err) {
                res.status(200).json({
                    code: 200,
                    message: "Password Changed",
                    UpdatedUser: data,
                })
            } else {
                res.status(404).json({
                    code: 404,
                    message: "User Not Updated. No User Found",
                    error : err
                })
            }
        })
    }
})

const editDp = ( async (req,res) => {
    const user = User.findOne( { _id : req.params.id} );
    if (!user) {
        res.status(404).json({
            code: 404,
            message: "User to Update Not found",
        })
    }
    else {
        const data = await uploadImage(req.file.path, "profile_pictures")
        const usertodeleteimage = await User.findOne({ _id: req.params.id })
        if ( usertodeleteimage.publicId == "" ) {
            
        }
        else {
            const publicId = usertodeleteimage.publicId
            await deleteImage(publicId)
        }
        User.findOneAndUpdate( { _id : req.params.id} ,{ $set: { "imageUrl" : data.url, "publicId": data.public_id } },{ new:true }, (err,data) => {
            if (!err) {
                res.status(200).json({
                    code: 200,
                    message: "Profile Picture Changed",
                    UpdatedUser: data,
                })
            } else {
                res.status(404).json({
                    code: 404,
                    message: "Profile Picture Not Updated. No User Found",
                    error : err
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
    loginUser,
    deleteUser, 
    getSingleUser,
    editUserName,
    editPassword,
    editDp
}