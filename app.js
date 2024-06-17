const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const bodyparser = require('body-parser');
const { connectDB } = require('./database/db');
const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes')
const foodRouter = require('./routes/foodTypeRoutes')
const methodOverride = require('method-override');
const   ErrorHandler  = require('./middleware/ErrorHandler');
const session = require('express-session');
const memoryStore = require('memorystore')(session);
const cors = require('cors');




const app = express();
const port = process.env.PORT || 8080;
//middleware
app.use(express.urlencoded({extended: true}));

app.use(cors({
    origin: "https://food-delivery-sable-two.vercel.app",
    credentials: true,
    methods: 'GET,PUT,POST,OPTIONS', 
    allowedHeaders: 'Content-Type,Authorization'
}))
app.set('view engine', 'ejs')
app.use(express.json());  
app.use(cookieParser());
app.use(bodyparser.json())
app.use(methodOverride('_method'));

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    store: new memoryStore({
        checkPeriod: 86400000
    })
}));

app.use('/api/v1', userRouter);
app.use("/api/v2", adminRouter)
app.use('/api/v3', foodRouter);





app.use(ErrorHandler);



async function Server() {
    try {
        await connectDB()
        app.listen(port, () => console.log(`server running on localhost port ${port}`));
    }
    catch (err) {
        console.log(err)
    }
}
Server()