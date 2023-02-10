/**
 * @swagger
 * components:
 *   schemas:
 *     create:
 *       type: object
 *       required:
 *         - title
 *         - blogImage
 *         - content
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the blog
 *         title:
 *           type: string
 *           description: title of blog
 *         imageUrl:
 *           type: string
 *           description: imageUrl of blog
 *         content:
 *           type: string
 *           description: content of blog
 *       example:
 *         id: d5fE_asz
 *         title: How to code in 2022
 *         blogImage: www.image.com/image.jpg
 *         content: Hello world
 *     getblogs:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *           description: The http code of response
 *         message:
 *           type: string
 *           description: Message of response
 *       example:
 *         code: 200
 *         message: Blogs Fetched
 *         Blogs: {}
 *     getblog:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *           description: The http code of response
 *         message:
 *           type: string
 *           description: Message of response
 *       example:
 *         code: 200
 *         message: Single Blogs Fetched
 *         BlogFetched: {}
 *     blognotfound:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *           description: The http code of response
 *         message:
 *           type: string
 *           description: Message of response
 *       example:
 *         code: 404
 *         message: Blog Not found
 */
/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blogs  api
 * /blogs:
 *   get:
 *     summary: Get all blogs
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: Blog Retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/getblogs'
 * /blogs/b/{id}:
 *   get:
 *     summary: Get single blog
 *     parameters :
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description : object id of user
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: Single Blog Retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/getblog'
 *       404:
 *         description: Single Blog Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/blognotfound'
 * 
 */


import { Router } from 'express'
import { getBlogs, getSingleBlog, createBlog, editBlog, deleteBlog, likeBlog } from '../controllers/blogs.js'
import Joi from 'joi'
import errorMessage from '../utils/errormessage.js'
import { validate } from '../middleware/validation.js'
import upload from '../middleware/upload.js'
import { postComment, getComments } from '../controllers/postComment.js'
import passport from 'passport'
import bodyParser from 'body-parser'
import { isLoggedIn, isLoggedInAsAdmin } from '../middleware/isLoggedIn.js';

const router = Router()
router.use(bodyParser.json());
router.use(passport.initialize());
router.use(passport.session());

const BlogsSchema = Joi.object().keys({
    title: Joi.string().required().messages(errorMessage('Title')),
    content: Joi.string().required().messages(errorMessage('Content')),
    publicId: Joi.string(),
    imageUrl: Joi.string(),
}).unknown(true);

const CommentSchema = Joi.object().keys({
    comment: Joi.string().required().messages(errorMessage('Comment'))
}).unknown(true);

router.get('/', getBlogs)
router.get('/b/:id', getSingleBlog)

router.post('/b/:id/c',isLoggedIn, validate(CommentSchema, { abortEarly: false } ), postComment)
router.get('/b/:id/c', getComments)

router.put('/b/:id/like',isLoggedIn, likeBlog)

router.post('/create',isLoggedInAsAdmin, upload.single("blogImage") ,validate(BlogsSchema, { abortEarly: false } ), createBlog)
router.put('/edit/:id',isLoggedInAsAdmin,  upload.single('blogImage') , validate(BlogsSchema, { abortEarly: false } ), editBlog)
router.delete('/delete/:id', isLoggedInAsAdmin, deleteBlog)

export default router