const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads/images", express.static("uploads/images"));

app.use("/limanplatform/auth", authRoutes);
app.use("/limanplatform/quiz", quizRoutes);
app.use("/limanplatform/admin", adminRoutes);
console.log('app is running');
module.exports = app;
