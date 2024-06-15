const adminRouter = require('express').Router();

const {signupAdmin, loginAdmin, adminSignupRider, loginRider,
    getCurrentAdminFromClientSide,
    getCurrentRiderFromClientSide} = require('../controller/adminController');




adminRouter.post('/signup-admin', signupAdmin);
adminRouter.post('/login-admin', loginAdmin)
adminRouter.post('/signup-rider', adminSignupRider)
adminRouter.post('/login-rider', loginRider);
adminRouter.get('current-admin', getCurrentAdminFromClientSide );
adminRouter.get('/current-rider', getCurrentRiderFromClientSide )




module.exports = adminRouter
