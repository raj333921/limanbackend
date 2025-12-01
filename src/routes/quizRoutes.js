const express = require("express");
const { getQuestions, checkAnswer, getQuestionsUnAuth } = require("../controllers/quizController");
const userAuth = require("../middleware/userAuth");
const router = express.Router();

router.get("/liman",userAuth,getQuestionsUnAuth);
router.get("/", userAuth, getQuestions);
router.get('/test', (req, res) => {
    res.send('server is ready');
});

module.exports = router;
