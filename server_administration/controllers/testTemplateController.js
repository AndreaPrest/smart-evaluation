const testTemplateModel = require("../models/testTemplateModel");
const topicModel = require("../models/topicModel");
const courseModel = require("../models/courseModel");

exports.addTestTemplate = async (req, res, next) => {

    const { title,course,creator,template,availableMinutes,passingGrade} = req.body;

    try {

        const testTemplate = await testTemplateModel.findOne({title: title});

        if (testTemplate) {
            const error = new Error("Test Template with this title already present");
            error.statusCode = 409;
            console.log("Test Template Error: Unable to create test template, test template with this name already present ")
            throw error
        }

        const newTestTemplate = new testTemplateModel({ title: title,course:course, creator:creator,template:template,availableMinutes:availableMinutes,passingGrade:passingGrade});

        // save model to database
        newTestTemplate.save(function (err) {
            if (err){
                const error = new Error("Error during insert");
                error.statusCode = 1064;
                console.log("Test Template Error: Unable to create test template, unable to insert test template")
                next(error)
            }
            console.log(newTestTemplate.title + " saved to Test Template collection.");
        });

        res.sendStatus(200)

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        console.log("Test Template Error: Unable to create test template, Unknown error")
        next(err);
    }
};

exports.getTestTemplatesOfCourses = async (req, res, next) => {
    const { courses } = req.body;

    try{
        const testTemplates = await testTemplateModel.find({
            course: {$in: courses}}
        )
        for(const i in testTemplates)
        {
            Object.assign(testTemplates[i], {course: await courseModel.findById(testTemplates[i].course)});
            for(const j in testTemplates[i].template)
            {
                Object.assign(testTemplates[i].template[j], {topic: await topicModel.findById(testTemplates[i].template[j].topic)});
            }
        }

        res.send(testTemplates)
    }
    catch (err)
    {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        console.log("Test Template Error: Unable to get test templates, unknown error ")
        next(err);
    }
}

exports.getPlainTestTemplatesOfCourses = async (req, res, next) => {
    const { courses } = req.body;

    try{
        const testTemplates = await testTemplateModel.find({
            course: {$in: courses}}
        )
        res.send(testTemplates)
    }
    catch (err)
    {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        console.log("Test Template Error: Unable to get test templates, unknown error ")
        next(err);
    }
}

exports.editTestTemplate = async (req, res, next) => {

    const { _id,title,course,creator,template,availableMinutes,passingGrade} = req.body;

    try {

        const testTemplate = await testTemplateModel.findById(_id)

        if (!testTemplate) {
            const error = new Error("test template not present");
            error.statusCode = 409;
            console.log("Test Template Error: Unable to edit test template, test template not present ")
            throw error
        }

        const update = {}

        if(testTemplate.title !== title)
        {
            update.title = title
        }
        if(testTemplate.course !== course)
        {
            update.course = course
        }
        if(testTemplate.creator !== creator)
        {
            update.answers = creator
        }
        if(testTemplate.template !== testTemplate)
        {
            update.template = template
        }
        if(testTemplate.availableMinutes !== availableMinutes)
        {
            update.availableMinutes = availableMinutes
        }
        if(testTemplate.passingGrade !== passingGrade)
        {
            update.passingGrade = passingGrade
        }

        await testTemplateModel.findByIdAndUpdate(_id,update)

        res.sendStatus(200)
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        console.log("Test Template Error: Unable to edit test template, Unknown error")
        next(err);
    }
};

exports.deleteTestTemplate = async (req, res, next) => {
    const { _id } = req.body;

    try{
        testTemplateModel.findByIdAndRemove(_id).then(()=>{
            console.log("Success: test template deleted")
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