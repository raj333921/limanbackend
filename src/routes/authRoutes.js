const express = require("express");
const { adminLogin, activateCode } = require("../controllers/authController");
const router = express.Router();

router.post("/admin/login", adminLogin);
router.post("/activate", activateCode);

module.exports = router;
