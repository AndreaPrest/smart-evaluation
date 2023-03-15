const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController")
const isAuth = require("../middleware/isAuth");

router.get('/get-courses',isAuth, userController.getUserCourses)

module.exports = router;