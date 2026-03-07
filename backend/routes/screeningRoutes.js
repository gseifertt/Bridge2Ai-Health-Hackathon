const express = require('express');
const router = express.Router();

const { createScreening } = require('../controllers/screeningController');
const { asyncHandler } = require('../middleware/errorMiddleware');

router.post('/', asyncHandler(createScreening));

module.exports = router;