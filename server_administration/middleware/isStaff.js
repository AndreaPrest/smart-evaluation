const userModel = require("../models/userModel");
module.exports = async (req, res, next) => {
    try{
        const user = await userModel.findOne({'email': res.locals.email})
        if(!user.roles.includes("Staff"))
        {
            const err = new Error("Not authenticated.");
            err.statusCode = 401;
            next(err);
        }
        next()
    }
    catch(error){
        error.statusCode = 500;
        throw error;
    }
}