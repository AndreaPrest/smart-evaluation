const courseModel = require("../models/courseModel");
const userModel = require("../models/userModel");
const {ObjectID: ObjectId} = require("mongodb");

exports.getAllCourses = async (req, res, next) => {

    try{
        const courses = await courseModel.find().select(['_id','name'])
        res.send(courses)
    }
    catch (err)
    {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}


exports.deleteCourse = async (req, res, next) => {
    const { _id } = req.body;
    try{
        courseModel.findByIdAndRemove({_id:_id}).then(()=>{
            userModel.updateMany({courses: _id}, { $pull: { courses: _id}}).then(()=>{
                console.log("Success: Course deleted")
                res.sendStatus(200)
            })
        })
    }
    catch(err){
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        console.log("Course Error: Unable to delete course")
        next(err);
    }

}

exports.createCourse = async (req, res, next) => {

    const { name } = req.body;

    try {

        const course = await courseModel.findOne({name: name});

        if (course) {
            const error = new Error("course with this name already present");
            error.statusCode = 409;
            console.log("Course Error: Unable to create course, course with this name already present ")
            throw error
        }

        const newCourse = new courseModel({ name: name});

        // save model to database
        newCourse.save(function (err) {
            if (err){
                const error = new Error("Error during insert");
                error.statusCode = 1064;
                console.log("Course Error: Unable to create course, unable to insert course")
                throw error
            }
            console.log(newCourse.name + " saved to Users collection.");
        });

        res.sendStatus(200)
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        console.log("Course Error: Unable to create course, Unknown error")
        next(err);
    }
};


exports.editCourse = async (req, res, next) => {

    const { name, _id } = req.body;

    try {

        const course = await courseModel.findById(_id)

        if (!course) {
            const error = new Error("course not present");
            error.statusCode = 409;
            console.log("Course Error: Unable to edit course, course not present")
            throw error
        }

        const update = {}

        if(course.name !== name)
        {
            update.name = name
        }
        courseModel.findByIdAndUpdate(_id, update).then(()=>{
            res.sendStatus(200)
            console.log("Success: Course Edited")

        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        console.log("Course Error: Unable to edit course, unknown error")
        next(err);

    }
};