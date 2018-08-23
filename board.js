const _ = require('lodash');
const db = require('./database');
const rp = require('request-promise');

Promise = require('bluebird');

const trelloApi = 'https://api.trello.com/1';
  
const routes = (app) => {
  
  app.post('/link-board', Promise.coroutine(function* (req, res) {
    // check that the request contains the fields we expect
    if (!req.body) {
      console.error('Missing body');
      return res.sendStatus(400);
    }
    const token = req.body.token;
    if (!token || !/^[0-9a-f]{64}$/.test(token)){
      console.error(`Missing or invalid token: ${token.substring(0, 15)}`);
      return res.sendStatus(400);
    }
    
  var request = require("request");

  var options = { method: 'GET',
    url: 'https://api.trello.com/1/boards/czWwlelZ',
    qs: 
     { key: process.env.TRELLO_API_KEY,
       token: process.env.TRELLO_API_TOKEN} };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
    
    
    
    
//     const cardId = req.body.cardId;
//     if (!cardId || !/^[0-9a-f]+$/.test(cardId)) {
//       console.error(`Missing or invalid cardId: ${cardId}`);
//       return res.sendStatus(400);
//     }
//     if (!req.body.snoozeTime) {
//       console.error(`Missing snoozeTime: ${req.body.snoozeTime}`);
//       return res.sendStatus(400);
//     }
//     let snoozeTime;
//     try {
//       snoozeTime = parseInt(req.body.snoozeTime, 10);
//     } catch (parseErr) {
//       console.error(`Invalid snoozeTime: ${req.body.snoozeTime}`);
//       return res.sendStatus(400);
//     }

//     const success = yield updateCardClosed(cardId, token, true);
//     if (!success) {
//       return res.sendStatus(403);
//     }


};
  
  
  // const apiReq = {
  //   uri: `${trelloApi}/cards/${cardId}/closed`,
  //   qs: { value: closed, key: process.env.APP_KEY, token: token },
  //   json: true
  // };
  // let response;
  // try {
  //   response = yield rp.put(apiReq);
  // } catch (apiErr) {
  //   console.error(`Error updating card closed status. cardId=${cardId} error=${apiErr.message}`);
  //   return false;
  // }
  // return true;
})

