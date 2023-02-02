import Blogs from '../models/blogsmodel.js'

const getBlogs = ((req,res) => {
    Blogs.find({}, (err, data) => {
        if (data) {
            if (data.length === 0) {
                res.status(204).json({
                    code: 204,
                    message: "No Blogs Found"
                })
            }
            else {
                res.status(200).json({
                    code: 200,
                    message: "Blogs Retrieved",
                    Blogs: data
                })
            }
        } else {
            res.status(500).json({
                code: 500,
                message: "Internal Error",
                Error: err,
            })
        }
    })
})

const getSingleBlog = (( req,res ) => {
    Blogs.findById( req.params.id, (err, blog) => {
        if (blog) {
            res.status(200).json({
                code: 200,
                message: "Single Blog Fetched",
                BlogFetched: blog,
            })
        } else {
            res.status(404).json({
                code: 404,
                message: "Blog Not Found",
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
            res.status(404).json({
                code: 404,
                message: "Blog to Update not found",
            })
        }
    })
})

const deleteBlog = ((req,res) => {
    Blogs.deleteOne( { _id: req.params.id }, (err, blog) => {
        if (!err) {
            res.status(200).json({
                code: 200,
                message: "Blog Deleted",
                BlogDeleted: blog,
             })
        } else {
            res.status(404).json({
                code: 404,
                message: "Blog to Delete Not Found",
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