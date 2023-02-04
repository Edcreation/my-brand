import Blogs from '../models/blogsmodel.js'
import Users from '../models/usersmodel.js'
import { deleteImage, uploadImage } from '../utils/cloudinary.js';

import verifyToken from '../utils/verifytoken.js';

import dotenv from 'dotenv';

dotenv.config()


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
        res.status(500).json({ 
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

const editBlog = ( async (req,res) => {
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
        } else {
            res.status(404).json({
                code: 404,
                message: "Blog to Update not found",
            })
        }
    })
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
    let useridf = req.body.userId
    const {token}=req.cookies;
    if(verifyToken(token)){
        Blogs.find({ "_id": req.params.id, "liked" : req.body.userId }, async (err, data) => {
            if(data) {
                if (data.length == 0 ) {
                    Blogs.updateOne(
                        { _id: req.params.id }, 
                        { $push: { "liked" : useridf } },
                        (err, tru) => {
                            if (tru) {
                                res.status(200).json({
                                    Message: "Liked",
                                    //data: tru
                                })
                            }
                            if (err) {
                                res.status(500).json({
                                    Message: "Not Liked",
                                    data: err
                                })
                            }
                        });
                }
                else {
                    Blogs.findOne({ _id: req.params.id, liked: { $in: req.body.userId }}, (err, wow) => {
                        if (!err) {
                            Blogs.updateOne({ _id: req.params.id } , { $pull: { liked : req.body.userId  } }, (error, wow1) => {
                                if (!err) {
                                    res.status(200).json({
                                        Message: "Unliked",
                                        //Liked: wow1.liked
                                    })  
                                }
                                else{
                                    res.status(500).json({
                                        Message: "Failed",
                                        Error: error
                                    }) 
                                }
                            })
                        }
                        else{
                            res.status(400).json({
                                Message: "User not added in liked",
                                Error: err
                            }) 
                        }
                    })
                }
            }
            if (err) {
                res.status(400).json({
                    Message: "Blog is invalid",
                })
            }
        });
    }else{
        res.status(403).json({
            code: 403,
            message: "Access Forbidden, Cant Like"
        })
    }

})

export  {
    getBlogs,
    getSingleBlog,
    createBlog,
    editBlog,
    deleteBlog,
    likeBlog,
}