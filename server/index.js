const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

const request = require('request')

app.get('/api/auth', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader("Access-Control-Allow-Origin", "*");
  const GITHUB_AUTH_ACCESSTOKEN_URL = 'https://github.com/login/oauth/access_token/'
  const CLIENT_ID = '89e599519bea3752cf15'
  const CLIENT_SECRET = '31307e8fc2c2e98ec117559a6d2c69a81581601a'
  const CODE = req.query.code
    request.post({
    url: GITHUB_AUTH_ACCESSTOKEN_URL + '?client_id=' + CLIENT_ID  +'&client_secret=' + CLIENT_SECRET + '&code=' + CODE,
        headers: {
            'User-Agent': 'request'
        }
    }, function (error, response, body) {
        res.send(JSON.stringify({ token: body.split('&')[0].split('=')[1] }));
    })
});

app.listen(8081, () =>
  console.log('Express server is running on localhost:8081')
);