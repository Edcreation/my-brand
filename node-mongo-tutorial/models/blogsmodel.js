import { Schema, model } from 'mongoose';
// Creating mongoose  model
const BlogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
     type: String,
     required: true
    },
    image: {
     type: String,
     required: true
    },
    date: {
       type: Date,
       default: Date.now
    }
 });
 export default model('blogs', BlogSchema);