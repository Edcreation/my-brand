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
    liked: [{
        type:String
    }],
    publicId: {
        type: String,
        required: false,
    },
    imageUrl: {
        type: String,  
        required: false
    },
    date: {
       type: Date,
       default: Date.now
    }
 });
 
 export default model('blogs', BlogSchema);