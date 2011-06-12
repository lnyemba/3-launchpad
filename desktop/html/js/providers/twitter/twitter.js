/**
 * (c) 2010 - 2011 3-launchpad.org
 * Twitter status tracking handler
 *
 * This handler tracks and renders the twitter status of a given user. For the sake of this project we will use @3launchpad
 * jxf/rpc.js   handles ajax requests for the feeds
 * jxf/dom.js   handling of dom objects
 * TODO:
 *  - Generalize this handler to be more flexible and reusable
 */
if(!twitter){
    var twitter = {}
}

twitter.tweets = {}
/**
 * This function will return latest 20 messages of a particular twitter user
 * @param user  registered twitter user
 * @param id    DOM id where the feeds will be rendered (if null nothing happens)
 */
twitter.getTweets = function(user,id){
    var rpc = jx.ajax.getInstance() ;
    var url = 'http://api.twitter.com/1/statuses/user_timeline.json?screen_name=@'+user ;
    var setTweets = function(xmlhttp){
        twitter.tweets = eval("("+xmlhttp.responseText+")") ;
        
        if(id!= null){
            twitter.renderTweets(id)
        }
    }
    rpc.send(url,setTweets,'GET')
}
/**
 * Rendering the tweets on a dom object given its id
 * @param id identifier of the dom object on which the tweets will be rendered
 */
twitter.renderTweets=function(id){
    var tweets = [] ;
    jx.dom.set.value(id,'') ; 
    var panel = document.createElement('DIV');
    panel.style['height'] = '170px' ;
    panel.style['overflow'] = 'auto'
    panel.style['font-size']  = '11px'
    panel.style['padding']  = '2px'
    panel.style['margin']   = '2px';
    //panel.style['background-color'] = '33CCFF'
    for(var i=0; i < twitter.tweets.length; i++){
        text = twitter.tweets[i].text ;        
        tweets.push(text)
        div = document.createElement('DIV');
        div.innerHTML  = ('<b>@'+twitter.tweets[i].user.screen_name+'</b> '+text+'<br><i>'+twitter.tweets[i].created_at+'</i>') ;
        div.style['margin-bottom'] = '3px'
        div.style['padding'] = '5px'
        div.style['background-color'] = '33CCFF'

        //div.style['border'] = '1px dotted white'
        panel.appendChild(div)
    }
    jx.dom.append.child(id,panel);
}