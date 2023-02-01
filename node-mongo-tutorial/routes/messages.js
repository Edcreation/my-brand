import { Router } from 'express'
const router = Router()
import { validate } from '../middleware/validation.js';
import Joi from 'joi';
import { sendMessage, getMessages, getSingleMessage, deleteMessage } from '../controllers/messages.js'
import errorMessage from '../utils/errormessage.js';

const MessageSchema = Joi.object().keys({
    name: Joi.string().required().messages(errorMessage('Name')),
    email: Joi.string().email().required().messages(errorMessage('Email')),
    message: Joi.string().required().messages(errorMessage('Message'))
})

router.post('/send',validate(MessageSchema, { abortEarly: false }), sendMessage)

router.get('/', getMessages)
router.get('/msg/:id', getSingleMessage)
router.delete('/delete/:id', deleteMessage)

export default router