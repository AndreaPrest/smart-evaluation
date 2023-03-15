const testModel = require("../models/testModel")
const evaluator = require("../functionalities/questionEvaluator")
const codeCompiler = require("../functionalities/codeCompiler")
require('dotenv').config();

exports.getTest = async (req,res,next) => {
    const { code } = req.body;
    try{

        const test = await testModel.findOne({code: code})

        if(!test)
        {
            const error = new Error("Test Template not present");
            error.statusCode = 409;
            console.log("Test  Error: Unable to create test , test template not present")
            throw error
        }

        if(test.sustained)
        {
            res.json({ type: "results",test: test })
        }
        else if(await codeCompiler.jdoodleAvailable())
        {
            test.sustained = true
            res.json({ type: "test",test:test })
        }
        else
        {
            res.json({type: "warning",message:"System not available"})
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

exports.submitTest = async (req,res,next) => {
    const { test } = req.body;
    try{
        const testPresent = await testModel.findById(test._id)

        if(!testPresent)
        {
            const error = new Error("Test with this code does not exist");
            error.statusCode = 404;
            console.log("Test Error: Test with this code does not exist")
            throw error;
        }

        let evaluatedTest = await evaluator.evaluateQuestions(test)
        await testModel.findByIdAndUpdate(test._id,evaluatedTest)
        console.log("Test Success: Test submitted correctly")
        res.send({"test": evaluatedTest})
    }
    catch (err)
    {
        if(err.code === 'ERR_BAD_REQUEST')
        {
            err.statusCode = 429
            console.log("Test Error: Unable to submit test, jdoodle not available ")
        }
        else
        {
            err.statusCode = 500;
            console.log("Test Error: Unable to submit test, unknown error ")
        }

        next(err);
    }
}