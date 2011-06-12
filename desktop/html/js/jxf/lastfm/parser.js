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
jx.lastfm.bio = {} ;

jx.lastfm.bio.get = function(id){
    var artist = jx.dom.get.value(id);
    var url  = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&autocorrect=1&api_key=876c789306d784c59347e153b83b72c0&artist='+artist
    var rpc = jx.ajax.getInstance() ;
    var fn = function(xmlhttp){
        var bio = jx.lastfm.bio.parse(xmlhttp.responseXML) ;
        jx.lastfm.bio.render('library.artist.bio',bio);
    }
    rpc.send(url,fn,'GET')
}//-- end jx.lastfm.bio.get

jx.lastfm.bio.parse=function(xml){
    var node = xml.firstChild.getElementsByTagName('bio')[0] ;
    var bio ={} ;
    bio.published   = 'N/A'
    bio.wiki     = 'N/A'
    for(var i=0; i < node.childNodes.length; i++){
        entry = node.childNodes[i] ;
        
        if(entry.nodeName.match(/published/i)){
            bio.published = entry.firstChild.nodeValue ;
        }else if(entry.nodeName.match(/summary/i)){
            bio.wiki = entry.firstChild.nodeValue ;
            bio.wiki = bio.wiki.replace(/(<a.*?>)/ig,'<u>') ;
            bio.wiki = bio.wiki.replace(/(\x3C\x2Fa\x3E)/ig,'</u>');
        }
    }//-- end of loop
    return bio;
}//-- end jx.lastfm.bio.parse

jx.lastfm.bio.render =function(id,bio){
    var panel = document.createElement('DIV') ;
    posted = document.createElement('DIV')
    posted.innerHTML = ('<b>Posted</b> on <i>'+bio.published +'</i>') ;
    posted.className = 'medium nytimes'
    posted.style['font-size'] = '11px'

    wiki = document.createElement('DIV')
    wiki.innerHTML = (bio.wiki) ;
    wiki.className = 'nytimes' ;
    wiki.style['font-size'] = '12px'
    wiki.style['height']       = '140px';
    wiki.style['overflow']     = 'auto'
    wiki.style['padding']      = '3px'
    wiki.style['marging']      = '2px'
    wiki.style['border-top']    = '1px dotted white'
    wiki.className = 'nytimes' ;
    panel.appendChild(posted);
    panel.appendChild(wiki);

    panel.align='left'
    jx.dom.set.value(id,'')
    jx.dom.append.child(id,panel);

}
/**
 * Managing artist events without location information at this point.
 */
jx.lastfm.events = {} ;
jx.lastfm.events.get = function(id){
    var artist = jx.dom.get.value(id);
    var url  = 'http://ws.audioscrobbler.com/2.0/?method=artist.getevents&autocorrect=1&api_key=876c789306d784c59347e153b83b72c0&artist='+artist
    var rpc = jx.ajax.getInstance() ;
    var fn = function(xmlhttp){
        var info = jx.lastfm.events.parse(xmlhttp.responseXML) ;
        jx.lastfm.events.render('library.artist.events',info);
    }
    rpc.send(url,fn,'GET')
}//-- end lastfm.events.get

jx.lastfm.events.parse = function(xml){
    var nodes = xml.firstChild.getElementsByTagName('event') ;

    var r = [] ;
    var venue = {} ;
    var loc=null;

    for(var i=0; i < nodes.length; i++){
        venue = {} ;
      for(var j=0; j< nodes[i].childNodes.length; j++){
	entry = nodes[i].childNodes[j] ;
        
        
	if(entry.nodeName.match(/title/i)){
	     ;

            venue.name = entry.firstChild.nodeValue ;
            
	}else if (entry.nodeName.match(/startdate/i)){
            venue.start = entry.firstChild.nodeValue ;
        }
        
        
      }
      loc = (xml.firstChild.getElementsByTagName('location')[i]) ;
      for(var k=0; k < loc.childNodes.length; k++){
        if(loc.childNodes[k].nodeName.match(/name/i)){
            venue.name = loc.childNodes[k].childNodenodeValue ;

        }else if(loc.childNodes[k].nodeName.match(/city/i)){
            venue.city = loc.childNodes[k].firstChild.nodeValue ;
            
        }else if(loc.childNodes[k].nodeName.match(/country/i)){
            venue.country = loc.childNodes[k].firstChild.nodeValue ;
        }
      }
      
      //
      //
      r.push(venue)
    }
    return r;
}

/**
 * @param id    DOM object identifier
 * @param rec   Array list of objects width attributes {name,start,end,city,country}
 */
jx.lastfm.events.render=function(id,rec){
    jx.dom.set.value(id,'') ;
    var panel = document.createElement('DIV') ;
    panel.style['padding']  = '3px' ;
    panel.align='left'
    panel.style['height']    = '130px' ;
    panel.style['overflow'] = 'auto'
    panel.style['margin']   = '2px'
    for(var i=0; i < rec.length; i++){

        title = document.createElement('DIV') ;
        title.innerHTML = ('<span style="text-transform:capitalize; font-weight:bold">'+rec[i].name+'</span><div style="margin-left:5px">'+rec[i].start+'</div><div style="margin-left:5px">'+rec[i].city+', '+rec[i].country+'</div>') ;
        title.className = 'nytimes';
        title.style['font-size'] = '12px' ;
        title.style['text-transform'] = 'capitalize'
        title.style['border-top'] = '1px dotted white'
        panel.appendChild(title)
    }

    jx.dom.append.child(id,panel)

}
