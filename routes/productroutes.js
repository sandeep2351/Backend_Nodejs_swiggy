const express = require('express');
const path = require('path');
const productController = require('../controllers/productcontroller');
const verifyToken = require('../middlewares/verifytoken');

const router = express.Router();

// Define the route for adding a product
router.post('/add-product/:firmid', verifyToken, productController.addproduct);

// Get products by firm
router.get('/:firmid/products', productController.getproductsbyfirm);

// Serve uploaded images
router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.setHeader('Content-Type', 'image/jpeg'); // Set the content type to JPEG
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName)); // Use `imageName` variable directly
});

// Delete a product by ID
router.delete('/:productId', verifyToken, productController.deleteproductByid);

module.exports = router;
