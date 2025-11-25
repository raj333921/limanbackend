const pool = require("../config/db");
const upload = require("../utils/multerConfig");

// Add question
exports.addQuestion = async (req, res) => {
  const { level, question, options, correct_option } = req.body;
  const table = level === "hard" ? "hard_questions" : "easy_questions";
  let image_path = req.file ? req.file.path : null;

  try {
    await pool.query(
      `INSERT INTO ${table} (question, options, correct_option, image_path) VALUES ($1,$2,$3,$4)`,
      [question, options, correct_option, image_path]
    );
    res.json({ message: "Question added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Edit question
exports.editQuestion = async (req, res) => {
  const { id } = req.params;
  const { level, question, options, correct_option } = req.body;
  const table = level === "hard" ? "hard_questions" : "easy_questions";
  let image_path = req.file ? req.file.path : null;

  try {
    await pool.query(
      `UPDATE ${table} SET question=$1, options=$2, correct_option=$3, image_path=COALESCE($4,image_path) WHERE id=$5`,
      [question, options, correct_option, image_path, id]
    );
    res.json({ message: "Question updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete question
exports.deleteQuestion = async (req, res) => {
  const { level, id } = req.params;
  const table = level === "hard" ? "hard_questions" : "easy_questions";
  try {
    await pool.query(`DELETE FROM ${table} WHERE id=$1`, [id]);
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
