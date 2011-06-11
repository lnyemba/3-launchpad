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
      
      library.render()



    
  },//-- end library.set(key,pointer
  get:function(keys){
    var table = document.createElement('TABLE') ;
    return table;
  },
  render:function(filter){
    var lib =[],index=0;
    for(var key in library.cache){
        if(library.cache[key] == null || (filter != null && filter != key) ){
            continue ;
        }

        for(var j=0; j< library.cache[key].playlist.length; j++){
            lib[index] = library.cache[key].playlist[j] ;
            ++index;
        }
        
        //air.trace(lib.length)
    }
    grid = jx.grid.from.map.get(['name'],lib) ;
    grid.id = 'library.songs'
    grid.className = 'data-grid'
    grid.width = '100%' ;
    
    library.addInfo(grid,lib)
    //
    // adding extra
    jx.dom.set.value('library.grid','') ;
    jx.dom.append.child('library.grid',grid)

     
  },//-- library.render(filter)

  addInfo:function(table,lib){
      for(var i=0; i < table.rows.length; i++){
          div = document.createElement('DIV') ;
          div.className='small'
          div.style['font-weight'] = 'normal'
          div.innerHTML = ('&rsaquo;&rsaquo; '+lib[i].owner) ;
          table.cellSpacing = '1px'
          table.rows[i].cells[0].appendChild(div)
          table.rows[i].cells[0].info = lib[i] ;
          table.rows[i].className = 'data-row action'
          input = document.createElement('INPUT') ;
          input.type = 'image'
          input.src                 = 'img/default/edit.png' ;
          input.file    = lib[i].name
          input.index   = i;
          input.onclick=function(){
              id3 = (table.rows[this.index].info == null)?null:table.rows[this.index].info.id3 ;
              jx.dom.set.value('id3.file',this.file) ;
              jx.dom.set.value('id3.index',this.index)
              if(id3 != null){
                  jx.dom.set.value('id3.artist',id3.artist) ;
                  jx.dom.set.value('id3.song',id3.song) ;
                  jx.dom.set.value('id3.album',id3.album)
              }
              jx.dom.set.style('id3handler','width','0px')
              jx.dom.show('id3handler')

              $('#id3handler').animate({width:'60%'});
          }
          td = document.createElement('TD')
          table.rows[i].appendChild(td)
          table.rows[i].cells[1].appendChild(input) ;
          table.rows[i].cells[0].onclick = function(){
              //
              // adding data to the now playing when a  click is received
              
              jx.dom.set.value('library.status','added to playlist')
              player.add(this.info)
              //window.setTimeout(function(){jx.dom.set.value('library.status','') }, 2000) ;
          }
      }

  },//-- end library.addInfo()
  setId3Info:function(){
      var table = document.getElementById('library.songs') ;
      
      var index = parseInt(jx.dom.get.value('id3.index')) ;
      var id3 = {} ;
      id3.artist = jx.dom.get.value('id3.artist') ;
      id3.song  = jx.dom.get.value('id3.song') ;
      id3.album = jx.dom.get.value('id3.album') ;
      if(id3.artist != '' || id3.song != '' || id3.album != ''){
          table.rows[index].info.id3 = id3 ;
      }
      jx.dom.set.value('id3.artist','') ;
      jx.dom.set.value('id3.song','') ;
      jx.dom.set.value('id3.album','')
  },//-- library.setId3Info()
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
library.nav.offset  = 675 ; // offset in pixels
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
/**
 * This function will jump to a particular div/panel within a navigation window
 * @param index Index of the window to be shown in the panel
 */
library.nav.to=function(index){
    
    if(index < 0 || index > library.nav.size-1){
        return ;
    }
    var id = '#'+library.nav.panel ;
    //$(id).animate({'margin-left':0}) ;
    jx.dom.set.style(library.nav.panel,'margin-left',0)
    //
    // performing the jump
    position = -index * library.nav.offset ;
    
    $(id).animate({'margin-left':position}) ;
}
/**
 * Managing library shortcuts with a basic premice: Should an object
 *
 */
library.shortcut = {}
/**
 * Opens a particular library or the initialization for associated to the library
 * @param id    identifier {google,local,dropbox}
 */
library.shortcut.open = function(id){
    if(library.cache[id] == null){
        //
        // open the
        
        utils.modules.show('providers'); 
        jx.dom.show('player'); 
        jx.dom.show('player_stdout'); 
        jx.dom.show(id); 
        jx.dom.show('providers.stdout') ;
    }else{
        //
        // TODO Perform the jump and
        library.nav.to(1)
        library.render(id)
    }
}//-- end library.shortcut.open(id)