var updater={
  
  init:function(){
    var url = 'version.json' ;
    var fn = function(xmlhttp){
      var current = eval("("+xmlhttp.responseText+")") ;
      jx.dom.set.value('version','version '+ current.version+' '+current.release+'-'+current['code.name']) ;
    }
    jx.ajax.run(url,fn,'GET') ;
  },
  lookup:function(){

  }
}