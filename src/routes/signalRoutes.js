const express = require("express");
const router = express.Router();
const { createSignalSigns, getSignalSigns, updateSignalSigns, deleteSignalSigns, getSignalSignsById } = require("../controllers/signalController");
const userAuth = require("../middleware/userAuth");

router.get('/test', (req, res) => {
    res.send('server is ready');
});
router.post("/",userAuth, createSignalSigns);
router.get("/",userAuth, getSignalSigns);
router.put("/:id",userAuth, updateSignalSigns);
router.delete("/:id",userAuth, deleteSignalSigns);
router.get("/:id", userAuth, getSignalSignsById);


module.exports = router;
