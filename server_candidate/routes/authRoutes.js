const express = require("express");
const authController = require("../controllers/authController")
const router = express.Router();

router.post('/authenticate' ,authController.authenticate)

module.exports = router;
