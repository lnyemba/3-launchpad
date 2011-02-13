/**
* (c) 2010 - 2011 3-launchpad, nyemba@gmail.com
* Dropbox API
* 
*/

var dstore={
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
      jx.dom.set.value('dstore.status','Please wait ...');
      var fbrowser = air.File.documentsDirectory ;
      var setLibrary=function(e){
	  dstore.library.name = e.target.name ;
	  dstore.library.path = e.target.nativePath
	  jx.dom.set.value('dstore.status','Loading, Please wait ...')  ;
	  dstore.getPlaylist(dstore.library.path) ;
	  dstore.load() ;
	  dstore.save();
	  
      } ;
      fbrowser.addEventListener("select",setLibrary) ;
      fbrowser.browseForDirectory("Dropbox Folder");
  },//-- end dstore.init.browse
  lookup:function(){
    
    var callback=function(rec){
      
      if(rec.data != null && rec.data[0].value !="{}"){
	var stream = Base64.decode(rec.data[0].value) ;
	var json = eval("("+stream+")")  ;
	if(json != null){
	  dstore.library = json ;
	 //L air.trace("done here "+dstore.library.path) ;
	  
	 
	}
      }
    }
    var sql = "select * from params where alias='dropbox.library'" ;
    try{
      var path = air.File.applicationStorageDirectory.resolvePath("3launchpad.db3") ;
      sqlite.run.query("3launchpad.db3",sql,callback) ;
    }catch(error){
      air.trace(error.message) ;
    }
  }//-- end dstore.init.lookup()
  
  },//-- end dstore.init
  load:function(){
    
    var path = dstore.library.path ;
  
    //--
    try{
      if(dstore.library.playlist.length > 0){
	if(path != null){
	    path = (path.length > 40)?(path.substring(0,40)+'...'):path
	}

	jx.dom.set.value('dfolder',path) ;
	jx.dom.set.value('dstore.status','<b style="color:black">Yeah!!</b> Dropbox library has been indexed') ;
	jx.dom.set.value('dstore.size',dstore.library.playlist.length) ;
	jx.dom.set.value('dstore.owners',dstore.library.owners.meta.length) ;
	jx.dom.set.value('menu.dstore.size',dstore.library.playlist.length) ;
	jx.dom.show('dstore.report') ;
	library.register('dropbox',dstore.library)  ;
      }else{
	  dstore.reset() ;
      }
    }catch(error){
      
      jx.dom.set.value('dstore.status','an error occurred') ;
    }
  },//-- end dstore.load()
  save:function(){
    var stream = JSON.stringify(dstore.library) ;
    //-- saving the json stream to the backend    
    stream = Base64.encode(stream);    
    sqlite.run.cmd('3launchpad.db3',"update params set value='"+stream+"' where alias='dropbox.library'") ;
  },//-- end dstore.save()
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
	entry.owner = 'Dropbox Music' ;
	jx.dom.set.value('dstore.status','&bull; '+entry.name) ;
	if(dstore.library.owners.data[entry.owner] == null){
	  dstore.library.owners.data[entry.owner] = [] ;
	  dstore.library.owners.meta.push(entry.owner) ;
	  
	}
	
	dstore.library.playlist.push(entry);
	dstore.library.owners.data[entry.owner].push(entry)
      }else if(list[i].isDirectory == true){
	jx.dom.set.value('dstore.status','Processing '+list[i].name) ;
	dstore.getPlaylist(list[i].nativePath) ;
      }
    }
    
    
    
  },
  reset:function(){
    jx.dom.set.value('folder','[unknown]') ;
    jx.dom.set.value('dstore.status','&nbsp;') ;
    
    
    
    
    jx.dom.hide('dstore.report') ;
    jx.dom.set.value('dstore.size','00') ;
    jx.dom.set.value('menu.dstore.size','00') ;
    
    dstore.library = {
      playlist:[],
      owners:{
	meta:[],
	data:{}
      }
      
    }
    dstore.save();
  },//-- dstore.reset()
  showSongs:function(){
    
    if(dstore.library.playlist.length > 0){
      var table = playlist.init(dstore.library.playlist) ;
      table.width='100%'
      table.style['border']='1px solid #d3d3d3'
    //
    //jquery sliding effects and then loading the data
    //
     
     jx.dom.set.value('dstore.song.count',table.rows.length.toFixed(2)) 
      $('#lfipanel').slideUp() ;
      $('#lfpanel').slideDown(); 
     jx.dom.append.child('dstore.songs',table) ; 
     
    }else{
      jx.dom.set.value('dstore.status','Music is not yet indexed, Please scan folder') ;
    }
  }
  
}