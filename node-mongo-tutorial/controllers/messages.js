import Messages from '../models/messagesmodel.js'

const getMessages = (( req, res ) => {
    Messages.find({}, (err, Msg) => {
        if (!err) {
            res.status(200).json({
                code: 200,
                message: "Messages Found",
                Messages: Msg,
             })
        } else {
            res.status(400).json({
                code: 400,
                message: "Messages Not Found",
                Error: err,
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
            res.status(400).json({
                code: 400,
                message: "Message Not Found",
                Error: err,
             })
        }
    })
})

const deleteMessage = (( req, res ) => {
    Messages.findByIdAndRemove( req.params.id, ( err, Msg) => {
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




