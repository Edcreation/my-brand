import User from '../models/usersmodel.js';
import bcrypt from 'jsonwebtoken';
import pkg from 'bcryptjs';
import dotenv from 'dotenv';

const { hash, compare } = pkg;
const { sign } = bcrypt;
const { SECRET = "secret" } = process.env;

dotenv.config();
const createUser =  ( async (req,res) => {
    try {

        req.body.password = await hash(req.body.password, 10);
        const user = await User.create(req.body, (err, user) => {
            if (err) {
                if (err.code == 11000) {
                    res.status(409).json({
                        code: 409,
                        message: "User Already Exists",
                        Error: err,
                    })
                }
                else {
                        res.status(400).json({
                        code: 400,
                        message: "User Validation Failed",
                        Error: err,
                    })
                }
            }
            else {
            res.status(201).json({
                code: 201,
                message: "User created",
                createdUser: user,
            }) 
        }
        })
    } catch (error) {
        if (error.code == 11000) {
            res.status(409).json({
                code: 409,
                message: "User Already Exists",
                Error: error,
            })
        }
        else {
            res.status(500).json({
                code: 500,
                message: "User Not Created. Internal Error",
                Error: error,
            })
        }
    }
    
})

const loginUser = ((req,res) => {
    try {
        User.findOne({ email : req.body.email }, async (err, data) => {
            if (data) {
                const passCheck = await compare( req.body.password, data.password )
                if (passCheck) {
                    const token = sign({ username: data.username }, SECRET)
                    res.json({ token })
                    console.log(data)
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
            if (data == []) {
                res.status(204).json({
                    code: 204,
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
    User.findById( req.params.id , (err, data) => {
        if (!err) {
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

const editUser = ((req,res) => {
    const userdata ={
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }
    const user = User.findById( req.params.id );
    if (!user) {
        res.status(404).json({
            code: 404,
            message: "User to Update Not found",
        })
    }
    else {
        User.findByIdAndUpdate( req.params.id,{ $set:userdata },{ new:true }, (err,data) => {
            if (!err) {
                res.status(200).json({
                    code: 200,
                    message: "User updated",
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

const deleteUser = ((req,res) => {
    User.findByIdAndRemove( req.params.id, (err, data) => {
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
    editUser 
}