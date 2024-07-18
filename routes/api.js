const express = require('express');
const router = express.Router();

const { createPdf, getFile } = require('../controllers/api');

// Routes
router.post('/createpdf', createPdf);
router.get('/getpdf', getFile);

module.exports = router;
