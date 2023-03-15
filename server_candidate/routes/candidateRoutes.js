const express = require("express");
const testController = require("../controllers/testController");
const codeController = require("../controllers/codeController");
const sqlController = require("../controllers/sqlController")
const isAuth = require("../middleware/isAuth")
const router = express.Router();

router.post('/get-test' ,isAuth, testController.getTest)
router.post('/submit-test', isAuth, testController.submitTest)
router.post('/compile-code', isAuth, codeController.compileCode)
router.post('/check-query', isAuth, sqlController.checkQuery)

module.exports = router;
