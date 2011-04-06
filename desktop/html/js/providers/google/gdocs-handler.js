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
		var url = 'https://docs.google.com/feeds/default/private/full?q=*.mp3'
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
		  //
		  // TODO: The code below needs to be in it's own section
		  //jx.dom.set.value('menu.gstore.size',gstore.library.playlist.length) ;
		  jx.dom.set.value('gstore.size',gstore.library.playlist.length) ;
		  jx.dom.set.value('gstore.owners',gstore.library.owners.meta.length) ;
		  jx.dom.show('gstore.report') ;
		  
		  library.register('google',gstore.library)  ;
		  gstore.getNextPage(next) ;
		  
		}//-- end of inner function call ...
		jx.dom.set.value('gstore.status','Please wait while retrieving music')
		jx.ajax.run(url,callback,'GET') ;
	},
	/**
	* Because google does NOT return the entire list of songs through it's api and provides paging
	* we will fetch the next pages here and append them to the existing library ....
	*/
	getNextPage:function(uri){
	  //
	  callback=function(xmlhttp){
	    lib = gapi.gdocs.parse(xmlhttp.responseXML) ;
	    air.trace(lib.data.length);
	    //gstore.library.playlist.concat(lib.data) ;
	    for(var i=0; i < lib.data.length; i++){
	      gstore.library.playlist.push(lib.data[i]) ;
	      owner 	= lib.data[i].owner ;
	      info	= lib.data[i] ;
	      gstore.library.owners.data[owner].push(info) ;
	      
	    }
	    
	    jx.dom.set.value('gstore.size',gstore.library.playlist.length) ;
	    jx.dom.set.value('gstore.owners',gstore.library.owners.meta.length) ;
	    jx.dom.show('gstore.report') ;
		  
	    library.register('google',gstore.library)  ;

	    library.register('google',gstore.library)  ;
	  }
	  jx.ajax.run(uri,callback,'GET') ;
	},//-- gstore.getNextPage(uri)
	showSongs:function(){

	  if(gstore.library != null){
	    var table = playlist.init(gstore.library.playlist) ;
	    
	    jx.dom.set.value('gstore.song.count',table.rows.length.toFixed(2)) ;
	    jx.dom.append.child('gstore.songs.library',table) ;
	    $('#gstoreipanel').slideUp() ;
	    $('#gstoremusicpanel').slideDown() ;
	  }else{
	    jx.dom.set.value('gstore.status','Music is not yet indexed, please login first') 
	  }
	},//-- end gstore.showSongs()
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
