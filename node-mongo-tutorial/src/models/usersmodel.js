import { Schema, model } from 'mongoose';

import passportLocalMongoose from 'passport-local-mongoose'

// Creating mongoose  model
const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    publicId: {
        type: String,
        required: false,
    },
    imageUrl: {
        type: String,  
        required: false
    },
    admin : Boolean,
    default: false

});

UserSchema.plugin(passportLocalMongoose);

export default model('users', UserSchema);