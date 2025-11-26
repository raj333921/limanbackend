const pool = require("../config/db");
const upload = require("../utils/multerConfig");
const fs = require("fs");
const path = require("path");

// Add question
exports.addQuestion = async (req, res) => {
  const { level, question, options, correct_option, explanation} = req.body;
  const table = level === "hard" ? "hard_questions" : "easy_questions";
  let image_path = req.file ? req.file.path : null;
  try {
   console.log(table);
    await pool.query(
      `INSERT INTO ${table} (question, options, correct_option, image_path, type, explanation) VALUES ($1,$2,$3,$4,$5,$6)`,
      [question, options, correct_option, image_path, level,explanation]
    );
    res.json({ message: "Question added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Edit question
exports.editQuestion = async (req, res) => {
  const { id } = req.params;
  const { level, question, options, correct_option, explanation} = req.body;
  const table = level === "hard" ? "hard_questions" : "easy_questions";

  try {
    // Get the old image path
    const oldResult = await pool.query(`SELECT image_path FROM ${table} WHERE id=$1`, [id]);
    const oldImage = oldResult.rows[0]?.image_path;

    // New image path
    const newImage = req.file ? req.file.path : oldImage;

    await pool.query(
      `UPDATE ${table} SET question=$1, options=$2, correct_option=$3, image_path=$4, type=$5, explanation=$6  WHERE id=$7`,
      [question, options, correct_option, newImage, level,explanation, id]
    );

    // Delete old image if replaced
    if (req.file && oldImage && fs.existsSync(oldImage)) {
      fs.unlinkSync(oldImage);
    }

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
    // Get the image path
    const result = await pool.query(`SELECT image_path FROM ${table} WHERE id=$1`, [id]);
    const imagePath = result.rows[0]?.image_path;

    // Delete from DB
    await pool.query(`DELETE FROM ${table} WHERE id=$1`, [id]);

    // Delete the file
    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getQuestionById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `SELECT *, image_path FROM easy_questions WHERE id = $1
             UNION ALL
             SELECT *, image_path FROM hard_questions WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0)
            return res.status(404).json({ message: "Not found" });

        const question = result.rows[0];

        if (question.image_path) {
            // Use process.cwd() to get the current working directory of the Node process
            const imageFullPath = path.join(process.cwd(), question.image_path);

            if (fs.existsSync(imageFullPath)) {
                const imageData = fs.readFileSync(imageFullPath);
                question.image_base64 = `data:image/jpeg;base64,${imageData.toString("base64")}`;
            } else {
                console.warn("Image not found:", imageFullPath);
                question.image_base64 = null;
            }
        }

        res.json(question);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};