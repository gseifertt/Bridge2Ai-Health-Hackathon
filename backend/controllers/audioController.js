async function uploadAudio(req, res) {
    try {
  
      if (!req.file) {
        return res.status(400).json({ error: "No audio file uploaded" });
      }
  
      const filePath = req.file.path;
  
      res.json({
        message: "Audio uploaded successfully",
        path: filePath
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Audio upload failed" });
    }
  }
  
  module.exports = { uploadAudio };