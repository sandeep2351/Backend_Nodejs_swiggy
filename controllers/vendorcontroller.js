// controllers/vendorcontroller.js
const Vendor = require('../models/Vendor'); // Adjust path as necessary
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken')
const dotEnv=require('dotenv');
dotEnv.config();

const secretkey= process.env.whatisurname;


exports.vendorregister = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingVendor = await Vendor.findOne({ email });
        if (existingVendor) {
            return res.status(400).json({ message: "Email already taken" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new vendor instance
        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword
        });

        // Save the vendor to the database
        await newVendor.save();

        // Respond with success message
        res.status(201).json({ message: "Vendor registered successfully" });
    } catch (error) {
        console.error("Error in vendor registration:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// controllers/vendorcontroller.js

exports.vendorlogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const vendor = await Vendor.findOne({ email });
        if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ vendorid: vendor._id }, secretkey, { expiresIn: "1h" });
        res.status(200).json({
            success: "Login successful",
            token,
            vendorid: vendor._id // Include the vendor ID in the response
        });
    } catch (error) {
        console.error("Error in vendor login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


exports.getallvendors=async(req,res)=>{
    try {
        const vendors=await Vendor.find().populate('firm') 
        res.json({vendors})

    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Internal server error"});
    }
}

exports.getvendorbyid = async (req, res) => {
    const vendorid = req.params.id; // Ensure this matches the route parameter

    try {
        const vendor = await Vendor.findById(vendorid).populate('firm');
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        const hasFirms = Array.isArray(vendor.firm) && vendor.firm.length > 0;
        const vendorfirmid = hasFirms ? vendor.firm[0]._id : null;

        res.status(200).json({ vendor, vendorfirmid });
    } catch (error) {
        console.error("Error fetching vendor by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



