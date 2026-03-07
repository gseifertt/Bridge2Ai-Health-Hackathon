const db = require('../database/db');
const queries = require('../database/queries');

exports.createScreening = async (req, res) => {

  const {
    age,
    sex_at_birth,
    allergies,
    respiratory_disease,
    zip_code
  } = req.body;

  const result = await db.query(
    queries.createScreening,
    [age, sex_at_birth, allergies, respiratory_disease, zip_code]
  );

  res.json({
    screeningId: result.rows[0].screening_id
  });
};