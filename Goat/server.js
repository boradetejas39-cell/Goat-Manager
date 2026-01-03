
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();


const connectDB = require('./config/database');


const goatRoutes = require('./routes/goatRoutes');
const logRoutes = require('./routes/logRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();


app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/goats', goatRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/reports', reportRoutes);


app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', database: 'MongoDB' });
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'goat.html'));
});

app.get('/goat.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'goat.html'));
});

app.get('/data-viewer.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'data-viewer.html'));
});


const PORT = process.env.PORT || 8080;


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Database: MongoDB');
    console.log('Database name: goat_management');
  });
});
