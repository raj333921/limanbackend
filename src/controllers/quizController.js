const pool = require("../config/db");
const fs = require("fs");
const path = require("path");

exports.getQuestionsUnAuth = async (req, res) => {
  const { lang = "en" } = req.query;

  try {
    const easyQuery = await pool.query(
      `SELECT id, 'easy' AS level, (question->0->>$1) AS question, options, correct_option, explanation,image_path
       FROM easy_questions
       ORDER BY RANDOM()
       LIMIT 5`,
      [lang]
    );

    const hardQuery = await pool.query(
      `SELECT id, 'hard' AS level, (question->0->>$1) AS question, options, correct_option, explanation, image_path
       FROM hard_questions
       ORDER BY RANDOM()
       LIMIT 45`,
      [lang]
    );
    const allQuestions = [...easyQuery.rows, ...hardQuery.rows].map(q => {
        // Fix options if stored as string
        const options = typeof q.options === "string" ? JSON.parse(q.options) : q.options;
        // Convert image to base64
        let image_base64 = null;
        if (q.image_path) {
            try {
                const imageFullPath = path.join(__dirname, "../..", q.image_path);
                if (fs.existsSync(imageFullPath)) {
                    const fileBuffer = fs.readFileSync(imageFullPath);
                    const ext = q.image_path.split(".").pop().toLowerCase();
                    image_base64 = `data:image/${ext};base64,${fileBuffer.toString("base64")}`;
                }
            } catch (err) {
                console.error("Base64 conversion error:", err);
            }
        }

        return {
            ...q,
            options,
            image_base64
        };
    });
    res.json(allQuestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getQuestions = async (req, res) => {
  const { lang = "en" } = req.query;

  try {
    const easyQuery = await pool.query(
      `SELECT id, 'easy' AS level, (question->0->>$1) AS question, options, correct_option, explanation,image_path
       FROM easy_questions`,
      [lang]
    );

    const hardQuery = await pool.query(
      `SELECT id, 'hard' AS level, (question->0->>$1) AS question, options, correct_option, explanation,image_path
       FROM hard_questions`,
      [lang]
    );
    const allQuestions = [...easyQuery.rows, ...hardQuery.rows].map(q => {
        // Fix options if stored as string
        const options = typeof q.options === "string" ? JSON.parse(q.options) : q.options;
        // Convert image to base64
        let image_base64 = null;
        if (q.image_path) {
            try {
                const imageFullPath = path.join(__dirname, "../..", q.image_path);
                if (fs.existsSync(imageFullPath)) {
                    const fileBuffer = fs.readFileSync(imageFullPath);
                    const ext = q.image_path.split(".").pop().toLowerCase();
                    image_base64 = `data:image/${ext};base64,${fileBuffer.toString("base64")}`;
                }
            } catch (err) {
                console.error("Base64 conversion error:", err);
            }
        }

        return {
            ...q,
            options,
            image_base64
        };
    });
    res.json(allQuestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkAnswer = async (req, res) => {
  const { level, questionId, selectedOption } = req.body;
  const table = level === "hard" ? "hard_questions" : "easy_questions";

  try {
    const result = await pool.query(`SELECT correct_option FROM ${table} WHERE id=$1`, [questionId]);
    if (result.rows.length === 0) return res.status(400).json({ message: "Question not found" });

    const isCorrect = result.rows[0].correct_option === selectedOption;
    let score = 0;
    if (level === "easy") score = isCorrect ? 1 : -1;
    if (level === "hard") score = isCorrect ? 1 : -5;

    res.json({ correct: isCorrect, score });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
