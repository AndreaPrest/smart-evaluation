const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const isStaff = require("../middleware/isStaff");
const testTemplateController = require("../controllers/testTemplateController");
const testController = require("../controllers/testController");

router.post('/get-test-templates', isAuth,isStaff,testTemplateController.getPlainTestTemplatesOfCourses)
router.post('/add-test',isAuth,isStaff,testController.addTests)
router.post('/get-tests',isAuth,isStaff,testController.getTestsOfCourses)
router.post('/delete-test',isAuth,isStaff,testController.deleteTest)

module.exports = router;