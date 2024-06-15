const mongoose = require('mongoose');


async function connectDB (){
    try {
        await mongoose.connect(process.env.MONGO_DB_URI)
        console.log('connected to database successfully')
    } catch(err){
        console.log(err)
    }
    
};

module.exports = {connectDB};