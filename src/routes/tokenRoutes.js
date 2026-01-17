const express = require("express");
const router = express.Router();
const { createActivationCode, getActivationCodes, updateActivationCode, deleteActivationCode } = require("../controllers/tokenController");
router.get('/test', (req, res) => {
    res.send('server is ready');
});


router.post("/", createActivationCode);
router.get("/", getActivationCodes);
router.put("/:id", updateActivationCode);
router.delete("/:id", deleteActivationCode);

module.exports = router;
