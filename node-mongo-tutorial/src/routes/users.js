import { Router } from 'express'
import { users, createUser, loginUser, getSingleUser, editDp, editUserName, editPassword, deleteUser } from '../controllers/users.js'
import joi from 'joi';
import { validate } from '../middleware/validation.js';
import errorMessage from '../utils/errormessage.js';
import upload from '../middleware/upload.js';
import User from '../models/usersmodel.js'
import bodyParser from 'body-parser';
import passport from 'passport';
import LocalStrategy from 'passport-local';

const router = Router()
const SignUpSchema = joi.object().keys({
    username: joi.string().min(6).max(30).required().messages(errorMessage('Username')),
    email: joi.string().email().required().messages(errorMessage('Email')),
    password: joi.string().required().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0123456789])(?=.*[@$!%*?&])[A-Za-z0123456789@$!%*?&]{8,}$")).messages(errorMessage('Password')), // password has both numbers and letters and is btn 6 and 30 
})

const NameSchema = joi.object().keys({
    username: joi.string().min(6).max(30).required().messages(errorMessage('Username')),
})

const PasswordSchema = joi.object().keys({
    password: joi.string().required().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0123456789])(?=.*[@$!%*?&])[A-Za-z0123456789@$!%*?&]{8,}$")).messages(errorMessage('Password')), 
})


const LoginSchema = joi.object().keys({
    email: joi.string().email().required().messages(errorMessage('Email')),
    password: joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0123456789])(?=.*[@$!%*?&])[A-Za-z0123456789@$!%*?&]{8,}$")), // password has both numbers and letters and is btn 6 and 30 
})

router.use(bodyParser.urlencoded({ extended: true }));





router.get('/', users)

router.get('/user/:id', getSingleUser)

// User profile changes
router.put('/edit/profilepic/:id',upload.single("profile_pic"), editDp)
router.put('/edit/username/:id',validate(NameSchema, { abortEarly: false }), editUserName)
router.put('/edit/password/:id',validate(PasswordSchema, { abortEarly: false }), editPassword)

// Delete user changes
router.delete('/delete/:id', deleteUser)

// User Login and Sing Up
router.post('/signup',validate(SignUpSchema, { abortEarly: false } ), createUser)
router.post('/login',validate(LoginSchema), loginUser)


export default router

