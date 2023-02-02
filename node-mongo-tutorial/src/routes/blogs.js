import { Router } from 'express'
import { getBlogs, getSingleBlog, createBlog, editBlog, deleteBlog } from '../controllers/blogs.js'
const router = Router()
import Joi from 'joi'
import errorMessage from '../utils/errormessage.js'
import { validate } from '../middleware/validation.js'
import upload from '../middleware/upload.js'



const BlogsSchema = Joi.object().keys({
    title: Joi.string().required().messages(errorMessage('Title')),
    content: Joi.string().required().messages(errorMessage('Content')),
    publicId: Joi.string(),
    imageUrl: Joi.string(),
    blog_image: Joi.string().messages(errorMessage('Title Image'))
})

router.get('/', getBlogs)

router.get('/blog/:id', getSingleBlog)

router.post('/create', upload.single('blog_image') ,validate(BlogsSchema, { abortEarly: false } ), createBlog)
router.put('/edit/:id',  upload.single('blog_image') , validate(BlogsSchema, { abortEarly: false } ), editBlog)
router.delete('/delete/:id', deleteBlog)

export default router