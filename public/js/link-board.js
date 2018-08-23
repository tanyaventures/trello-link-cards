/* global TrelloPowerUp, elect, asyncMergeSort */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var linkBtn = document.getElementById('link');

var TRELLO_BOARD_QUERY = 'https://api.trello.com/1/boards';

linkBtn.addEventListener("click", function() {
  var input = document.getElementById('url');
  var url = input.value;
  if (url){
    storeBoardID();
  }
  else {
    // return error
  }
});

// function storeBoardID(url){
  
//   // Extract ID from URL 
//   var array = url.split("/");
//   var trello_id = array[4];
//   console.log(trello_id);

//   var data = null;

//   var xhr = new XMLHttpRequest();

//   xhr.addEventListener("readystatechange", function () {
//     if (this.readyState === this.DONE) {
//     console.log(this.responseText);
//     }
//   });

//   var fetchURL = TRELLO_BOARD_QUERY + trello_id + '&key=' + process.env.TRELLO_API_KEY
//     + '&token=' + process.env.TRELLO_TOKEN;
  
//   xhr.open("GET", fetchURL);

//   xhr.send(data);
  
// }


