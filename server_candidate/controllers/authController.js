const testModel = require("../models/testModel")
const jwt = require('jsonwebtoken')
require('dotenv').config();

exports.authenticate = async (req, res, next) => {
    const { code } = req.body;
    try{
        const test = await testModel.findOne({code: code})

        if(!test)
        {
            const error = new Error("Test with this code does not exist");
            error.statusCode = 404;
            console.log("Test Error: Test with this code does not exist")
            throw error;
        }
        else if(test.expirationDate === new Date())
        {
            const error = new Error("Test with this code is expired");
            error.statusCode = 402;
            console.log("Test Error: Test with this code is expired")
            throw error;
        }
        else
        {
            const token = jwt.sign({ test }, process.env.JWT_KEY, { expiresIn: '1h' })

            res.json({ token })
        }
    }
    catch (err)
    {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        console.log("Test Error: Unable to get test, unknown error ")
        next(err);
    }
}