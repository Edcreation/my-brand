import { Schema, model } from 'mongoose';
// Creating mongoose  model
const MessagesSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    message: {
     type: String,
     required: true
     },
     date: {
       type: Date,
       default: Date.now
     }
 });
 export default model('messages', MessagesSchema);