/**
* (c) 2010 - 2011 3-Launchpad
* Local music player, Steve L. Nyemba <nyemba@gmail.com>

*/

var lstore={
  library:{
    path:null,
    playlist:[],
    owners:{
      meta:[],
      data:{}
    }
  },
  init:{
    
    browse:function(){
      jx.dom.set.value('lstore.status','Please wait ...');
      var fbrowser = air.File.documentsDirectory ;
      var setLibrary=function(e){
	  lstore.library.name = e.target.name ;
	  lstore.library.path = e.target.nativePath
	  jx.dom.set.value('lstore.status','Loading, Please wait ...')  ;
	  lstore.getPlaylist(lstore.library.path) ;
	  lstore.load() ;
	  lstore.save();
	  
      } ;
      fbrowser.addEventListener("select",setLibrary) ;
      fbrowser.browseForDirectory("Music Folder");
  },//-- end lstore.init.browse
  lookup:function(){
    
    var callback=function(rec){
      
      if(rec.data != null && rec.data[0].value !="{}"){
	var stream = Base64.decode(rec.data[0].value) ;
	var json = eval("("+stream+")")  ;
	if(json != null){
	  lstore.library = json ;
	 //L air.trace("done here "+lstore.library.path) ;
	  
	 
	}
      }
    }
    var sql = "select * from params where alias='local.library'" ;
    try{
      var path = air.File.applicationStorageDirectory.resolvePath("3launchpad.db3") ;
      sqlite.run.query("3launchpad.db3",sql,callback) ;
    }catch(error){
      air.trace(error.message) ;
    }
  }//-- end lstore.init.lookup()
  
  },//-- end lstore.init
  load:function(){
    
    var path = lstore.library.path ;
  
    //--
    try{
      if(lstore.library.playlist.length > 0){
	if(path != null){
	    path = (path.length > 40)?(path.substring(0,40)+'...'):path
	}

	jx.dom.set.value('folder',path) ;
	jx.dom.set.value('lstore.status','complete, Local library has been indexed') ;
	jx.dom.set.value('lstore.size',lstore.library.playlist.length) ;
	jx.dom.set.value('lstore.owners',lstore.library.owners.meta.length) ;
	//jx.dom.set.value('menu.lstore.size',lstore.library.playlist.length) ;
	jx.dom.show('lstore.report') ;
	library.register('local',lstore.library)  ;
      }else{
	  lstore.reset() ;
      }
    }catch(error){
      jx.dom.set.value('lstore.status','an error occurred') ;
    }
  },//-- end lstore.load()
  save:function(){
    var stream = JSON.stringify(lstore.library) ;
    //-- saving the json stream to the backend    
    stream = Base64.encode(stream);
    air.trace(stream);
    sqlite.run.cmd('3launchpad.db3',"update params set value='"+stream+"' where alias='local.library'") ;
  },//-- end lstore.save()
  getPlaylist:function(path){
    var parent = new air.File(path) ;
    var list = parent.getDirectoryListing() ;
    for(var i=0; i < list.length; i++){
      if(list[i].extension == 'mp3' && list[i].isDirectory == false){
	entry = {};
	entry.name = list[i].name ;
	entry.name = entry.name.replace('.mp3','') ;
	//entry.name = (entry.name.length > 30)?(entry.name.substring(0,30)+'...'):entry.name ;
	entry.uri = ('file://'+list[i].nativePath)
	entry.owner = 'Local Music' ;
	if(library.exists(lstore.library.playlist, entry.uri) == true){
	  air.trace("ignoring ..." + entry.uri)
	  continue ;
	}
	jx.dom.set.value('lstore.status','&bull; '+entry.name) ;
	if(lstore.library.owners.data[entry.owner] == null){
	  lstore.library.owners.data[entry.owner] = [] ;
	  lstore.library.owners.meta.push(entry.owner) ;
	  
	}
	
	lstore.library.playlist.push(entry);
	lstore.library.owners.data[entry.owner].push(entry)
      }else if(list[i].isDirectory == true){
	jx.dom.set.value('lstore.status','Processing '+list[i].name) ;
	lstore.getPlaylist(list[i].nativePath) ;
      }
    }
    
    
    
  },
  reset:function(){
    jx.dom.set.value('folder','[unknown]') ;
    jx.dom.set.value('lstore.status','&nbsp;') ;
    
    
    
    
    jx.dom.hide('lstore.report') ;
    jx.dom.set.value('lstore.size','00') ;
    //jx.dom.set.value('menu.lstore.size','00') ;
    
    lstore.library = {
      playlist:[],
      owners:{
	meta:[],
	data:{}
      }
      
    }
    library.register('local',null)  ;
    lstore.save();
  },//-- lstore.reset()
  showSongs:function(){
    
    if(lstore.library.playlist.length > 0){
      var table = playlist.init(lstore.library.playlist) ;
      table.width='100%'
      table.style['border']='1px solid #d3d3d3'
    //
    //jquery sliding effects and then loading the data
    //
     
     jx.dom.set.value('lstore.song.count',table.rows.length.toFixed(2)) 
      $('#lfipanel').slideUp() ;
      $('#lfpanel').slideDown(); 
     jx.dom.append.child('lstore.songs',table) ; 
     
    }else{
      jx.dom.set.value('lstore.status','Music is not yet indexed, Please scan folder') ;
    }
  },
  //
  // The section below is intended to address file association i.e if a user clicks on a file and 3-launchpad is opened
  // we need to have registrable events/function that will be loaded into the adobe air core applicaton
  // Synposis:
  //	the argument is sent (the fully qualified path of the mp3 document
  //	Once received we will search in the library:
  //		a. If the item is found we add it to the playlist (i.e now playing)
  //		b. If the item is NOT found we add it to the indexed library and addit to the playlist (i.e now playing)
  //
  events:{
    OpenFile:function(event){
      var dir = event.currentDirectory;
      
      
      var entry = null;
      if(event.arguments.length != 1){
	return ;
      }
      var file = dir.resolvePath(event.arguments[0]) ;
      entry  = library.find(lstore.library.playlist,'uri',('file://'+file.nativePath)) ;
      //
      
      if(entry == null){
	entry = {} ;
	entry.uri = 'file://'+file.nativePath ;
	entry.name =file.name.replace('.mp3','') ;
	entry.owner = 'Local Music' ;
	lstore.library.playlist.push(entry) ;
	lstore.save() ;
	lstore.load();
      }
      
      player.add(entry) ;
      //
      // let's open the window so the user sees what is now playing
      //
      utils.modules.show('player');
    }//-- lstore.events.OpenFile(event)
  }
  
}
