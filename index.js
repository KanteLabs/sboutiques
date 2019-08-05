const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db/firebase')
const {rollbar} = require('./db/config')

require('dotenv').config();

app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
    parameterLimit: 10000000000
  })
);
app.use(express.static(path.join(__dirname, 'public/build')));
app.use(rollbar.errorHandler());

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT} on ${process.env.NODE_ENV}`);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/build', 'index.html'));
});

const apiRoutes = require('./routes/api-routes');
app.use('/api', apiRoutes);

const emailRoutes = require('./routes/emailRoutes');
app.use('/email', emailRoutes);

app.get('*', (req, res) => {
  console.log(req.url, req.baseUrl, req.originalUrl, req.path)
  res.sendFile(path.join(__dirname, 'public/build', 'index.html'));
});