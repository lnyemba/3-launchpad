/**
* (c) 2010 - 2011 3-launchpad, Steve L. Nyemba
* nyemba@gmail.com
* This is a lastfm API parser version 2.0
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
  }
}