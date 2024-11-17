// firmroutes.js

const express = require('express');
const path = require('path');
const firmcontroller = require('../controllers/Firmcontroller');
const verifytoken = require("../middlewares/verifytoken");
const router = express.Router();

// Correctly defined route with functions as middleware
router.post('/add-firm', verifytoken, firmcontroller.upload, firmcontroller.addfirm);

router.get('/uploads/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  res.set('Content-Type', 'image/jpeg');
  res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
});

router.delete('/:firmid', firmcontroller.deletefirmbyid);

module.exports = router;
