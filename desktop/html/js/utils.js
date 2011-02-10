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
    show:function(base,id){
      jx.dom.hide('default');
      var meta = utils.modules.cache.meta ;
      for(var i=0; i < meta.length; i++){
	jx.dom.hide(meta[i]) ;
	key = meta[i] ;
	pages = utils.modules.cache.pages[key] ;
	for(var j=0; j < pages.length; j++){
	  jx.dom.hide(pages[j].id) ;
	}
      }
      jx.dom.show(base) ;
      $('#'+id).slideDown() ;
      
    }//-- end utils.modules.show(base,id) ;
  },//-- end utils.modules
  menu:{
    show:function(id){
      jx.dom.hide('default');
      jx.dom.show('menu.panel') ;
      var pages = utils.modules.cache.pages['config'] ;
      for(var i=0; i < pages.length; i++){
	jx.dom.hide(pages[i].id) ;
	
      }
      $('#'+id).slideDown() ;
    }//-- end utils.menu.show()
  }//-- end utils.menu
}