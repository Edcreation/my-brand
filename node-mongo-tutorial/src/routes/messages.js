import { Router } from 'express'
const router = Router()
import { validate } from '../middleware/validation.js';
import Joi from 'joi';
import { sendMessage, getMessages, getSingleMessage, deleteMessage } from '../controllers/messages.js'
import errorMessage from '../utils/errormessage.js';
import passport from 'passport';
import { isLoggedInAsAdmin } from '../middleware/isLoggedIn.js';
const MessageSchema = Joi.object().keys({
    name: Joi.string().required().messages(errorMessage('Name')),
    email: Joi.string().email().required().messages(errorMessage('Email')),
    message: Joi.string().required().messages(errorMessage('Message'))
})

router.use(passport.initialize());
router.use(passport.session());

router.post('/send',validate(MessageSchema, { abortEarly: false }), sendMessage)

router.get('/',isLoggedInAsAdmin, getMessages)
router.get('/msg/:id',isLoggedInAsAdmin, getSingleMessage)
router.delete('/delete/:id',isLoggedInAsAdmin, deleteMessage)

export default router