var library={
  keys:['local','google','dropbox'],
  current:null,
  cache:{},
  register:function(key,pointer){
      library.cache[key] = pointer;
      menulib.open(key) ;
      menulib.open('all');
      library.render('menulib','all')
    
  },//-- end library.set(key,pointer
  get:function(keys){
    var table = document.createElement('TABLE') ;
    return table;
  },
  render:function(target,key){
    var pointer ;
    if(key == 'all'){
      pointer = {}  ;
      pointer.playlist = [] ;
      for(var i=0; i < library.keys.length; i++){
	key = library.keys[i] ;
	
	if(library.cache[key] != null){
	  for(var j=0; j < library.cache[key].playlist.length; j++){
	    pointer.playlist.push(library.cache[key].playlist[j]) ;
	  }
	  
	  
	}
      }
      
    }else{
      pointer = library.cache[key] ;
    }
      jx.dom.set.value(target,'') ;
     if(pointer != null){
	var table = playlist.init(pointer.playlist) ;
	table.className = 'rounded-corners'
	table.width = '100%'
	table.id = (target+'.table') ;
	jx.dom.append.child(target,table) ;
	$('#libr').roundabout({
	 	minOpacity:0.0,
		minScale:0.1
	 }) ;
	library.current = key ;
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
		      jx.dom.append.child(target,table) ;
		    }
		    jx.dom.append.child(target,div) 
		  }
	  }
}//-- end library.showUsers()

