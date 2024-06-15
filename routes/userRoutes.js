const userRouter = require('express').Router();
const { signupUser,
    loginUser,
    sendEmailForToUpdatePass,
    getUpdatePassword,
    postUpdatedPassword,
    getCurrentUserFromClientSide } = require('../controller/userController');



userRouter.post('/signup-user', signupUser);
userRouter.post('/login-user', loginUser);
userRouter.post('/sendresetlink', sendEmailForToUpdatePass)
userRouter.get('/update-password/:id/:token', getUpdatePassword)
userRouter.put('/update-password/:id/:token', postUpdatedPassword)
userRouter.get('/current-user', getCurrentUserFromClientSide)



module.exports = userRouter;

