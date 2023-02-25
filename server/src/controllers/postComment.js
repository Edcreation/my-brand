
import comments from '../models/commentsmodel.js'
import Blogs from '../models/blogsmodel.js'

const postComment = ( (req,res) => {
    Blogs.findOne({ _id: req.params.id }, (error, blog) => {
        if (blog) {
            const commentData = {
                _blogId: req.params.id,
                _userId: req.user._id,
                comment: req.body.comment
            }
            comments.create(commentData, (err,data) => {
                if (data) {
                    res.status(201).json({
                        code: 201,
                        message: "Comment Added",
                        comment: data
                    })
                }
            })
        }
        if (error) {
            res.status(404).json({
                code: 404,
                Error: error
            })
        }
    })
})

const getComments = ((req,res) => {
    Blogs.findOne({ _id: req.params.id  }, (err, blog) => {
        if (blog) {
            comments.find({ _blogId: req.params.id }, (err, data) => {
                if (data) {
                    res.status(200).json({
                        code: 200,
                        UserId: data._userId,
                        Comments: data
                    })
                }
            }).sort({'date': -1})   
        }
        if (err) {
            res.status(404).json({
                code: 404,
                Error: err
            })
        }
    })
})

export {
    postComment,
    getComments
}
