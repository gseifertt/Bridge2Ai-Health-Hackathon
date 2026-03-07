exports.createScreening = `
INSERT INTO screenings
(age, sex_at_birth, allergies, respiratory_disease, zip_code)
VALUES ($1,$2,$3,$4,$5)
RETURNING screening_id
`;