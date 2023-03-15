const request = require('request');
const axios = require("axios");
const {stringify} = require("nodemon/lib/utils");
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
    catch (e) {
        return e
    }

}

