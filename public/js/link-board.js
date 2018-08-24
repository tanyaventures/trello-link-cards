/* global TrelloPowerUp, elect, asyncMergeSort */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();
var token = null;

var linkBtn = document.getElementById('link');

// var TRELLO_BOARD_QUERY = 'https://api.trello.com/1/boards';

document.getElementById('link').addEventListener('click', function(){
  var input = document.getElementById('url');
  var url = input.value;
  var array = url.split("/");
  
  // t.getAll()
  // .then(function (data) {
  //   console.log(JSON.stringify(data, null, 2));
  // });
  
  // t.get('member', 'private', 'token')
  // .then(function(storedToken) {
  //   console.log(token);
  //   token = storedToken;
  // });


  
  // To store fetched data 
  var boardId = array[4];
  var nameBoard = '';
  
  var data = null;
  var connectedBoardName = "";

      
  t.board('id', 'name')
  .then(function(board){
    $.get(`/link-board/${boardId}`, function(res) {
      return t.set('board', 'shared', { parentBoardName: board['name'], idBoard: boardId, boardName: connectedBoardName})
      .then(function(){
        return t.getAll()
        .then(function (data) {
          console.log(JSON.stringify(data, null, 2));

          document.getElementById("text").innerHTML = 'Congratulations! 🎉' + board['name'] + " is connected to " + connectedBoardName
        });
      });
    });
  })
  .catch(function(err){
    console.error(err);
  });
});
  
//   var trello_api = "https://api.trello.com/1/boards/" + boardId + "?key=98428d0d95a342312fcbe106220898f9&token=a91b0ece0a71636f0dcc452b223b8a474835e4e82b9e612bf8ea76256c67a771";

//   xhr.open("GET", 
//            trello_api);

//   xhr.send(data);
  
                                                 
                                                





