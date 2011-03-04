/**
* (c) 2010 - 2011 jxf, Steve L. Nyemba <nyemba@gmail.com>
* Facebook, Integration Module
*
* This module allows an application to be able to post a status to a facebook account provided that the facebook contract is respected
* Dependencies:
*	facebook API	http://www.facebook.com
*	rpc.js		jxf rpc wrapper
*
*/
if(!fb){
  var fb={} ;
}
fb.app={} ;
fb.app.id = null;
fb.app.url=null;
fb.app.token = null;
fb.app.iframe=null;
fb.app.init= function(id){
  var url = 'https://graph.facebook.com/oauth/access_token?client_id='+fb.app.id+'&client_secret=6cc5d3cde5f5ce806a697b6d1cb45581&grant_type=client_credentials'
  var callback = function(xmlhttp){
    fb.app.token = xmlhttp.responseText;
    
  }
  jx.ajax.send(url,callback,'GET') ;
    
}
//
// now we are getting permission to access the current user's facebook profile
//
fb.app.permission={}
fb.app.permission.pages=null;
fb.app.permission.init=function(){
  air.trace(fb.app.token) ;
  //var url = 'https://www.facebook.com/dialog/oauth?display=iframe&client_id='+fb.app.id+'&redirect_uri='+fb.app.url+'&scope=manage_pages&response_type='+fb.app.token
  var url = 'https://www.facebook.com/dialog/oauth?client_id='+fb.app.id+'&redirect_uri=http://www.facebook.com/connect/login_success.html&scope=email,read_stram&response_type=token'
  var iframe = document.getElementById(fb.app.iframe) ;
  iframe.src = url ;
  //air.trace(url) 
}