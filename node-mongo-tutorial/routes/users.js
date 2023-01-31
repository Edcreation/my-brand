import { Router } from 'express'
const router = Router()
import { users, createUser, loginUser, getSingleUser, editUser, deleteUser } from '../controllers/users.js'
import joi from 'joi';
import { validate } from '../middleware/validation.js';

const SignUpSchema = joi.object().keys({
    username: joi.string().min(6).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0123456789])(?=.*[@$!%*?&])[A-Za-z0123456789@$!%*?&]{8,}$")), // password has both numbers and letters and is btn 6 and 30 
})

const LoginSchema = joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0123456789])(?=.*[@$!%*?&])[A-Za-z0123456789@$!%*?&]{8,}$")), // password has both numbers and letters and is btn 6 and 30 
})

router.get('/', users)

router.get('/user/:id', getSingleUser)
router.put('/edit/:id',validate(SignUpSchema), editUser)
router.delete('/delete/:id', deleteUser)

router.post('/signup',validate(SignUpSchema), createUser)
router.post('/login',validate(LoginSchema), loginUser)


export default router

