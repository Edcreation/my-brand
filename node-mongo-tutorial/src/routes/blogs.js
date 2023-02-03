import { Router } from 'express'
import { getBlogs, getSingleBlog, createBlog, editBlog, deleteBlog } from '../controllers/blogs.js'
const router = Router()
import Joi from 'joi'
import errorMessage from '../utils/errormessage.js'
import { validate } from '../middleware/validation.js'
import upload from '../middleware/upload.js'
import { postComment } from '../controllers/postComment.js'

const BlogsSchema = Joi.object().keys({
    title: Joi.string().required().messages(errorMessage('Title')),
    content: Joi.string().required().messages(errorMessage('Content')),
    publicId: Joi.string(),
    imageUrl: Joi.string(),
    blog_image: Joi.string().messages(errorMessage('Title Image'))
})
const CommentSchema = Joi.object().keys({
    comment: Joi.string().required().messages(errorMessage('Comment'))
}).unknown(true);

router.get('/', getBlogs)

router.get('/blog/:id', getSingleBlog)

router.post('/blog/c/:id',validate(CommentSchema, { abortEarly: false } ), postComment)

router.post('/create', upload.single('blog_image') ,validate(BlogsSchema, { abortEarly: false } ), createBlog)
router.put('/edit/:id',  upload.single('blog_image') , validate(BlogsSchema, { abortEarly: false } ), editBlog)
router.delete('/delete/:id', deleteBlog)

export default router