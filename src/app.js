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

app.use("/auth", authRoutes);
app.use("/quiz", quizRoutes);
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
