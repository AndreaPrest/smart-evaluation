const codeCompiler = require("../functionalities/codeCompiler")

exports.compileCode = async (req, res, next) => {
    const {code,language} = req.body
    try{
        let result = await codeCompiler.compileCode(code,language)
        res.send(result)
    }
    catch (err) {
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
