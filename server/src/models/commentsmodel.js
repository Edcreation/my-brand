import { Schema, model } from 'mongoose';

// Creating mongoose  model
const CommentsSchema = new Schema({
    _blogId: {
        type: String,
        required: true
    },
    _userId: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    likeCount: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
     }
 });
 
 export default model('comments', CommentsSchema);