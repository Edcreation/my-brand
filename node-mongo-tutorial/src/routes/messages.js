/**
 * @swagger
 * components:
 *   schemas:
 *     send:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - message
 *       properties:
 *         name:
 *           type: string
 *           description: The name of client
 *         email:
 *           type: string
 *           description: The email of client
 *         message:
 *           type: string
 *           description: imageUrl of blog
 *       example:
 *         name: Hello
 *         email: hello@mail.com
 *         message: Hi how are you?
 *     sent:
 *       type: object
 *       required:
 *         - code
 *       properties:
 *         code:
 *           type: integer
 *           description: The http code of response
 *         message:
 *           type: string
 *           description: The message of response
 *         MassageSent:
 *           type: string
 *           description: The message which was sent
 *       example:
 *         code: 201
 *         message: Message Sent
 *         MessageSent: {}
 * 
 */
/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Messages  api
 * /messages/send:
 *   post:
 *     summary: Send a message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/send'
 *     responses:
 *       200:
 *         description: Message Sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/sent'
 * /messages:
 *   get:
 *     summary: Get all messages (admin)
 *     tags: [Messages]
 *     responses:
 *       200:
 *         description: Messages Retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/getblogs'
 * /messages/msg/{id}:
 *   get:
 *     summary: Get single message (admin)
 *     parameters :
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description : object id of message
 *     tags: [Messages]
 *     responses:
 *       200:
 *         description: Single Message Retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/getblog'
 *       404:
 *         description: Single message Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/blognotfound'
 */


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