var library={
  keys:['local','google','dropbox'],
  current:null,
  cache:{},
  size:0,
  register:function(key,pointer){

      library.cache[key] = pointer;

      //
      // let's evaluate the size of the library. Polymorphism & visitor design pattern are applied in this case
      //
      library.size = 0;
      for(var lib in library.cache){
          
        if(library.cache[lib] == null|| library.cache[lib].playlist == null){
            continue ;
        }
      
        library.size += parseInt(library.cache[lib].playlist.length) ;
      }
      
      library.render('library.grid','all')



    
  },//-- end library.set(key,pointer
  get:function(keys){
    var table = document.createElement('TABLE') ;
    return table;
  },
  render:function(){
    var lib =[],index=0;
    for(var key in library.cache){
        if(library.cache[key] == null){
            continue ;
        }
        for(var j=0; j< library.cache[key].playlist.length; j++){
            lib[index] = library.cache[key].playlist[j] ;
            ++index;
        }
        grid = jx.grid.from.map.get(['name'],lstore.library.playlist) ;
        grid.id = 'library.songs'
        grid.className = 'data-grid'
        jx.dom.set.value('library.grid','') ;
        jx.dom.append.child('library.grid',grid)

        air.trace(lib.length)
    }
    
     
  },//-- library.render(target,key)
  /**
  * This functionw will search a list (or library data) and determine if a particular uri exists or not
  * TODO: Generalize this function (very re-usable to get a handle over duplicate entries)
  */
  exists:function(list,uri){
    var found = false;
      for(var i=0; i < list.length; i++){
	if(list[i].uri == uri){
	  
	  found = true ;
	  break;
	}
      }
    return found ;
  },
  /**
  * This function will return the entry of an item in the list (library) provided the field to look at
  *	entry{uri,name,owner} if the item does NOT exist a null is returned
  * TODO: Generalize this function (very re-usable)
  */
  find:function(list,field,value){
    var entry = null;
    for(var i=0; i < list.length; i++){
      if(list[i][field] == value){
	entry = list[i] ;
	break;
      }
    }
    return entry ;
  }//-- end library.find(list,field,value) ;
}


library.showUsers=function(target){
	  jx.dom.set.value(target,'') ;
		for(var j=0; j < library.keys.length; j++){
		  key = library.keys[j] ;
		  lib 	= library.cache[key] ;
		  if(lib == null) continue ;
		  owners = library.cache[key].owners.meta ;
		  for(var i=0; i < owners.length; i++){
		    div 		= document.createElement('DIV') ;
		    span		= document.createElement('DIV');
		    songs		= document.createElement('DIV');
		    songs.innerHTML	= ('&rsaquo;&rsaquo; songs '+lib.owners.data[owners[i]].length)
		    songs.style['margin-left'] = '10px'
		    songs.className = 'medium';
		    span.innerHTML 	= owners[i] ;
		    span.style['font-weight'] = 'bold'
		    div.className 	= 'shaded action default'
		    div.style['height']		= '35px'
		    div.style['border']		= '1px solid white';
		    if(owners.length == 1){
			div.style['width']		= '100%'
		    }
		    span.style['margin-left'] = '10px'
		    div.appendChild(span)
		    div.appendChild(songs);
		    div.data = lib.owners.data[owners[i]] ;
		    div.onclick=function(){
		      jx.dom.set.value(target,' ') ;
		      var table = playlist.init(this.data) ;
		      table.width = '100%'
		      table.id = 'menulib.table' ;
		      jx.dom.set.value('menulib','');
		      jx.dom.append.child('menulib',table) ;
		      jx.dom.set.value('menu.library.search','') ;
		      jx.dom.set.focus('menu.library.search') ;
		    }
		    jx.dom.append.child(target,div) 
		  }
	  }
}//-- end library.showUsers()

//
// Library navigation
library.nav = {} ;
library.nav.offset  = 723 ; // offset in pixels
library.nav.size    = 4;    // number of panels
library.nav.panel = 'lib_panel'
library.nav.back = function(){
    var id = '#'+library.nav.panel ;
    var xmargin = parseInt($(id).css('margin-left')) ;
    var max =  (library.nav.size-1) * library.nav.offset ;

    if(Math.abs(xmargin) < max){
        xmargin = xmargin  - library.nav.offset ;        
        $(id).animate({'margin-left':xmargin}) ;
    }
}
library.nav.next=function(){
    var id = '#'+library.nav.panel ;
    var xmargin = parseInt($(id).css('margin-left')) ;
    var max = library.nav.size * library.nav.offset ;
    
    if(xmargin != 0){
        xmargin = xmargin  + library.nav.offset ;
        $(id).animate({'margin-left':xmargin}) ;
    }

}

