require('dotenv').config();
const express = require('express');
var morgan = require('morgan');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const host = process.env.HOST;
const port = 1234;


app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
app.use(bodyParser.json());

app.get('/copy', async (req, res) => {

  try {
    let list = await axios.get(`http://www.randomtext.me/api/gibberish/p-1/5-10/`);
    res.send(list.data['text_out']);
  } catch (err) {
    console.log(err);
    res.send(err);
  }

})

app.listen(port, () => {
  console.log(`App listening at ${host}:${port}`)
})