const express = require("express");
const router = express.Router();
const { createActivationCode, getActivationCodes, updateActivationCode, deleteActivationCode, getActivationCodeById } = require("../controllers/tokenController");
const userAuth = require("../middleware/userAuth");

router.get('/test', (req, res) => {
    res.send('server is ready');
});
router.post("/",userAuth, createActivationCode);
router.get("/",userAuth, getActivationCodes);
router.put("/:id",userAuth, updateActivationCode);
router.delete("/:id",userAuth, deleteActivationCode);
router.get("/:id", userAuth, getActivationCodeById);


module.exports = router;
