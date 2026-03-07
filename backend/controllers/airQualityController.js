const { fetchAirQuality } = require("../services/airQualityService");

async function getAirQuality(req, res) {
  try {
    const { zip } = req.query;

    if (!zip) {
      return res.status(400).json({ error: "zip required" });
    }

    const data = await fetchAirQuality(zip);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch air quality" });
  }
}

module.exports = { getAirQuality };