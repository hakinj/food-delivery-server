const foodRouter = require('express').Router();
const{postFood, getPostedFood} = require('../controller/foodTypeController');
const { upload } = require('../multer/index')



foodRouter.post('/post-food', upload.single('image'), postFood);
foodRouter.get('/getposted-food', getPostedFood)




module.exports = foodRouter


