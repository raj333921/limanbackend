const pool = require("../config/db");

/**
 * CREATE activation code (Admin)
 */
exports.createActivationCode = async (req, res) => {
  const { code, email, comp } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO activation_codes (code, email, company)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [code.trim().toUpperCase(), email.trim().toLowerCase(), comp.trim().toLowerCase()]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * READ all activation codes (Admin)
 */
exports.getActivationCodes = async (req, res) => {
 const comp = req.headers["comp"];
  try {
    const result = await pool.query(
      `SELECT * FROM activation_codes WHERE company = $1 ORDER BY created_at DESC`, [comp]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * UPDATE activation code (Admin)
 * Example: mark used / update email
 */
exports.updateActivationCode = async (req, res) => {
  const { id } = req.params;
  const { is_used, email} = req.body;
  try {
    const result = await pool.query(
      `UPDATE activation_codes
       SET is_used = COALESCE($1, is_used),
           email = COALESCE($2, email)
       WHERE id = $3
       RETURNING *`,
      [is_used, email?.trim().toLowerCase(), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Activation code not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * DELETE activation code (Admin)
 */
exports.deleteActivationCode = async (req, res) => {
  const { id } = req.params;
  const comp = req.headers["comp"];
  try {
    const result = await pool.query(
      `DELETE FROM activation_codes WHERE id = $1 and company = $2`,
      [id, comp]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Activation code not found" });
    }

    res.json({ message: "Activation code deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getActivationCodeById = async (req, res) => {
  const { id } = req.params;
  const comp = req.headers["comp"];
  try {
    const result = await pool.query(
      `select * FROM activation_codes WHERE id = $1 and company = $2`,
      [id,comp]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Activation code not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
