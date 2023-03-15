const Crypto = require('crypto-js');
const testTemplateModel = require("../models/testTemplateModel");
const questionModel = require("../models/questionModel")
const testModel = require("../models/testModel")
const topicModel = require("../models/topicModel")
require('dotenv').config();

exports.getTestsOfCourses = async (req,res,next) => {
    const { courses } = req.body;
    try{
        const tests = await testModel.find({
            course: {$in: courses}}
        )
        for(const i in tests)
        {
            Object.assign(tests[i], {template: await testTemplateModel.findById(tests[i].template)});
        }
        res.send(tests)
    }
    catch (err)
    {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        console.log("Test Error: Unable to get tests, unknown error ")
        next(err);
    }
}

exports.deleteTest = async (req,res,next) => {
    const { _id } = req.body;

    try{
        testModel.findByIdAndRemove(_id).then(()=>{
            console.log("Success: test deleted")
            res.sendStatus(200)
        })
    }
    catch(err){
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        console.log("Test Error: Unable to delete test, unknown error ")
        next(err);
    }
}
exports.addTests = async (req, res, next) => {
    const { testTemplateId,quantity } = req.body;

    const validFor = 30

    try {
        const testTemplate = await testTemplateModel.findById(testTemplateId)

        if (!testTemplate) {
            const error = new Error("Test Template not present");
            error.statusCode = 409;
            console.log("Test  Error: Unable to create test , test template not present")
            throw error
        }

        for (let i = 0; i < quantity; i++) {
            // Codice
            const availableMinutes = testTemplate.availableMinutes
            const passingGrade = testTemplate.passingGrade
            const code = await getHashValue()
            //Course
            const course = testTemplate.course
            //CreatedAt
            const creationDate = new Date()
            const expirationDate = getExpirationDate(validFor)
            // Test
            let test = []
            let questionId = 0
            for (let i in testTemplate.template) {
                let template = testTemplate.template[i]
                let questions = await getNRandomQuestions(template.topic, template.questionNumber)
                for (let j = 0; j < template.questionNumber; j++) {
                    const question = {}
                    question.questionId = questionId
                    question.response = null
                    question.evaluation = null
                    question.question = questions[j]
                    question.type = questions[j].type
                    question.value = (100 / template.questionNumber) * (template.questionValue / 100)
                    test.push(question)
                    questionId += 1
                }
            }
            questionId = 0

            const newTest = new testModel({code:code,course:course,template:testTemplateId,creationDate:creationDate,expirationDate:expirationDate,test:test,sustained:false,finalEvaluation:0,availableMinutes:availableMinutes,passingGrade:passingGrade})
            newTest.save(function (err) {
                if (err){
                    const error = new Error("Error during insert");
                    error.statusCode = 1064;
                    console.log("Test Error: Unable to create test, unable to insert test in DB")
                    next(error)
                }
                console.log("Test saved to Test Template collection.");
            });

        }
        res.sendStatus(200)
    }
    catch  (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        console.log("Test Error: Unable to create test  Unknown error")
        next(err);
    }

}

function getHashValue()
{

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let time = new Date().getTime().toString()
            let code = Crypto.HmacSHA1(time, process.env.CRYPTO_KEY).toString()
            resolve(code);
        }, 1);
    });

}

async function getNRandomQuestions(topic,n) {
    //let questions = await questionModel.find({'topics': topics})
    let questions = await questionModel.find({'topics': {$elemMatch: {$eq: topic}}})
    if(questions.length < n)
    {
        const error = new Error("Not enough questions for this test");
        error.statusCode = 407;
        console.log("Test Error: Unable to create test, not enough questions ")
        throw error
    }
    else
    {
        return questions.sort(function(){return .5 - Math.random()}).slice(0,n)
    }
}

function getExpirationDate(days)
{
    const now = new Date()
    now.setDate(now.getDate() + days)
    return now
}