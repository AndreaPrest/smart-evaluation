const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
require('dotenv').config();

let loadedUser;
exports.login = async (req, res, next) => {
    console.log("Try to login")
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email: email });

        if (!user) {
            console.log("Invalid login: User with this email not found!")
            const error = new Error("user with this email not found!");
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        const comparePassword = await bcrypt.compare(password, user.password)

        if (!comparePassword) {
            console.log("Invalid login: Password don't match!")
            const error = new Error("password is not match!");
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({ email: loadedUser.email }, process.env.JWT_KEY, {
            expiresIn: '2h'
        });

        console.log("Login Success: User: "+ email)
        res.status(200).json({ token: token });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getUser = (req, res, next) => {
    if(loadedUser){
        res.status(200).json({
            user: {
                email: loadedUser.email,
                roles: loadedUser.roles,
                course: loadedUser.course
            },
        });
    }
    else
    {
        res.status(500)
    }
};

exports.logout = (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                console.log("Invalid logout: error")
                res.status(400).send('Unable to log out')
            } else {
                console.log("Success: User Logged out!")
                res.send('Logout successful')
            }
        });
    } else {
        res.end()
    }
}

