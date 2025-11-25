const express = require("express");
const { getQuestions, checkAnswer } = require("../controllers/quizController");
const userAuth = require("../middleware/userAuth");
const router = express.Router();

router.get("/", userAuth, getQuestions);
router.post("/check", userAuth, checkAnswer);
router.get('/test', (req, res) => {
    res.send('server is ready');
});

module.exports = router;
