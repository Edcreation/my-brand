import { Schema, model } from 'mongoose';

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

});

export default model('users', UserSchema);