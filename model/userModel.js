const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    address:{
        type: String,
    },
    
    suspended:{
        type: Boolean,
        default: false
    },
    phoneNum:{
        type: Number,
        required: true,
        unique: true
    },
    order:{
        type: [Object]
    },
    
    orderhistory:{
        
        type: [Object]
    }
    
}, {timestamps: true});

const UserModel = mongoose.model('user', userSchema);

module.exports = {UserModel};