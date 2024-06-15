const { UserModel } = require('../model/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { AllPurposeFunc } = require('../utils/AllPurposeFunc');
const { HandleError } = require('../utils/error')
const { sendMail } = require('../utils/sendMails')


const period = 60 * 60 * 24;


const signupUser = AllPurposeFunc(async (req, res) => {
    const { firstname, lastname, email, password, address, phoneNum } = req.body;
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
        throw new HandleError(400, 'user with this email already exist', 400)
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        address,
        phoneNum,
    });
    const savedUser = await newUser.save()
    const text = `<p>hello ${firstname} you account has been created, welcome to the foodie family</p>`
    await sendMail(email, "Welcome On Board", text)
    res.status(201).json({
        success: true,
        savedUser
    })
});

const loginUser = AllPurposeFunc(async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
        const isValidPass = await bcrypt.compare(password, user.password);
        if (isValidPass) {
            const token = await jwt.sign({ id: user._id}, process.env.JWT_SECRET, { expiresIn: period });
            if (token) {
                let text = `<h1>User Logged into Foody Application</h1>
                  <p> hello ${user.firstname}, you have just logged into your foody account,
                   if you did not authorize this login kindly report to our support team`
                await sendMail(user.email, "successful login", text);
                res.cookie('userToken', token, { maxAge: 1000 * period, httpOnly: true })
                res.status(200).json({
                    success: true,
                    user,
                    token
                })

            } else {
                throw new HandleError(400, 'invalid token', 400)
            }

        }
        else {  
        
            throw new HandleError(400, 'invalid password', 400)
           
            
        }

    }
    else {
        throw new HandleError(400,"invalid email",400)
    }
});



const sendEmailForToUpdatePass = AllPurposeFunc(async (req, res)=> {
    const {email} = req.body;
    const user = await UserModel.findOne({email});
    if(!user) {
        throw new HandleError(400, "user with this email not found ", 400);
    }else{
        await jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: 60 * 5},
            async (err, token) => {
                if (err){
                    throw new HandleError(400, err.message, 400)
                }else{
                    let text = `http://localhost:3200/api/v1/update-password/${user._id}/${token}`
                    console.log(text)
                await sendMail(user.email, "Reset Password Link", text);
                res.status(200).json({
                    success:true,
                    token: token,
                    id: user._id

                })
              }
                
        
            });
    }
});

const getUpdatePassword = AllPurposeFunc(async (req, res) => {
    const { id, token } = req.params;
    res.status(200).render('PasswordInputpage', { id, token });
});


const postUpdatedPassword = AllPurposeFunc(async (req, res) =>{
    const {id, token} = req.params;
    const {password} = req.body;

    await jwt.verify(token, process.env.JWT_SECRET, async (err, verifiedToken) =>{
        console.log(token)
        console.log(password)
        if(err){
            throw new HandleError(400, err.message, 400) 
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const updatedpassword = await UserModel.findOneAndUpdate({_id: id}, {password: hashedPassword});
        res.status(200).json({
            success: true
        })

    } )
      
})


const getCurrentUserFromClientSide = AllPurposeFunc(async (req, res)=> {
    const payload = req.get('Authorization');
    const token = payload.split(' ')[1]
    const verifiedToken = await jwt.verify(token, process.env.JWT_SECRET);
    const loggedInUser = await UserModel.findById(verifiedToken.id);
    
    
    res.status(200).json({
        success: true,
        loggedInUser
    })
})




module.exports = {
    signupUser,
    loginUser,
    postUpdatedPassword,
    getUpdatePassword,
    sendEmailForToUpdatePass,
    getCurrentUserFromClientSide
    
}

