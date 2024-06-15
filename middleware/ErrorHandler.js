const { HandleError } = require('../utils/error')

function ErrorHandler(error, req, res, next) {
    let errors = { email: "", password: "", name:"" }
    if (error instanceof HandleError) {
        if (error.message === 'invalid password') {
            errors.password = 'you have entered a wrong password'
            return res.json({
                success: false,
                error: errors
            })
        }

        if (error.message === 'invalid email') {
            errors.email = 'this email does not exist'
            return res.json({
                success: false,
                error: errors

            })
        }
        if (error.message === "food already exist"){
            errors.food = "this food already exist in the database"
            return res.json({
                success: false,
                error:errors
            })
        }

    }
    else {
        return res.status(400).json({
            success: false,
             error: error.message
        })

    }


};

module.exports = ErrorHandler 