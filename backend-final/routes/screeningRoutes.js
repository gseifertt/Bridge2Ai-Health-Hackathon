const express = require('express');
const router = express.Router();

const { createScreening } = require('../controllers/screeningController');
//const { asyncHandler } = require('../middleware/errorMiddleware');

router.post('/', createScreening);

module.exports = router;