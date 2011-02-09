/**
*
* This is the implementation of lazy binding that will help work around the adobe air security sandbox
* dependencies:
*	adobe air 	2.0+
*	jxf (dom)`	0.9
*/

if(!jxbinder){
	var jxbinder={}
}

jxbinder.read=function(location){
    var path    = (new air.File()).resolvePath(air.File.applicationDirectory.nativePath+'/html/'+location) ;
    var file    = new air.File('file:///'+path.nativePath) ;
    var istream = new air.FileStream();
    istream.open(file,air.FileMode.READ) ;
    var str     = istream.readMultiByte(file.size, air.File.systemCharset);
    istream.close() ;
    return str;
}

jxbinder.load=function(page,target,bindfile){
	var html 	= jxbinder.read(page) ;
	var div 	= document.createElement('DIV') ;
	div.innerHTML = html ;
	jx.dom.set.value(target,'') ;
	jx.dom.append.child(target,div) 
	//
	// if binding instruction is provided then we perform event binding
	// short of that loading will be the only thing to be done
	//
	if(bindfile!= null){
	  jxbinder.bind(bindfile) ;
	}
	
}

function compile(var1, var2){
    var self = this;
    return function(){ self[var1](var2) };
}
jxbinder.bind=function(file){
  var json = eval("("+jxbinder.read(file)+")") ;
  var dom,events,pointer,method;
  for(var i=0; i < json.length; i++){
    dom = document.getElementById(json[i].id) ;
    events = json[i].events ;
    if(dom != null && events!= null){
      
      for(var j=0; j < events.length; j++){
	  method = events[j].method ;
	  pointer= events[j].pointer;
	  pointer= compile(method,pointer) ;
	  air.trace(pointer) ;
	  
	
      }
    }
  }
}
