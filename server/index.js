require('dotenv').config();


const express = require('express');
var morgan = require('morgan');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const host = process.env.HOST;
const port = 1234;

const { Pool, Client } = require('pg');
const config = {
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT
}
const pool = new Pool(config);
const client = new Client(config);

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
app.use(bodyParser.json());

app.get('/copy', async (req, res, next) => {

  var response = await axios.get(`http://www.randomtext.me/api/gibberish/p-2/30-50/`);
  res.send(response.data['text_out']);

})

app.get('/signin', async (req, res, next) => {
  let userData = req.body;

  let query = {
    text: 'SELECT (pswhash = crypt($1, pswhash) AS pswmatch FROM users WHERE email=$2',
    values: [userData.password, userData.email]
  }

  const response = await pool.query(query);
  console.log(response);

  res.send(response);
});

app.post('/newuser', async (req, res, next) => {
  let userData = req.body;

  let query = {
    text: "INSERT INTO users (username, pswhash, email) VALUES($1, crypt($2, gen_salt('bf')), $3)",
    values: [userData.username, userData.password, userData.email]
  }

  const response = await pool.query(query);
  console.log(response);

  res.send(response);
})

app.listen(port, async () => {
  try {
    await client.connect();
    console.log(`App listening at ${host}:${port}`)
  } catch (err) {
    console.log(err);
  }

})