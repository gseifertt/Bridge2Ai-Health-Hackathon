const express = require('express');
const cors = require('cors');

//const audioRoutes = require('./routes/audioRoutes');
//const predictRoutes = require('./routes/predictRoutes');
//const locationRoutes = require('./routes/locationRoutes');
const screeningRoutes = require('./routes/screeningRoutes');


const app = express();

app.use(cors());
app.use(express.json());


//app.use('/audio', audioRoutes);
//app.use('/predict', predictRoutes);
//app.use('/location', locationRoutes);
app.use('/screening', screeningRoutes);



app.get('/', (req, res) => {
  res.send('VoiceHealth API running');
});


const airQualityRoutes = require("./routes/airQualityRoutes");

app.use("/air-quality", airQualityRoutes);
//app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});