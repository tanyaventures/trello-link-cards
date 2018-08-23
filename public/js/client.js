/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;

// TODO: replace icons to our brand icons
var BLACK_ROCKET_ICON = 'https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421';
var WHITE_ICON = 'https://cdn.glitch.com/b4e956a2-3002-4a55-aa06-a4c1bfb9dc58%2Fskills%20(3).svg?1535017774321';
var BLACK_ICON = 'https://cdn.glitch.com/b4e956a2-3002-4a55-aa06-a4c1bfb9dc58%2Fskills%20(4).svg?1535017831898';
var GRAY_ICON = 'https://cdn.glitch.com/b4e956a2-3002-4a55-aa06-a4c1bfb9dc58%2Fround%20icon%20grey.svg?1535017465732';
var CAPABILITY_ICON = 'https://cdn.glitch.com/b4e956a2-3002-4a55-aa06-a4c1bfb9dc58%2Fskills.svg?1535017439172';

// When board buttons is clicked
var onBtnClick = function (t, opts) {
  console.log('Someone clicked the button');
  if (!t) {
    t.popup({
      title: 'Authorize Your Account',
      url: './auth.html',
      height: 75
    });
  } else {
    return t.popup({
      title: 'Connect Tasks to Growth Plan',
      url: './configure-powerup.html',
      height: 175,
    });
  }
};

// When button on card is clicked
var cardButtonCallback = function(t){
  
    // TODO: fetch items with name + URL to its corresponding card
    var items = function(){

      return {
        text: '',
        url: '',
        callback: function(t){
          // In this case we want to attach that park to the card as an attachment
          // but first let's ensure that the user can write on this model
          if (t.memberCanWriteToModel('card')){
            return t.attach({ url: '', name: '' })
            .then(function(){
              // once that has completed we should tidy up and close the popup
              return t.closePopup();
            });
          } else {
            console.log("Oh no! You don't have permission to add attachments to this card.")
            return t.closePopup(); // We're just going to close the popup for now.
          };
        }
      };
    };
    
    return t.popup({
      title: 'Select your growth area',
      items: items, // Trello will search client-side based on the text property of the items
      search: {
      count: 5, // How many items to display at a time
      placeholder: 'Search growth area',
      empty: 'No results'
      }
    });
};


// We need to call initialize to get all of our capability handles set up and registered with Trello 
TrelloPowerUp.initialize({
  // Start adding handlers for your capabilities here!
  'card-buttons': function(t, options) {
		return [{
     		icon: BLACK_ICON,
	 		  text: 'Growth Areas',
	      callback: cardButtonCallback
	 	}];
	 },
  'board-buttons': function (t, opts) {
    return [{
      // provide a button with a callback function
      icon: {
        dark: WHITE_ICON,
        light: BLACK_ICON
      },
      text: 'Growth Plan',
      callback: onBtnClick,
      condition: 'edit'
    }];
  },
  'attachment-thumbnail': function(t, options){
    // options.url has the url of the attachment for us
    // return an object (or a Promise that resolves to it) with some or all of these properties:
    // url, title, image, modified (Date), created (Date), createdBy, modifiedBy
    
    // You should use this if you have useful information about an attached URL but it
    // doesn't warrant pulling it out into a section via the attachment-sections capability
    // for example if you just want to show a preview image and give it a better name
    // then attachment-thumbnail is the best option
    return {
      url: options.url,
      title: '👉 ' + options.url + ' 👈',
      image: {
        url: CAPABILITY_ICON,
        logo: true // false if you are using a thumbnail of the content
      },
    };
    
    // if we don't actually have any valuable information about the url
    // we can let Trello know like so:
    // throw t.NotHandled();
  },
  
  
  /*        
      
      🔑 Authorization Capabiltiies 🗝
      
      The following two capabilities should be used together to determine:
      1. whether a user is appropriately authorized
      2. what to do when a user isn't completely authorized
      
  */
  'authorization-status': function(t, options){
    // Return a promise that resolves to an object with a boolean property 'authorized' of true or false
    // The boolean value determines whether your Power-Up considers the user to be authorized or not.
    
    // When the value is false, Trello will show the user an "Authorize Account" options when
    // they click on the Power-Up's gear icon in the settings. The 'show-authorization' capability
    // below determines what should happen when the user clicks "Authorize Account"
    
    // For instance, if your Power-Up requires a token to be set for the member you could do the following:
    return t.get('member', 'private', 'token')
    // Or if you needed to set/get a non-Trello secret token, like an oauth token, you could
    // use t.storeSecret('key', 'value') and t.loadSecret('key')
    .then(function(token){
      if(token){
        return { authorized: true };
      }
      return { authorized: false };
    });
    // You can also return the object synchronously if you know the answer synchronously.
  },
  'show-authorization': function(t, options){
    // Returns what to do when a user clicks the 'Authorize Account' link from the Power-Up gear icon
    // which shows when 'authorization-status' returns { authorized: false }.
    
    // If we want to ask the user to authorize our Power-Up to make full use of the Trello API
    // you'll need to add your API from trello.com/app-key below:
    let trelloAPIKey = '';
    // This key will be used to generate a token that you can pass along with the API key to Trello's
    // RESTful API. Using the key/token pair, you can make requests on behalf of the authorized user.
    
    // In this case we'll open a popup to kick off the authorization flow.
    if (trelloAPIKey) {
      return t.popup({
        title: 'My Auth Popup',
        args: { apiKey: trelloAPIKey }, // Pass in API key to the iframe
        url: './authorize.html', // Check out public/authorize.html to see how to ask a user to auth
        height: 140,
      });
    } else {
      console.log("🙈 Looks like you need to add your API key to the project!");
    }
  }
});

