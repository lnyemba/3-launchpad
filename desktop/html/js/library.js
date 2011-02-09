var library={
  keys:['local','google','dropbox'],
  current:null,
  cache:{},
  register:function(key,pointer){
      library.cache[key] = pointer;
    
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
	jx.dom.append.child(target,table) ;
	library.current = key ;
     }
     
  }//-- library.render(target,key)
  
}