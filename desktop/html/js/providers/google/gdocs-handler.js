/**
* (c) 2010-2011 3-Launchpad
* 3-Launchpad, Steve L. Nyemba <nyemba@gmail.com>
* This file will handle google as a storage provider. The following functions are expected:
*/

var gstore={
	library:null,
	login:{
		init:function(){
		    gstore.library = null;
		    jx.dom.set.value('gstore.status','Please wait ...') ;
			gapi.login.init('email','password',gstore.getmusic,gstore.login.error) ;
		},//-- end gstore.login.init()
		cancel:function(){
			jx.dom.set.value('email','') ;
			jx.dom.set.value('password','') ;
			jx.dom.set.value('gstore.status','') ;
			
			
			//jx.dom.set.value('menu.gstore.size','00') ;
			jx.dom.set.value('gstore.size',0) ;
			jx.dom.set.value('gstore.owners',0) ;
			jx.dom.hide('gstore.report') ;
			gstore.library=null;
			library.register('google',null)  ;
		},//-- end gstore.login.cancel
		error:function(){
		  jx.dom.set.value('gstore.status','unable to login, email/password error') ;
		}//-- gstore.login.error()
		
	},
	getmusic:function(next){
		var url = 'https://docs.google.com/feeds/default/private/full?q=.mp3 -.doc'
		var callback=function(xmlhttp){
		  gstore.library = gapi.gdocs.parse(xmlhttp.responseXML) ;
		  //
		  // let's make sure we don't need to page through this
		  //
		  link = xmlhttp.responseXML.firstChild.getElementsByTagName('link') ;
		  next = null;
		  for(var i=0; i < link.length; i++){
		      if(link[i].attributes[0].nodeValue == 'next'){
			next = (link[i].attributes['2'].nodeValue) ;
			
			break;
		      }
		  }
		  //
		  // correcting a minor disconnect that came up when working with local files
		  // a slight change in the data structure (oops)
		  //
		  gstore.library.playlist = gstore.library.data ;
		  jx.dom.set.value('gstore.status','<b style="color:black">Yeah !!</b> Music found and indexed');
                  var grid = jx.grid.from.map.get(['name'],gstore.library.playlist) ;
		  //library.register('google',gstore.library)  ;
                  gstore.render(grid)
		  gstore.getNextPage(next) ;
		  
		}//-- end of inner function call ...
		jx.dom.set.value('gstore.status','Please wait while retrieving music')
		jx.ajax.run(url,callback,'GET') ;
	},//-- end gstore.getmusic()
	/**
	* Because google does NOT return the entire list of songs through it's api and provides paging
	* we will fetch the next pages here and append them to the existing library ....
	*/
	getNextPage:function(uri){
	  //
	  callback=function(xmlhttp){
	    lib = gapi.gdocs.parse(xmlhttp.responseXML) ;
	    
	    //gstore.library.playlist.concat(lib.data) ;
	    for(var i=0; i < lib.data.length; i++){
                gstore.library.playlist.push(lib.data[i]) ;
                owner 	= lib.data[i].owner ;
                info	= lib.data[i] ;
                //
                // There are no guarantees that the first 100 records will have all the owners
                // so we check for owners and accomodate the array for them
                //
                if(gstore.library.owners.data[owner] == null){
                    gstore.library.owners.data[owner]  = [] ;
                }
                gstore.library.owners.data[owner].push(info) ;
	    }
	    
            jx.dom.set.value('gdocs.size',gstore.library.playlist.length);

            var grid = jx.grid.from.map.get(['name'],gstore.library.playlist) ;
            
            gstore.render(grid)
	    

	    
	  }
	  jx.ajax.run(uri,callback,'GET') ;
	},//-- gstore.getNextPage(uri)
	render:function(table){
            table.id = 'gdocs.music'
            table.className = 'data-grid'
            list = gstore.library.playlist ;
            library.register('google',gstore.library)  ;
            for(var i=0; i < list.length; i++){
                table.rows[i].info      = list[i]
                table.rows[i].headers   = gapi.headers ;
                div = document.createElement('DIV') ;
                div.innerHTML = '&rsaquo;&rsaquo; google ('+list[i].owner+')' ;
                div.className = 'medium'
                div.style['font-weight'] = 'normal'
                table.rows[i].cells[0].appendChild(div) ;

                edit= document.createElement('INPUT') ;
                edit.type = 'image'
                edit.src= 'img/default/edit.png'
                edit.style['float'] = 'right' ;
                edit.style['margin-top'] = '-20px'
                table.rows[i].cells[0].appendChild(edit);
            }
            jx.dom.set.value('gdocs.files.grid','')
            jx.dom.append.child('gdocs.files.grid',table)
            jx.dom.hide('gdocs.login')
            jx.dom.show('gdocs.files') ;
            jx.dom.set.value('providers.lib.size',library.size) ;

	  
	},//-- end gstore.render()
	showUsers:function(target){
	  if(library.current != 'google' || gstore.library == null){
	    return ;
	  }
	  jx.dom.set.value(target,'') ;
	  var owners = gstore.library.owners.meta ;
	  for(var i=0; i < owners.length; i++){
	    div 		= document.createElement('DIV') ;
	    span		= document.createElement('DIV');
	    songs		= document.createElement('DIV');
	    songs.innerHTML	= ('songs '+gstore.library.owners.data[owners[i]].length)
	    songs.style['margin-left'] = '10px'
	    span.innerHTML 	= owners[i] ;
	    span.style['font-weight'] = 'bold'
	    
	    div.className 	= 'shaded action'
	    div.style['height']		= '35px'
	    div.style['border']		= '1px solid white';
	    if(owners.length == 1){
		div.style['width']		= '100%'
	    }
	    span.style['margin-left'] = '10px'
	    
	    
	    div.appendChild(span)
	    div.appendChild(songs);
	    div.data = gstore.library.owners.data[owners[i]] ;
	    div.onclick=function(){
	      jx.dom.set.value(target,' ') ;
	      var table = playlist.init(this.data) ;
	      table.width = '100%'
	      table.id = target+'.table' ;
	      jx.dom.append.child(target,table) ;
	    }
	    jx.dom.append.child(target,div) 
	  }
	}//-- end gstore.showUsers()
}//-- end gstore
