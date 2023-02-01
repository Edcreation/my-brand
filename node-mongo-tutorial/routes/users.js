import { Router } from 'express'
import { users, createUser, loginUser, getSingleUser, editUser, deleteUser } from '../controllers/users.js'
import joi from 'joi';
import { validate } from '../middleware/validation.js';
import errorMessage from '../utils/errormessage.js';

const router = Router()

const SignUpSchema = joi.object().keys({
    username: joi.string().min(6).max(30).required().messages(errorMessage('Username')),
    email: joi.string().email().required().messages(errorMessage('Email')),
    password: joi.string().required().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0123456789])(?=.*[@$!%*?&])[A-Za-z0123456789@$!%*?&]{8,}$")).messages(errorMessage('Password')), // password has both numbers and letters and is btn 6 and 30 
})

const LoginSchema = joi.object().keys({
    email: joi.string().email().required().messages(errorMessage('Email')),
    password: joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0123456789])(?=.*[@$!%*?&])[A-Za-z0123456789@$!%*?&]{8,}$")), // password has both numbers and letters and is btn 6 and 30 
})

router.get('/', users)

router.get('/user/:id', getSingleUser)
router.put('/edit/:id',validate(SignUpSchema, { abortEarly: false }), editUser)
router.delete('/delete/:id', deleteUser)

router.post('/signup',validate(SignUpSchema), createUser)
router.post('/login',validate(LoginSchema), loginUser)


export default router

