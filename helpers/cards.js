const got = require('got');


var TRELLO_BOARD_QUERY = 'https://api.trello.com/1/boards';

getCardsWithExamplesChecklist('czWwlelZ');


function getCardsWithExamplesChecklist(boardId) {
  var checklistQuery =  TRELLO_BOARD_QUERY + '/' + boardId + '/cards?fields=name,idList,idChecklists&checklists=all'
    + '&key=' + process.env.TRELLO_API_KEY
    + '&token=' + process.env.TRELLO_TOKEN;

  console.log('query: ' + checklistQuery);

  got(checklistQuery, { json: true }).then(response => {
    var results = response.body;

    //loop through results to get the card IDs
    for (var i in results) {
      var checklist = results[i].checklists;
      for (var j in checklist) {
        if ((checklist[j].name).includes("Examples")) {
          //console.log(results[i].name);

          var card = new Card(results[i].name, results[i].id, results[i].idList,checklist[j].id);
          card.printAll();
        }
      }
    }
  }).catch(error => {
    console.log(error.response.body);
  });
}


function Card(name, id, listId, checklistId) {
  this.name = name;
  this.id = id;
  this.listId = listId;
  this.checklistId = checklistId;

  /*console.log("name: " + this.name);
  console.log("ID: " + this.id);
  console.log("List ID: " + this.listId);
  console.log("Checklist ID: " + this.checklistId);*/
}
