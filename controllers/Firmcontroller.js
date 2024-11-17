const Firm = require("../models/Firm");
const Vendor = require("../models/Vendor");
const multer = require('multer');
const path = require('path');

// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('image');

// Function to add a firm
const addfirm = async (req, res) => {
    try {
        const { firmName, area, category, region, offer } = req.body;
        const image = req.file ? req.file.filename : undefined;

        // Validate required fields
        if (!firmName || !area || !category || !region || !offer) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Find the vendor by ID
        const vendorInstance = req.vendor; // Get vendor from req.vendor (set by verifytoken)
        if (!vendorInstance) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        if (vendorInstance.firm.length > 0) {
            return res.status(400).json({ message: "Vendor can have only one firm" });
        }

        // Create new firm instance
        const newFirm = new Firm({
            firmName,
            area,
            category,
            region,
            offer,
            image,
            vendor: vendorInstance._id
        });

        // Save the new firm
        const savedFirm = await newFirm.save();

        // Update vendor's list of firms
        vendorInstance.firm.push(savedFirm._id);
        await vendorInstance.save();

        return res.status(200).json({ message: "Firm added successfully", firmid: savedFirm._id });
    } catch (error) {
        console.error("Error adding firm:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Function to delete a firm by ID
const deletefirmbyid = async (req, res) => {
    try {
        const firmid = req.params.firmid;
        const deletedFirm = await Firm.findByIdAndDelete(firmid);

        if (!deletedFirm) {
            return res.status(404).json({ message: "No firm found" });
        }

        return res.status(200).json({ message: "Firm deleted successfully" });
    } catch (error) {
        console.error("Error deleting firm:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    upload,
    addfirm,
    deletefirmbyid
};