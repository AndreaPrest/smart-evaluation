const questionModel = require("../models/questionModel");
const topicModel = require("../models/topicModel");
const courseModel = require("../models/courseModel");

exports.addQuestion = async (req, res, next) => {

    const { title,question,content,topics,courses,creator,type } = req.body;

    try {

        const newQuestion = new questionModel({ title: title,question: question, content:content,topics:topics,courses:courses, creator:creator, type: type});

        await newQuestion.save(function (err) {

            if (err){
                console.log(err)
                const error = new Error("Error during insert");
                error.statusCode = 1064;
                console.log("Question Error: Unable to create question, unable to insert question in DB")
                next(error)
            }
            else
            {
                console.log(newQuestion.title + " saved to Users collection.");
            }
        });

        await incrementTopicQuestionsCount(topics)

        res.sendStatus(200)
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        console.log("Question Error: Unable to create question, Unknown error")
        next(err);
    }
};
exports.editQuestion = async (req, res, next) => {

    const { _id,title,question,content,topics,courses,creator } = req.body;

    try {

        const questionObj = await questionModel.findById(_id)

        if (!questionObj) {
            const error = new Error("question not present");
            error.statusCode = 409;
            console.log("Question Error: Unable to edit question, question not present ")
            throw error
        }

        const update = {}

        if(questionObj.title !== title)
        {
            update.title = title
        }
        if(questionObj.question !== question)
        {
            update.question = question
        }
        if(questionObj.content !== content)
        {
            update.content = content
        }
        if(questionObj.topics !== topics)
        {
            update.topics = topics
        }
        if(questionObj.courses !== courses)
        {
            update.courses = courses
        }
        if(questionObj.creator !== creator)
        {
            update.creator = creator
        }
        await questionModel.findByIdAndUpdate(_id,update)

        res.sendStatus(200)
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        console.log("Question Error: Unable to create question, Unknown error")
        next(err);
    }
};
exports.getQuestionsOfCourses = async (req, res, next) => {

    const { courses } = req.body;

        try{
            const questions = []
            const question = await questionModel.find({
                courses: {$in : courses}}
            )
            questions.push(await getQuestionWithTopics(question))
            questions.push(await getQuestionWithCourses(question))
            console.log("Success: all questions sent")
            res.send(questions)
        }
        catch (err)
        {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            console.log("User Error: Unable to get all questions, unknown error ")
            next(err);
        }
};
exports.getQuestionsOfUser = async (req, res, next) => {

    const { email } = req.body;

        try{
            const questions = []
            const question = await questionModel.find({creator: email}
            )
            questions.push(await getQuestionWithTopics(question))
            questions.push(await getQuestionWithCourses(question))
            console.log("Success: all questions sent")
            res.send(questions)
        }
        catch (err)
        {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            console.log("User Error: Unable to get all questions, unknown error ")
            next(err);
        }
};
exports.getQuestionById = async (req, res, next) => {

    const { id } = req.body;

        try{
            const question = await questionModel.find({_id: id}
            )
            res.send(question)
        }
        catch (err)
        {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            console.log("User Error: Unable to get all questions, unknown error ")
            next(err);
        }
};
exports.deleteQuestion = async (req, res, next) => {
    const { _id } = req.body;
    const topics = await questionModel.findById(_id).select('topics')
    try{
        questionModel.findByIdAndRemove(_id).then(async ()=>{
            await decrementTopicQuestionsCount(topics.topics)
            console.log("Success: question deleted")
            res.sendStatus(200)
        })
    }
    catch(err){
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        console.log("Question Error: Unable to delete question, unknown error ")
        next(err);
    }
}

async function getQuestionWithTopics(question){
    for(const i in question)
    {
        if(question[i].topics.length > 0)
            question[i].topics = await topicModel.find({_id: question[i].topics})
    }

    return question
}
async function getQuestionWithCourses(question){
    for(const i in question)
    {
        if(question[i].courses.length > 0)
            question[i].courses = await courseModel.find({_id: question[i].courses})
    }

    return question
}
async function incrementTopicQuestionsCount(topicsId) {
    for (const topicId of topicsId) {
        try {
            await topicModel.findOneAndUpdate({_id: topicId}, {$inc: {'questionsNumber': 1}})
        } catch (e) {
            throw e;
        }
    }
}
async function decrementTopicQuestionsCount(topicsId){
    for (const topicId of topicsId) {
        try{
            await topicModel.findOneAndUpdate({_id :topicId}, {$inc : {'questionsNumber' : -1}})
        }
        catch(e)
        {
            throw e;
        }
    }
}