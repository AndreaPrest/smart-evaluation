const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const isAuth = require("../middleware/isAuth");

router.post("/login", authController.login);
router.get("/user", isAuth, authController.getUser);
router.delete('/logout',isAuth, authController.logout)

module.exports = router;

