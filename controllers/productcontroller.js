const Product = require('../models/product');
const multer = require('multer');
const Firm = require('../models/Firm');
const path = require('path');

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); // Ensure 'uploads/' directory exists
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename logic
    }
});

const upload = multer({ storage: storage });

// Function to add a new product to a firm
const addproduct = async (req, res) => {
    try {
        const { productName, price, category, bestseller, description } = req.body;
        const image = req.file ? req.file.filename : undefined; // Handle image upload if provided
        const firmid = req.params.firmid; // Extract firmid from request params

        const firm = await Firm.findById(firmid);
        if (!firm) {
            return res.status(404).json({ message: "No firm found" });
        }

        // Create a new product instance
        const newProduct = new Product({
            productName,
            price,
            category,
            bestseller,
            description,
            image,
            firm: firm._id
        });

        // Save the product and update the firm's product array
        const savedProduct = await newProduct.save();
        firm.products.push(savedProduct._id);
        await firm.save();

        res.status(200).json(savedProduct); // Respond with the saved product details
    } catch (error) {
        console.error('Error adding product:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Function to get all products associated with a firm
const getproductsbyfirm = async (req, res) => {
    try {
        const { firmid } = req.params; // Extract firm ID from request parameters

        // Validate firm ID
        if (!firmid) {
            return res.status(400).json({ message: "Firm ID is required" });
        }

        // Find the firm by ID
        const firm = await Firm.findById(firmid);
        if (!firm) {
            return res.status(404).json({ message: "No firm found with the provided ID" });
        }

        // Fetch products associated with the firm
        const products = await Product.find({ firm: firmid });

        // Respond with firm details and products
        res.status(200).json({
            restaurantname: firm.firmName, // Include restaurant name in response
            products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


// Function to delete a product by its ID
const deleteproductByid = async (req, res) => {
    try {
        const productId = req.params.productId; // Adjusted to match router
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ message: "No product found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    addproduct: [upload.single('image'), addproduct], // Multer middleware applied here
    getproductsbyfirm,
    deleteproductByid
};
