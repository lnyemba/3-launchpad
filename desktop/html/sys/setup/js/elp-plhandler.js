/**
* 3-launchpad playlist management
* Steve L. Nyemba <nyemba@gmail.com>
*
* This file encapsulates functionalities around playlist handling:
*	- search the playlist
*	- create a playlist
*	- share the playlist (later)
* This namespace will depend on elp.system namespace accessing the raw library of music on elp.system.remotefiles
*/
elp.media.plhandler={
	list:{data:[],owners:{meta:[],data:{}}},
	cache:[],

	showplaylist:function(){
		jx.dom.hide('remote.panel'); 
		jx.dom.show('set.playlist'); 
		jx.dom.hide('save.playlist'); 
		//jx.dom.hide('new.playlist.panel2'); 
		jx.dom.show('mp3player')
	},//-- end elp.media.plhandler.showplaylist
	get:{
		list:function(){
			return elp.media.plhandler.list  ;

		}//-- end elp.media.plhandler.get.list() ;
	},
	save:function(){
		//
		// This operation will save the playlist entered and songs selected
		// TODO:Make sure to inspect duplicates
		//
		var owner = jx.dom.get.value('playlist.name') ;
		var cache = elp.media.plhandler.cache ;
		
		if(elp.media.plhandler.cache.length == 0 || owner.length < 0){
			jx.dom.set.style('background-color','yellow') ;	
			return ;
		}else{
			//
			//TODO: Find an elegant way of performing this ... 
			for(var i=0; i < cache.length; i++){
				cache[i].owner = owner ;
				elp.media.plhandler.list.data.push(cache[i]) ;
			}
			elp.media.plhandler.list.owners.meta.push(owner) ;
			elp.media.plhandler.list.owners.data[owner] = cache.length ;
			elp.system.html.render.remotefiles()
			//elp.media.plhandler.init()
			//
			// now we need to show the playlist because our data has been saved
			//
			jx.dom.set.value('playlist.name','[Playlist Name]') ;
			elp.media.plhandler.showplaylist() ;

		}
		elp.media.plhandler.cache = new Array() ;
	},//-- end elp.media.plhandler.save(),
	search:function(qid,dbase){
		var keyword 	= jx.dom.get.value(qid);
		keyword		= keyword.toLowerCase() ;
		var table 	= document.getElementById(dbase) ;
		var records	= elp.system.remotefiles.data;
		var name;
		for(var i=0; i < table.rows.length; i++){
			name = table.rows[i].cells[0].innerHTML.toLowerCase() ;
			table.rows[i].style['display'] = '';
			if(keyword.length > 0 && name.match(keyword)==null){
				table.rows[i].style['display'] = 'none' ;
			}
			
		}

	}//-- end elp.media.plhandler.search()
}//-- end elp.media.plhandler


