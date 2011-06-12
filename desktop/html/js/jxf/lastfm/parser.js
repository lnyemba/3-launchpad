/**
* (c) 2010 - 2011 3-launchpad, Steve L. Nyemba
* nyemba@gmail.com
* This is a lastfm API parser version 2.0 to consume the services that:
*   artist.getimages    Lastfm artist image service
*   artist.getinfo      Lastfm artist biography service
*   artist.getevent     Lastfm artist event service
*/
if(!jx){
  var jx = {}
}

jx.lastfm={
  parse:function(xmlhttp){
    
    var nodes = xmlhttp.firstChild.getElementsByTagName('sizes') ;
    
    var r = {} ;
    r.meta = ['square'] ;
    r.data = [] ;
   
    for(var i=0; i < nodes.length; i++){
      r.data[i]  = {} ;
     
      for(var j=0; j< nodes[i].childNodes.length; j++){
	entry = nodes[i].childNodes[j] ;
	
	if(entry.nodeName == 'size' && entry.attributes[0].value == 'largesquare'){
	    //air.trace(entry.firstChild.nodeValue) ;
	   
	   r.data[i].square = entry.firstChild.nodeValue ;
	   
	}
      }
    }
    return r;
  }//-- end jx.lastfm
}//-- end jx.lastfm

/**
* Trying to retrieve artist information i.e biography; 
*/
jx.lastfm.get = {} ;
jx.lastfm.get.bio={} ;
jx.lastfm.get.bio.init = function(id){
    var artist = jx.dom.get.value(id);
    var url  = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&autocorrect=1&api_key=876c789306d784c59347e153b83b72c0&artist='+artist
    var rpc = jx.ajax.getInstance() ;
    var fn = function(xmlhttp){
        var bio = jx.lastfm.get.bio.parse(xmlhttp.responseXML) ;
        //jx.lastfm.get.bio.render(bio);
    }
    rpc.send(url,fn,'GET')
}//-- end jx.lastfm.get.bio.init

jx.lastfm.get.bio.parse=function(xml){
    var nodes = xml.firstChild.getElementsByTagName('bio') ;
    var bio ={} ;
    bio.published   = 'N/A'
    bio.wiki     = 'N/A'
    for(var i=0; i < nodes[i].childNodes.length; i++){
        entry = nodes[i].childNodes[j] ;
        if(entry.nodeName.match(/published'/i)){
            bio.published = entry.firstChild.nodeValue ;
        }else if(entry.nodeName.match(/summary/i)){
            bio.wiki = entry.firstChild.nodeValue ;
        }
    }//-- end of loop
    return bio;
}
jx.lastfm.render = {} ;
jx.lastfm.render.bio =function(id,bio){
    var panel = document.createElement('DIV') ;
    posted = document.createElement('DIV')
    posted.innerHTML = ('<b>'+bio.published +'</b>') ;

    wiki = document.createElement('DIV')
    wiki.innerHTML = (bio.wiki) ;
    panel.className = 'nytimes' ;
    panel.appendChild(posted);
    panel.appendChild(wiki);
    jx.dom.append.child(id,panel);

}
/**
 * Managing events
 * 
 */