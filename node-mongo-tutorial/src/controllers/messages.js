import Messages from '../models/messagesmodel.js'

const getMessages = (( req, res ) => {
    Messages.find({}, (err, data) => {
        if (data) {
            if (data.length === 0) {
                res.status(204).json({
                    code: 204,
                    message: "No Messages Found"
                })
            }
            else {
                res.status(200).json({
                    code: 200,
                    message: "Messages Found",
                    Messages: data
                })
            }
        } else {
            res.status(500).json({
                code: 500,
                message: "Internal Error",
            })
        }
    })
})

const getSingleMessage = (( req, res ) => {
    Messages.findById( req.params.id , (err, Msg) => {
        if (!err) {
            res.status(200).json({
                code: 200,
                message: "Single Message Found",
                Messages: Msg,
             })
        } else {
            res.status(404).json({
                code: 404,
                message: "Message Not Found",
             })
        }
    })
})

const deleteMessage = (( req, res ) => {
    Messages.deleteOne( { _id: req.params.id}, ( err, Msg) => {
        if (!err) {
            res.status(200).json({
                code: 200,
                message: "Message Deleted",
                MessageDeleted: Msg,
             })
        } else {
            res.status(400).json({
                code: 400,
                message: "Message Not Deleted",
                Error: err,
             })
        }
    })
})

const sendMessage = ((req, res) => {
    const Message = {
        name : req.body.name,
        email : req.body.email,
        message : req.body.message,
        date : new Date()
    }
    try {
        Messages.create(Message, ( err, Msg ) => {
            if (!err) {
                res.status(201).json({
                    code: 201,
                    message: "Message Sent",
                    MessageSent: Msg,
                 })
            } else {
                res.status(400).json({
                    code: 400,
                    message: "Message Not Sent",
                    Error: err,
                 })
            }
        })
        
    } catch (error) {
        res.status(400).json({
            code: 400,
            message: "Message Error",
            Error: error,
         })
    }
})

export {
    getMessages,
    getSingleMessage,
    deleteMessage,
    sendMessage
}




