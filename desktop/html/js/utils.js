/**
* (c) 2010 - 2011 3-launchpad
* This file compiles a set of utilities I use across the project:
*
*	util.open	will open a file and render it inside a particular dom
*			caveat: the file must not contain executable code (adobe air restrictions) 
*/
var utils={
  open:function(target,url){
    
    var fn=function(xmlhttp){
      jx.dom.set.value(target,xmlhttp.responseText) ;
    }
    jx.ajax.run(url,fn) ;
  },//-- end utils.open(target,url) 
  modules:{
    cache:{meta:[],pages:{}},
    init:function(alias,uri,id){
      
//       var fn = function(xmlhttp){
	var dom = document.createElement('DIV') ;
	dom.id = alias;
	dom.innerHTML =  jxbinder.read(uri) ;
	dom.style['display'] = 'none' ;
	//jx.dom.append.child(id,dom) ;
	if(utils.modules.cache.pages[id] == null){
	  utils.modules.cache.meta.push(id) ;
	  utils.modules.cache.pages[id] = [] ;
	}
	utils.modules.cache.pages[id].push(dom) ;
//       }
//       jx.ajax.run(uri,fn,'GET') ;

    },
    setup:function(){
      var meta = utils.modules.cache.meta ;
      for(var i=0; i < meta.length; i ++){
	id = meta[i] ;
	pages = utils.modules.cache.pages[id] ;
	for(var j=0; j < pages.length; j++){
	  jx.dom.append.child(id,pages[j]) ;
	}
      }
    },//-- end utils.modules.setup()
    show:function(id){
      //jx.dom.hide('default');
      var meta = utils.modules.cache.meta ;
      for(var i=0; i < meta.length; i++){
	jx.dom.hide(meta[i]) ;
	key = meta[i] ;
	pages = utils.modules.cache.pages[key] ;
	for(var j=0; j < pages.length; j++){
	  jx.dom.hide(pages[j].id) ;
	}
      }
      
      jx.dom.show('stdout') ;
      $('#'+id).slideDown() ;
      
      
    }//-- end utils.modules.show(base,id) ;
  },//-- end utils.modules
  menu:{
    show:function(id){
     // jx.dom.hide('default');
      jx.dom.show('menu.panel') ;
      var pages = utils.modules.cache.pages['config'] ;
      for(var i=0; i < pages.length; i++){
	jx.dom.hide(pages[i].id) ;
	
      }
      $('#'+id).slideDown() ;
    }//-- end utils.menu.show()
  }//-- end utils.menu

}

function search(qid,dbase){
  var keyword 	= jx.dom.get.value(qid);
  keyword	= keyword.toLowerCase() ;
  var table 	= document.getElementById(dbase) ;
  
  if(table == null){
    return ;
  }
  //var records	= elp.system.remotefiles.data;
  var name;
  var info = null;
  
  for(var i=0; i < table.rows.length; i++){
	  //name = table.rows[i].cells[0].innerHTML.toLowerCase() ;
	  info = table.rows[i].info  ;
	  name = info.name.toLowerCase() ;	  
	  owner = info.owner.toLowerCase();
	  table.rows[i].style['display'] = null;
	  if(keyword.length > 0 && name.match(keyword)==null){
		  table.rows[i].style['display'] = 'none' ;
	  }
	  
  }//-- end of loop
}

function rmdb(){
  var file = air.File.applicationStorageDirectory.resolvePath("3launchpad.db3") ;
  file.deleteFile() ;
  player.controls.stop() ;
  window.location.reload(true) ;  
}


