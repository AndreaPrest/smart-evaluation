const express = require("express");
const router = express.Router();
const topicController = require("../controllers/topicController")
const questionController = require("../controllers/questionsController")
const testTemplateController = require("../controllers/testTemplateController")
const codeController = require("../controllers/codeController")
const isAuth = require("../middleware/isAuth");
const isEval = require("../middleware/isEval");

router.get('/get-topics-tree',isAuth,isEval, topicController.getTopicTree)
router.get('/get-topics-list',isAuth,isEval, topicController.getTopicList)
router.post('/get-test-templates', isAuth,isEval,testTemplateController.getTestTemplatesOfCourses)
router.post('/delete-test-template', isAuth,isEval,testTemplateController.deleteTestTemplate)
router.post('/add-topic', isAuth,isEval,topicController.insertTopic)
router.post('/delete-topic', isAuth,isEval,topicController.deleteTopic)
router.post('/delete-question', isAuth,isEval,questionController.deleteQuestion)
router.post('/edit-topic', isAuth,isEval,topicController.editTopic)
router.post('/add-question', isAuth,isEval,questionController.addQuestion)
router.post('/add-test-template', isAuth,isEval,testTemplateController.addTestTemplate)
router.post('/edit-test-template', isAuth,isEval,testTemplateController.editTestTemplate)
router.post('/edit-question', isAuth,isEval,questionController.editQuestion)
router.post('/get-questions-from-courses',questionController.getQuestionsOfCourses)
router.post('/get-questions-of-user',isAuth,isEval,questionController.getQuestionsOfUser)
router.post('/get-question-by-id',isAuth,isEval,questionController.getQuestionById)
router.post("/compile-code",isAuth,isEval,codeController.compileCode)

module.exports = router;