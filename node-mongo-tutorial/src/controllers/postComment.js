import { Router } from 'express'
import Joi from 'joi'
import errorMessage from '../utils/errormessage.js'
import comments from '../models/commentsmodel.js'

const router = Router()

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

export {
    postComment,
}
