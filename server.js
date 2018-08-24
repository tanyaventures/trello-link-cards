var express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const rp = require('request-promise');
Promise = require('bluebird');

const trelloApi = 'https://api.trello.com/1';


require('dotenv').config()

var app = express();

// your manifest must have appropriate CORS headers, you could also use '*'
app.use(cors({ origin: '*' }));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("*", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// use body parser for requests
// app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

// Testing
app.get('/link-board/:boardId', Promise.coroutine(function* (req, res) {
  var boardId = req.param.boardId;
  console.log(boardId);
  // var options = { method: 'GET', url: 'https://api.trello.com/1/boards/${boardId}'};
  var _include_headers = function(body, response, resolveWithFullResponse) {
    return {'headers': response.headers, 'data': body};
  };
  var options = {
    method: 'GET',
    uri: `${trelloApi}/boards/${boardId}`,
    qs: { key: process.env.TRELLO_API_KEY, token: process.env.TRELLO_TOKEN },
    json: true,
    transform: _include_headers
  };

  return rp(options)
  .then(function(response) {
    console.log(response.headers);
    console.log(response.data);
  });
}));

// Setup server routes
// require('./route.js')(app);

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Growth plan power up is up and running ' + listener.address().port);
});


