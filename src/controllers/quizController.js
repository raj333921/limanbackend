const pool = require("../config/db");

exports.getQuestions = async (req, res) => {
  const { level, lang } = req.query; // level=easy/hard, lang=en/fr/nl
  const table = level === "hard" ? "hard_questions" : "easy_questions";
  try {
    const result = await pool.query(
      `SELECT id, question->>$1 AS question, options FROM ${table} ORDER BY RANDOM() LIMIT 5`,
      [lang]
    );
    res.json(result.rows);
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
