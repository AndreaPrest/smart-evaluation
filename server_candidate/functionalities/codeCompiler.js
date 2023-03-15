const axios = require("axios");
const codeCompiler = require("../controllers/codeController");
require('dotenv').config();

exports.compileCode = async function (code,language = "cpp17") {

    let program = {
        script: code,
        language: language,
        versionIndex: "0",
        clientId: process.env.JDOODLE_CLIENT_ID,
        clientSecret: process.env.JDOODLE_CLIENT_SECRET
    };
        try{
            let result =  await axios.post(process.env.JDOODLE_API, program);
            return result.data
        }
        catch(e)
        {
            throw e;
        }
}

exports.getFullTestCodeCpp = function(code) {
    return "int main(){ " + code + " return 0;}"
}

exports.jdoodleAvailable = async (req, res, next) => {

    const code = "int main(){ return 0;}"
    const language = "cpp17"
    let result = await this.compileCode(code,language)
    return result.statusCode === 200;
}
