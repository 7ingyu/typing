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

app.get('/login', async (req, res, next) => {
  let userData = JSON.parse(req.headers.authorization);
  console.log(userData);

  let responseObj = {
    id: null,
    username: null,
    history: null
  }

  const passwordQuery = {
    text: `SELECT user_id, username, (pswhash = crypt($1, pswhash)) AS pswmatch FROM users WHERE email=$2`,
    values: [userData.password, userData.email]
  }

  let { rows } = await pool.query(passwordQuery);

  if (rows.length === 0) {
    res.send('No such user');
  } else if (rows[0].pswmatch) {
    responseObj.id = rows[0].user_id;
    responseObj.username = rows[0].username;

    const histQuery = {
      text: `SELECT * FROM scores WHERE user_id=$1 ORDER BY start DESC`,
      values: [responseObj.id]
    }

    let data = await pool.query(histQuery);

    responseObj.history = data.rows;
    res.send(responseObj);
  } else {
    res.send('Incorrent email and/or password');
  }
});

app.post('/signup', async (req, res, next) => {
  let userData = req.body;

  const query = {
    text: "INSERT INTO users (username, pswhash, email) VALUES($1, crypt($2, gen_salt('bf')), $3) RETURNING user_id",
    values: [userData.username, userData.password, userData.email]
  }

  try {
    const response = await pool.query(query);
    res.send(response.rows[0]);
  } catch (err) {
    res.send('Email already registerd');
  }
})

app.post('/:userid', async (req, res, next) => {
  let id = req.params.userid;
  let score = req.body;

  let query = {
    text: `INSERT INTO scores(user_id, wpm, start, "end", elapsed, errors, perfect) VALUES($1, $2, $3, $4, $5, $6, $7)`,
    values: [id, score.wpm, new Date(score.start), new Date(score.end), score.elapsed, score.errors, score.perfect]
  }

  await pool.query(query);
  res.send('Ok');
})

app.listen(port, async () => {
  try {
    await client.connect();
    console.log(`App listening at ${host}:${port}`)
  } catch (err) {
    console.log(err);
  }

})