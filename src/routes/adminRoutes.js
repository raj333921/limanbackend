const express = require("express");
const { addQuestion, editQuestion, deleteQuestion, getQuestionById} = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");
const upload = require("../utils/multerConfig");
const router = express.Router();

router.post("/question", adminAuth, upload.single("image"), addQuestion);
router.put("/question/:id", adminAuth, upload.single("image"), editQuestion);
router.delete("/question/:level/:id", adminAuth, deleteQuestion);
router.get("/question/:id", adminAuth, getQuestionById);

module.exports = router;
