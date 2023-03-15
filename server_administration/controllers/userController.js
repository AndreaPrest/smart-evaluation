const userModel = require("../models/userModel");
const courseModel = require("../models/courseModel");
const bcrypt = require("bcryptjs");
const {ObjectID: ObjectId} = require("mongodb");
exports.createUser = async (req, res, next) => {

    const { email, password, roles, courses } = req.body;

    try {

        const user = await userModel.findOne({email: email});

        if (user) {
            const error = new Error("user with this email already present");
            error.statusCode = 409;
            console.log("User Error: Unable to create user,user with this email already present ")
            throw error;
        }
        const encryptedPassword = await bcrypt.hash(password, 12);
        const newUser = new userModel({ email: email, password: encryptedPassword, roles: roles, courses: courses });

        // save model to database
        newUser.save(function (err) {
            if (err){
                const error = new Error("Error during insert");
                error.statusCode = 1064;
                console.log("User Error: Unable to create user,database error ")
                throw error;
            }
            console.log(newUser.email + " saved to Users collection.");
        });

        res.sendStatus(200)
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        console.log("User Error: Unable to create user, unknown error ")
        next(err);
    }
};

exports.getAllUsers = async (req, res, next) => {

    try{
        const users = await userModel.find().select(['email','roles','courses'])
        for(const i in users)
        {
            Object.assign(users[i], {courses: await courseModel.find({_id:users[i].courses})});
        }
        console.log("Success: all users sent")
        res.send(users)
    }
    catch (err)
    {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        console.log("User Error: Unable to get all users, unknown error ")
        next(err);
    }

}

exports.deleteUser = async (req, res, next) => {
    const { _id } = req.body;
    try{
        userModel.findByIdAndRemove({_id:_id}).then(()=>{
            console.log("Success: user deleted")
            res.sendStatus(200)
        })
    }
    catch(err){
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        console.log("User Error: Unable to delete user, unknown error ")
        next(err);
    }
}

exports.editUser = async (req, res, next) => {

    const { oldEmail, email, password, roles, courses } = req.body;

    try {

        const user = await userModel.findOne({email: oldEmail});

        if (!user) {
            const error = new Error("user not present");
            error.statusCode = 409;
            console.log("User Error: Unable to edit user, user not present")
            throw error;
        }
        const encryptedPassword = await bcrypt.hash(password, 12);

        const update = {}

        if(email !== "" && user.email !== email)
        {
            update.email = email
        }
        if(roles.length !== 0 && user.roles !== roles)
        {
            update.roles = roles
        }
        if(user.courses !== courses)
        {
            update.courses = courses
        }
        if(password !== "" && user.password !== encryptedPassword)
        {
            update.password = encryptedPassword
        }

        await userModel.findOneAndUpdate({email: oldEmail}, update);

        console.log("Success: user edited")
        res.sendStatus(200)
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        console.log("User Error: Unable to edit user, unknown error ")
        next(err);
    }
};

exports.getUserCourses = async (req, res, next) => {

    const email  = res.locals.email;

    try{
        const user = await userModel.findOne({email:email})

        if (!user) {
            const error = new Error("user not present");
            error.statusCode = 409;
            console.log("User Error: Unable to get user courses, user not present")
            throw error;
        }
        const userCourses = []

        for(const i in user.courses)
        {
            const course = await courseModel.findById(user.courses[i])
            userCourses.push(course)
        }
        res.send(userCourses)

    }
    catch (err)
    {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        console.log("User Error: Unable to get user courses, unknown error ")
        next(err);
    }

}

