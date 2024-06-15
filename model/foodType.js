const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name:{ 
        type: String, 
        required: true 
    },
    description:{ 
        type: String 
    },
    image:{
        
        type: String
    },
    price:{ 
        type: Number,
         required: true
    },
    category:{
        type: String,
        required: true
    },
    ingredients:{
        type: []
    },
    rating:{
        type: Number,
        default: 0
    }
},{timestamps: true}); 

const FoodModel = mongoose.model('food', foodSchema);

module.exports = { FoodModel };
