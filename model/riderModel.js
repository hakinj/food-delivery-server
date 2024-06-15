const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema({
    name:{
        type: String,
        require:true
    }, 
    email:{
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String,
        require: true
    },
    phoneNum:{
        type: Number,
        require: true,
        unique: true
    },
    rideType:{
        type: String,
        require: true
    },
    ridePlateNum:{
        type: String,
        require: true,
        unique: true
    },
    available:{
        type: Boolean,
        default: true
    },
    location:{
        type: String,
        default: 'point'
    }


}, {timestamps: true})

const RiderModel = mongoose.model('rider', riderSchema)

module.exports = {RiderModel}