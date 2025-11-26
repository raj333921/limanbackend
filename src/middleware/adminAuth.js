const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
    // Get the Authorization header
    const authHeader = req.headers.authorization;
    console.log("Auth header:", authHeader); // Debugging

    if (!authHeader) {
        return res.status(401).json({ message: "Admin token required" });
    }

    // Extract the token part from "Bearer <token>"
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }

    try {
        // Verify the token using the secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user is an admin
        if (!decoded.isAdmin) {
            return res.status(403).json({ message: "Admin access only" });
        }

        // Attach decoded admin info to the request
        req.admin = decoded;

        // Continue to next middleware/route
        next();
    } catch (err) {
        console.error("JWT verification error:", err.message); // Debugging
        res.status(403).json({ message: "Invalid token" });
    }
};
