const got = require('got');
var async = require('async');

async function getCardsWithExamplesChecklist(boardId) {
  var cardsQuery =  'https://api.trello.com/1/boards/' + boardId + '/cards?fields=name,idList,idChecklists&checklists=all'
    + '&key=' + process.env.TRELLO_API_KEY
    + '&token=' + process.env.TRELLO_TOKEN;

  console.log('query: ' + cardsQuery);

  var cards = [];

  await got(cardsQuery, { json: true }).then(response => {
    var results = response.body;

    for (var i in results) {
      var checklist = results[i].checklists;
       for (var j in checklist) {
        if ((checklist[j].name).includes("Examples")) {
          //console.log(results[i].name);

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
  }).catch(error => {
    console.log(error.response.body);
  });

  return cards;
}

async function getListName(listId) {
  var listQuery =  'https://api.trello.com/1/lists/' + listId + '?fields=name'
    + '&key=' + process.env.TRELLO_API_KEY
    + '&token=' + process.env.TRELLO_TOKEN;
  //console.log('query: ' + listQuery);

  var name = '';
  await got(listQuery, { json: true }).then(response => {
    var parsed = getJsonParse(response.body);
    parsed.then(function(result){
        name = result.name;
        //console.log("name: " + name);
    });

  }).catch(error => {
    console.log(error.response.body);
  });

  return name;
}

function getJsonParse(jsonString) {
	 return new Promise(function(resolve, reject){
		try{
			var obj = JSON.parse(JSON.stringify(jsonString));
			resolve(obj);
		}
		catch(err){
			reject(err);
		}
	});
}



//for testing
/*async function main() {
  /*var capabilities = await getCardsWithExamplesChecklist('czWwlelZ');
  console.log("Number of cards: " + capabilities.length);
  for (var i in capabilities) {
    console.log(capabilities[i]);
  }

  console.log('here: ' + await getListName('5b7dfb54b769111a4fc68e99'));

}*/
