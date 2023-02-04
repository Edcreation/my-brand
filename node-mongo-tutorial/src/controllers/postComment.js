
import comments from '../models/commentsmodel.js'


const postComment = ( (req,res) => {
    const commentData = {
        _blogId: req.params.id,
        _userId: req.body.userId,
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
        else {
            res.status(201).json({
                code: 201,
                message: "Comment Not Added",
                Error: err
            })
        }
    })
})

const getComments = ((req,res) => {
    comments.find({ _blogId: req.params.id }, (err, data) => {
        if (data) {
            res.status(200).json({
                code: 200,
                UserId: data._userId,
                Comments: data
            })
        }
        if (err) {
            res.status(500).json({
                code: 500,
                Error: err
            })
        }
    })
})

export {
    postComment,
    getComments
}