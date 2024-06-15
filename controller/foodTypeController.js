const { FoodModel } = require('../model/foodType')
const { AllPurposeFunc } = require('../utils/AllPurposeFunc');
const { HandleError } = require('../utils/error')
const fs = require('fs');
const path = require('path');




const postFood = AllPurposeFunc(async (req, res) => {

    const { name, description, price, category, ingredients, rating } = req.body;
    const  image  = await req.file.filename;
    if (!name || !price || !category) {
        throw new HandleError(process.env.errorCode, "Please fill all fields", process.env.statusCode);
    }
    const nameExist = await FoodModel.findOne({ name })
    if (!nameExist) {
        const food = new FoodModel({
            name, description, image, price, category, ingredients, rating
        })
        const savedFood = await food.save();
        return res.status(201).json({
            success: true,
            savedFood
        });
    }
    else {
        throw new HandleError(process.env.errorCode, 'food already exist', process.env.statusCode)
    }



})

const getPostedFood = AllPurposeFunc(async (req, res)=> {
    const food = await FoodModel.find();
    if(food){
        return res.status(200).json({
            success: true,
            food
        })
    }else{
        throw new HandleErroe (400, 'error fetching details', 400)
    }
    
})



module.exports = {
    postFood,
    getPostedFood
}