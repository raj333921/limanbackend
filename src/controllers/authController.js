const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log(username)
    const result = await pool.query("SELECT * FROM admins WHERE email=$1", [username]);
    if (result.rows.length === 0) return res.status(400).json({ message: "Admin not found" });

    const admin = result.rows[0];
    console.log("12341->"+password);
    console.log(admin.password);
    const isMatch = (password === admin.password);
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
      `SELECT * FROM activation_codes
       WHERE code = $1`,
      [code.trim().toUpperCase()]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid, expired or used code" });
    }

    await pool.query(
      "UPDATE activation_codes SET is_used = true WHERE code = $1",
      [code.trim().toUpperCase()]
    );

    const token = jwt.sign({ code }, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


