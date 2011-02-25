var updater={
  uri:null,
  version:null,
  init:function(){
    var url = 'version.json' ;
    var fn = function(xmlhttp){
      var current = eval("("+xmlhttp.responseText+")") ;
      jx.dom.set.value('version','version '+ current.version+' '+current.release+'-'+current['code.name']) ;
      updater.uri = current.uri ;
      updater.version = parseFloat(current.version) ;
      updater.lookup() ;
    }
    jx.ajax.run(url,fn,'GET') ;
  },
  lookup:function(){
    var fn = function(xmlhttp){
      var r = eval("("+xmlhttp.responseText+")") ;
      r.version = parseFloat(r.version) ;
      if(r.version < updater.version){
	jx.dom.set.value('alert','') ;
	
      }else if(r.version > updater.version){
	jx.dom.set.value('alert',r.version+' New version available') ;
      }
      //setTimeout(updater.lookup,600) ;
    }//-- end of inline function
    jx.ajax.send(updater.uri,fn,'GET') ;
    
  }
}