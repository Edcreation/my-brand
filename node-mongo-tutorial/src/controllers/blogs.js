import Blogs from '../models/blogsmodel.js'
import Users from '../models/usersmodel.js'
import { deleteImage, uploadImage } from '../utils/cloudinary.js';

import dotenv from 'dotenv';

dotenv.config()


const getBlogs = ((req,res) => {
    Blogs.find({}, (err, data) => {
        if (data) {
            res.status(200).json({
                code: 200,
                message: "Blogs Retrieved",
                Blogs: data
            })
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
    Blogs.findOne( { _id: req.params.id}, (err, blog) => {
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

const createBlog = ( async (req,res) => {
    const data = await uploadImage(req.file.path, "blog_images").catch((err) => { 
        res.status(400).json({ 
        Message: "Image Upload Error", 
        Error: err 
        }) 
    })
    const blogData = {
        title : req.body.title,
        content : req.body.content,
        publicId: data.public_id,
        imageUrl: data.url,
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

const editBlog = ( (req,res) => {
    const id = req.params.id 
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        Blogs.findOne({ _id: req.params.id }, async (error, m) => {
            if (m) {
                const data = await uploadImage(req.file.path, "blog_images")
                const blogToDeleteImage = await Blogs.findOne({ _id: req.params.id })
                const publicId = blogToDeleteImage.publicId
                await deleteImage(publicId)
                const blogData = {
                    title : req.body.title,
                    image : req.body.image,
                    content : req.body.content,
                    publicId: data.public_id,
                    imageUrl: data.url,
                    date : new Date()
                }
                Blogs.findOneAndUpdate( { _id:  req.params.id },{ $set:blogData },{ new:true }, (err,blog) => {
                    if (!err) {
                        res.status(200).json({
                            code: 200,
                            message: "Blog updated",
                            UpdatedBlog: blog,
                        })
                    }
                })  
            }
            else {
                res.status(404).json({
                    code: 404,
                    message: "Blog to Update not found",
                })
            }
        })  
    }
    else {
        res.status(404).json({
            code: 404,
            message: "Page Not Found",
        })
    }
})

const deleteBlog = ( async (req,res) => {
    const blogToDeleteImage = await Blogs.findOne({ _id: req.params.id })
    const publicId = blogToDeleteImage.publicId
    await deleteImage(publicId)
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

const likeBlog = ( (req,res) => {
    let useridf = req.user._id
    const {token}=req.cookies;
    Blogs.find({ "_id": req.params.id, "liked" : useridf }, async (err, data) => {
        if(data) {
            if (data.length == 0 ) {
                Blogs.updateOne(
                    { _id: req.params.id }, 
                    { $push: { "liked" : useridf } },
                    (err, tru) => {
                        if (tru) {
                            res.status(200).json({
                                Message: "Liked",
                            })
                        }
                    });
            }
            else {
                Blogs.findOne({ _id: req.params.id, liked: { $in: useridf }}, (err, wow) => {
                    if (!err) {
                        Blogs.updateOne({ _id: req.params.id } , { $pull: { liked : useridf  } }, (error, wow1) => {
                            if (!err) {
                                res.status(200).json({
                                    Message: "Unliked",
                                })  
                            }
                        })
                    }
                })
            }
        }
    });

})

export  {
    getBlogs,
    getSingleBlog,
    createBlog,
    editBlog,
    deleteBlog,
    likeBlog,
}