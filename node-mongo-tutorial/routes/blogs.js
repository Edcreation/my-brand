import { Router } from 'express'
import { getBlogs, getSingleBlog, createBlog, editBlog, deleteBlog } from '../controllers/blogs.js'
const router = Router()
import Joi from 'joi'
import errorMessage from '../utils/errormessage.js'
import { validate } from '../middleware/validation.js'

const BlogsSchema = Joi.object().keys({
    title: Joi.string().required().messages(errorMessage('Title')),
    image: Joi.required().messages(errorMessage('Image')),
    content: Joi.string().required().messages(errorMessage('Content'))
})

router.get('/', getBlogs)

router.get('/blog/:id', getSingleBlog)

router.post('/create',validate(BlogsSchema, { abortEarly: false } ), createBlog)
router.put('/edit/:id',validate(BlogsSchema, { abortEarly: false } ), editBlog)
router.delete('/delete/:id', deleteBlog)

export default router