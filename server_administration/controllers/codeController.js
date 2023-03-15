const codeCompiler = require("../functionalities/codeCompiler")
exports.compileCode = async (req, res, next) => {
    const {code,language} = req.body
    let result = await codeCompiler.compileCode(code,language)
    res.send(result)
}