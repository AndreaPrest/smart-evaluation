const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController")
const courseController = require("../controllers/courseController")
const isAuth = require("../middleware/isAuth");
const isAdmin = require("../middleware/isAdmin");

router.post('/add-user',isAuth,isAdmin, userController.createUser)
router.post('/edit-user',isAuth,isAdmin, userController.editUser)
router.post('/edit-course',isAuth,isAdmin, courseController.editCourse)
router.get('/get-users', isAuth,isAdmin, userController.getAllUsers)
router.get('/get-courses', isAuth,isAdmin, courseController.getAllCourses)
router.post('/delete-user',isAuth,isAdmin,userController.deleteUser)
router.post('/delete-course',isAuth,isAdmin,courseController.deleteCourse)
router.post('/add-course',isAuth,isAdmin,courseController.createCourse)


module.exports = router;