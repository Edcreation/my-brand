import Blogs from '../models/blogsmodel.js'

const getBlogs = ((req,res) => {
    Blogs.find({}, (err,blogs) => {
        if (!err) {
            res.status(200).json({
                code: 200,
                message: "Blogs Retrieved",
                Blogs: blogs
            })
        }
        else {
            res.status(400).json({
                code: 400,
                message: "Blogs NOT Retrieved",
                Error: err
            })
        }
    })
})

const getSingleBlog = (( req,res ) => {
    Blogs.findById( req.params.id, (err, blog) => {
        if (!err) {
            res.status(200).json({
                code: 200,
                message: "Single Blog Fetched",
                BlogFetched: blog,
            })
        } else {
            res.status(200).json({
                code: 200,
                message: "Blog Not Found",
                Error: err,
            })
        }
    })
})

const createBlog = ((req,res) => {
    const blogData = {
        title : req.body.title,
        image : req.body.image,
        content : req.body.content,
        date : new Date()
    }
    try {
        Blogs.create(blogData, (err, blog) => {
            if (!err) {
                res.status(201).json({
                    code: 201,
                    message: "Blog created",
                    BlogCreated: blog,
                })
            } else {
                res.status(400).json({
                    code: 400,
                    message: "Blog NOT created",
                    Error: err,
                })
            }

        })
    } catch (error) {
        res.status(400).json({
            code: 400,
            message: "Blog Not created",
            Error: error,
        })
    }
})

const editBlog = ((req,res) => {
    const blogData = {
        title : req.body.title,
        image : req.body.image,
        content : req.body.content,
        date : new Date()
    }
    Blogs.findByIdAndUpdate( req.params.id,{ $set:blogData },{ new:true }, (err,blog) => {
        if (!err) {
            res.status(200).json({
                code: 200,
                message: "Blog update",
                UpdatedBlog: blog,
            })
        } else {
            res.status(400).json({
                code: 400,
                message: "Blog Not Updated",
                Error: err,
            })
        }
    })
})

const deleteBlog = ((req,res) => {
    Blogs.findByIdAndRemove( req.params.id, (err, blog) => {
        if (!err) {
            res.status(200).json({
                code: 200,
                message: "Blog Deleted",
                BlogDeleted: blog,
             })
        } else {
            res.status(400).json({
                code: 400,
                message: "Blog Not Deleted",
                Error: err,
            })
        }
    })
})

export  {
    getBlogs,
    getSingleBlog,
    createBlog,
    editBlog,
    deleteBlog,
}