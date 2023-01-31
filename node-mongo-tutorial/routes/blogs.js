import { Router } from 'express'
import { getBlogs, getSingleBlog, createBlog, editBlog, deleteBlog } from '../controllers/blogs.js'
const router = Router()

router.get('/', getBlogs)

router.get('/blog/:id', getSingleBlog)

router.post('/create', createBlog)
router.put('/edit/:id', editBlog)
router.delete('/delete/:id', deleteBlog)



export default router