const jwt = require('jsonwebtoken');
const Vendor = require('../models/Vendor'); // Ensure the path is correct
const secretkey = 'mynameissandeep'; // Use your actual secret key

const verifytoken = async (req, res, next) => {
    // Retrieve token from Authorization header
    const authHeader = req.headers['authorization'];
    console.log("Authorization header:", authHeader); // Log header for debugging
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
        return res.status(401).json({ error: "Token is required" });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, secretkey);
        console.log("Decoded token:", decoded); // Log decoded token for debugging
        
        // Find the vendor by the decoded ID
        const vendorInstance = await Vendor.findById(decoded.vendorid);
        if (!vendorInstance) {
            return res.status(404).json({ error: "Vendor not found" });
        }

        // Attach vendor instance to the request object
        req.vendor = vendorInstance;
        next();
    } catch (error) {
        console.error("Token verification error:", error); // Log detailed error
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

module.exports = verifytoken;
