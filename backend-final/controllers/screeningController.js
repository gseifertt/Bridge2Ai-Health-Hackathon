// Hackathon demo: bypass DB when PostgreSQL is not installed
// const db = require('../database/db');
// const queries = require('../database/queries');

exports.createScreening = async (req, res) => {
  try {
    const { age, sex_at_birth, allergies, respiratory_disease, zip_code } = req.body;
    // const result = await db.query(
    //   queries.createScreening,
    //   [age, sex_at_birth, allergies, respiratory_disease, zip_code]
    // );
    // res.json({ screeningId: result.rows[0].screening_id });
    const mockScreeningId = 1;
    res.status(201).json({ screeningId: mockScreeningId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create screening' });
  }
};
