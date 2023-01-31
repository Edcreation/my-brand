import { Router } from 'express'
const router = Router()
import { validate } from '../middleware/validation.js';
import Joi from 'joi';
import { sendMessage, getMessages, getSingleMessage, deleteMessage } from '../controllers/messages.js'

const MessageSchema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    message: Joi.string().required()
})

router.post('/send',validate(MessageSchema), sendMessage)

router.get('/', getMessages)
router.get('/msg/:id', getSingleMessage)
router.delete('/delete/:id', deleteMessage)

export default router