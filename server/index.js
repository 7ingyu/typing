require('dotenv').config();
const express = require('express');
var morgan = require('morgan');
const path = require('path');
const app = express();
const host = process.env.HOST;
const port = 1234

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

app.listen(port, () => {
  console.log(`App listening at ${host}:${port}`)
})