// controllers/scoreController.js
const pool = require("../config/db");


// ➤ INSERT SCORE
const addScore = async (req, res) => {
  try {
    const { email, score, type } = req.body;

    if (!email || !score || !type) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const query = `
      INSERT INTO score_card (email, score, type)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const values = [email, score, type];

    const result = await pool.query(query, values);

    res.status(201).json({
      message: 'Score added successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error adding score:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// ➤ GET SCORES BY EMAIL
const getScoresByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const query = `
      SELECT * FROM score_card
      WHERE email = $1
      ORDER BY created_at DESC;
    `;

    const result = await pool.query(query, [email]);

    res.status(200).json({
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching scores:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addScore,
  getScoresByEmail,
};