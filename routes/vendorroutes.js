const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorcontroller');

// POST /vendor/register - Register a new vendor
router.post('/register', vendorController.vendorregister);

// POST /vendor/login - Vendor login
router.post('/login', vendorController.vendorlogin);

// GET /vendor/all-vendors - Get all vendors
router.get('/all-vendors', vendorController.getallvendors);

// GET /vendor/single-vendor/:id - Get a single vendor by ID
router.get('/single-vendor/:id', vendorController.getvendorbyid);

module.exports = router;
