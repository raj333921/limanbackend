const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM admins WHERE email=$1", [email]);
    if (result.rows.length === 0) return res.status(400).json({ message: "Admin not found" });

    const admin = result.rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: admin.id, isAdmin: true }, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// User activation code login
exports.activateCode = async (req, res) => {
  const { code } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM activation_codes WHERE code=$1 AND is_used=false",
      [code]
    );
    if (result.rows.length === 0) return res.status(400).json({ message: "Invalid or used code" });

    await pool.query("UPDATE activation_codes SET is_used=true WHERE code=$1", [code]);

    const token = jwt.sign({ code }, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
