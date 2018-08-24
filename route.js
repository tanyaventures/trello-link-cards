const _ = require('lodash');
const db = require('./database');
const rp = require('request-promise');
var request = require("request");

Promise = require('bluebird');

const trelloApi = 'https://api.trello.com/1';

// Store connected Board ID 
var connectedBoardID = null;
var cards = [];


const getCardsWithExamplesChecklist = Promise.coroutine(function* (boardId, token, closed){
  const apiReq = {
    uri: `${trelloApi}/boards/${boardId}/cards`,
    qs: { checklists: 'all', key: process.env.APP_KEY, token: token },
    json: true
  };
  let response;
  try {
    response = yield rp.put(apiReq);
    
    console.log(response);
    
    var results = response.body;

    for (var i in results) {
      var checklist = results[i].checklists;
      
       for (var j in checklist) {
        if ((checklist[j].name).includes("Examples")) {
          //console.log(results[i].name);
          
        //   db.insert({ cardId, snoozeTime, token }, function (err, added) {
        //   if (err) {
        //     console.error(err);
        //     console.error(`Error inserting snooze into DB. error=${err.message}, ` +
        //       `cardId=${cardId}, until=${snoozeTime}, token=${token.substring(0, 15)}`);
        //     return res.sendStatus(500);
        //   }
        //   console.log(`🎉 Inserted snooze into DB. cardId=${cardId} until=${snoozeTime}`);
        //   return res.sendStatus(200);
        // });

          cards.push({
            name: results[i].name,
            id: results[i].id,
            listId: results[i].idList,
            //list: getListName(results[i].idList),
            checklistId: checklist[j].id
          });

        }
      }
    }
  } catch (apiErr) {
    console.error(`Error updating card closed status. boardId=${boardId} error=${apiErr.message}`);
    return false;
  }
  return true;
})

const getCapabilityCard = Promise.coroutine(function* (cardId, token, closed){
  const apiReq = {
    uri: `${trelloApi}/cards/${cardId}/closed`,
    qs: { value: closed, key: process.env.APP_KEY, token: token },
    json: true
  };
  let response;
  try {
    response = yield rp.put(apiReq);
  } catch (apiErr) {
    console.error(`Error updating card closed status. cardId=${cardId} error=${apiErr.message}`);
    return false;
  }
  return true;
})



  
const board = (app) => {
  // Add route handler for creating and updating card snoozes
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
  
  // Create route handler for removing card snoozes
  app.get('/capability/:cardId', Promise.coroutine(function* (req, res) {
    // check that the request contains the fields we expect
    if (!req.query) {
      return res.sendStatus(400);
    }
    if (!req.query.token || !/^[0-9a-f]{64}$/.test(req.query.token)) {
      console.error('Missing or invalid token');
      return res.sendStatus(400);
    }
    if (!req.params.cardId || !/^[0-9a-f]+$/.test(req.params.cardId)) {
      console.error(`Missing or invalid cardId: ${req.params.cardId}`);
      return res.sendStatus(400);
    }
    
    // We know we have what we need, and that it _looks_ valid
    // Now we need to check that the token especially really is valid
    // and has the appropriate access to the card in question
    const success = yield getCapabilityCard(req.params.cardId, req.query.token, false);
    if (!success) {
      return res.sendStatus(403);
    }
    
    // Everything checks out, perform the delete operation
    db.remove({ cardId: req.params.cardId }, {}, (err, numRemoved) => {
      if (err) {
        res.sendStatus(500);
        throw err;
      } else {
        res.sendStatus(200);
        console.log(`🗑 Deleted ${numRemoved} snooze(s) in DB. cardId=${req.params.cardId}`);
      }
    });
  }));

    
    
    // let response;
    // try {
    //   response = yield rp.get(options);
    //   console.log("Fetched:" + response);
    //   return response;
    // } catch (apiErr) {
    //   console.error(`Error updating card closed status. cardId=${boardId} error=${apiErr.message}`);
    //   return false;
    // }

//    rp(options)
//     .then(function (board) {
//         console.log("Fetched:" + board);
     
//     })
//     .catch(function (err) {
//         // API call failed...
//     });
  
  

};

module.exports = board;