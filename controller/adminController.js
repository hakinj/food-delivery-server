const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { AllPurposeFunc } = require('../utils/AllPurposeFunc');
const { HandleError } = require('../utils/error');
const { AdminModel } = require('../model/adminModel')
const { RiderModel } = require('../model/riderModel');
const { sendMail } = require('../utils/sendMails');

const period = 60 * 60 * 24;

const signupAdmin = AllPurposeFunc(async (req, res) => {
    const { name, email, password, role } = req.body;
    const adminExist = await AdminModel.findOne({ email });
    if (adminExist) {
        throw new HandleError(400, 'admin with this email already existed', 400);

    }
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const newAdmin = AdminModel.create({ name, email, password: hashedPass, role });
    const text = `<p>hello ${name} you account has been created, welcome to the foodie family</p>`
    await sendMail(email, "Welcome On Board", text)

    res.status(201).json({
        success: true,
        newAdmin
    });


});

const loginAdmin = AllPurposeFunc(async (req, res) => {
    const { email, password } = req.body;
    const admin = await AdminModel.findOne({ email });
    if (admin) {
        const validPass = await bcrypt.compare(password, admin.password);
        if (validPass) {
            const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: period });
            if (token) {
                let text = `<h1> Admin Access Granted </h1>
                           <p> Hello ${admin.name}  you just login with your credentials,
                           if you did not authorize this login kindly report to the support team immediately
                           before you account is being hacked</p>`;

                await sendMail(admin.email, 'login Successful', text);
                res.cookie('adminToken', token, { maxAge: 1000 * period, httpOnly: true });
                res.status(200).json({
                    success: true,
                    admin,
                    token
                });
            } else {
                throw new HandleError(400, 'invalid token', 400);
            }


        } else {
            throw new HandleError(400, "invalid password", 400)
        }
    } else {
        throw new HandleError(400, "invalid email", 400)
    }
});

const logoutAdmin = AllPurposeFunc(async (req, res) => {
    res.cookie('adminToken', "", { maxAge: 0 });
    res.redirect('/api/v1/login-admin');
});

const adminSignupRider = AllPurposeFunc(async (req, res) => {
    const { name, email, phoneNum, password, ridePlateNum, rideType } = req.body;
    const user = await RiderModel.findOne({ email });
    if (user) {
        throw new HandleError(400, 'rider already exist', 400);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedpass = await bcrypt.hash(password, salt);
    const newRider = new RiderModel({
        name, email, phoneNum, password: hashedpass, ridePlateNum, rideType

    })
    const savedRider = await newRider.save()
    const savedDetails = await RiderModel.findOne({ email })
    if (savedDetails) {
        const text = `<p>hello ${savedDetails.name} you account has been created Successfully, welcome to the CookAway family
                    we are excited to have you on board as our delivery rider. Below is your login details <br>
                    username: ${savedDetails.email}, <br> password: ${savedDetails.password} <br> click here to navigate to login page,
                    click forget password to change your password and then login <br>
                      </p>`
        await sendMail(savedDetails.email, "Welcome On Board", text)

    };


    res.status(201).json({
        success: true,
        data: savedRider
    });
});

const loginRider = AllPurposeFunc(async (req, res) => {
    const { email, password } = req.body;
    const rider = await RiderModel.findOne({ email });
    if (rider) {
        const validPassword = await bcrypt.compare(password, rider.password);
        if (validPassword) {
            const token = jwt.sign({ id: rider._id }, process.env.JWT_SECRET, { expiresIn: period });
            console.log(token)
            if (token) {
                let text = `${rider.name}, <p>you just login into your CookAway rider account 
                if you did not authorize this login please report to the support team immediately</p>`
                await sendMail(rider.email, 'Your have login into your Account Successfuly ', text);
                res.cookie('riderToken', token, { maxAge: 1000 * period, httpOnly: true });
                res.status(200).json({
                    success: true,
                    rider,
                    token
                })
            } else {
                throw new HandleError(400, 'invalid token', 400);

            }

        } else {
            throw new HandleError(400, 'invalid password ', 400)
        }

    } else {
        throw new HandleError(400, 'invalid email', 400);
    }
});

const logoutRider = AllPurposeFunc(async (req, res) => {
    res.cookie('riderToken', "", { maxAge: 0 });
    res.redirect('/api/v1/login-admin');
});

const getCurrentAdminFromClientSide = AllPurposeFunc(async (req, res)=> {
    const payload = req.get('Authorization');
    const token = payload.split(' ')[1]
    const verifiedToken = await jwt.verify(token, process.env.JWT_SECRET);
    const loggedInUser = await AdminModel.findById(verifiedToken.id);
    
    
    res.status(200).json({
        success: true,
        loggedInUser
    })
});

const getCurrentRiderFromClientSide = AllPurposeFunc(async (req, res)=> {
    const payload = req.get('Authorization');
    const token = payload.split(' ')[1]
    const verifiedToken = await jwt.verify(token, process.env.JWT_SECRET);
    const loggedInUser = await RiderModel.findById(verifiedToken.id);
    
    
    res.status(200).json({
        success: true,
        loggedInUser
    })
})



module.exports = {
    signupAdmin,
    loginAdmin,
    adminSignupRider,
    logoutAdmin,
    loginRider,
    logoutAdmin,
    getCurrentRiderFromClientSide,
    getCurrentAdminFromClientSide
}