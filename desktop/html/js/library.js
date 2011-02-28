var library={
  keys:['local','google','dropbox'],
  current:null,
  cache:{},
  register:function(key,pointer){
      library.cache[key] = pointer;
      menulib.open(key) ;
      menulib.open('all');
      //library.render('menulib','all')
    
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
	 table.width='100%'
	 table.id = (target+'.table') ;
	jx.dom.append.child(target,table) ;
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