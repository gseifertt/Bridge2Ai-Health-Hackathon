const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadAudio");
const { uploadAudio } = require("../controllers/audioController");

router.post("/upload", upload.single("audio"), uploadAudio);

module.exports = router;