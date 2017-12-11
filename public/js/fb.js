
// You probably don't want to use globals, but this is just example code
var fbAppId = '1907485535931512';
var objectToLike = 'http://techcrunch.com/2013/02/06/facebook-launches-developers-live-video-channel-to-keep-its-developer-ecosystem-up-to-date/';


/*
 * This is boilerplate code that is used to initialize
 * the Facebook JS SDK.  You would normally set your
 * App ID in this code.
 */

// Additional JS functions here
window.fbAsyncInit = function() {
  FB.init({
    appId      : fbAppId, // App ID
    status     : true,    // check login status
    cookie     : true,    // enable cookies to allow the
    xfbml      : true,     // parse page for xfbml or html5
    version     : 'v2.11',  // Specify an API version
  });

  // Put additional init code here
};

// Load the SDK Asynchronously
(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));



function postLike(msg,hg) {      
  FB.ui({
    method: 'share',
    mobile_iframe: true,
    display:"touch",    
    href: 'https://jubom.herokuapp.com',
    hashtag:"#JUBOM "+hg,
    quote:msg
  }, function(response){

    console.log(response)
  });


}


