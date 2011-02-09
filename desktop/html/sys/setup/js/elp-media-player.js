/**
* 3-launchpad 0.3
* This file implements the music player and associated functionalities:
*	play; pause; next; stop
* dependencies:
*	1. adobe air 	(AIRAliases.js)
*	2. jxf dom	(dom.js)
*/
elp.media={
	playlist:[],
	track:0,
	position:null,
	player:null,
	channel:null,
	timer:null,
	trans:null,
	panCounter:0,
	mode:'none',	// {x: none; &xi; all 1: song
	init:function(uri){
		var prequest= new air.URLRequest(uri) ;
		prequest.method = 'GET';
		if(elp.media.trans == null){
			//
			// It seems the second parameter is the balance (mother f***)
			// we should work on scaling volume and not changing balance of output
			//
			elp.media.volume.transform = new air.SoundTransform(0.25,0) ;
			//elp.media.timer = setInterval(elp.media.progress,100) ;
		}
		//
		// adding headers to the request with authentication information and other google sensitive stuff
		//
		var headers = jx.ajax.headers;
		var reqHeader;
		for(var i=0; i < headers.length; i++){
			reqHeader = new air.URLRequestHeader(headers[i].key,headers[i].value) ;
			prequest.requestHeaders.push(reqHeader) ;
		}
		var player = elp.media.player;
		if(player != null){			
			elp.media.stop();
			elp.media.reset();
			elp.media.player = null;
		}
		player = new air.Sound() ;
		player.addEventListener("complete",elp.media.play)
		player.addEventListener("id3",elp.media.id3handler) ;
		player.addEventListener("progress",elp.media.progress);
		player.addEventListener("ioError",elp.media.error)
		player.addEventListener("soundComplete",elp.media.soundComplete);
		player.load(prequest) ;
		elp.media.player = player;
		//elp.media.play();

	},
	reset:function(){
		//
		// This function implements the resetting of the player:
		// we can offer to reset as follows:
		//	- reset everything
		//	- preserve (track #; and current song)
		// The variables subject to reset are the following:
		//	- event handlers complete,id3, progress, ioError, soundComplete
		//	- variables	track,channel,player,position
		//
		var resetEvents=function(){
			elp.media.player.removeEventListener("complete",elp.media.play) ;
			elp.media.player.removeEventListener("id3",elp.media.id3handler);
			elp.media.player.removeEventListener("progress",elp.media.progress);
			elp.media.player.removeEventListener("ioError", elp.media.error);
		}

		//-- end of inline function to reset Events
		if(elp.media.player != null){
			resetEvents() ;
		}

	},
	id3handler:function(event){
		try{
			var artist = event.target.id3['artist'];
			var song   = event.target.id3['songName']
			//air.trace(artist+'\n'+song) ;
		}catch(error){
			artist = 'unknown';
			song = 'unknown';
		}
		if(artist == null || artist == '') artist = 'unknown';
		if(song == null || song.length == '') song = 'unknown' ;
		jx.dom.set.value('artist',artist) ;
		jx.dom.set.value('song',song) ;
		//air.trace(event.target.id3.comment) 
		
	},
	progress:function(event){
		if(elp.media.player == null){
			
		}else{
			var level = Math.round(100 * (event.bytesLoaded / event.bytesTotal));
			jx.dom.set.value('progress',level+' %');
			var fn = function(){
				jx.dom.set.value('progress','[<span color="#104E8B">Playing</span>]')
			}
			if(level == 100){
				setTimeout(fn,2000);
			}
		}
	},//-- end elp.media.progress
	soundComplete:function(event){
		jx.dom.show('play');
		jx.dom.enable('play');
		jx.dom.hide('pause');
		var mode = elp.media.mode ;
		elp.media.stop() ;
		elp.media.position = null;
		clearInterval(elp.media.timer);
		if(mode == 'song'){
			elp.media.play() ;
		}else if(mode=='all'){
			elp.media.next() ;
		}
		
	},//-- end elp.media.soundComplete
	play:function(){
		if(elp.media.player != null){
			if(elp.media.position == null){
				elp.media.position = 0 ;
			}
			//air.trace(elp.media.position) ;
			elp.media.channel = elp.media.player.play(elp.media.position,1,elp.media.volume.transform) ;
			elp.media.channel.addEventListener(air.Event.SOUND_COMPLETE,elp.media.soundComplete);
			jx.dom.set.value('progress','[<span color="#104E8B">Playing</span>]')
		}
		jx.dom.set.css('play','outbutton')
		jx.dom.hide('play');
		jx.dom.show('pause');

	},
	pause:function(){
		jx.dom.hide('pause');
		jx.dom.show('play');
		elp.media.position = elp.media.channel.position ;
		elp.media.channel.stop();
		jx.dom.set.value('progress','[Paused]') ;
	},//--
	stop:function(){
		if(elp.media.player != null){
			if(elp.media.channel!= null){
				//elp.media.channel.removeEventListener(air.Event.SOUND_COMPLETE, elp.media.soundComplete);
				elp.media.channel.stop();
				//if(elp.media.timer != null)clearInterval(elp.media.timer);
				//elp.media.trans = null;

				
			}
			//elp.media.player.removeEventListener("complete",elp.media.play) ;
			//elp.media.player.removeEventListener("progress",elp.media.progress);
					}
				
		elp.media.channel 	= null;
		elp.media.position	= 0;
		jx.dom.set.value('progress','00 %')
		jx.dom.hide('pause');
		jx.dom.show('play');
	},
	next:function(){
		//
		// let's check the current track index 
		var table = document.getElementById('playlist') ; 
		var index = elp.media.track ;
		if(index == -1){
			index = 0;
		}
		if(index+1 < table.rows.length){
			index +=1 ;
		}else if(elp.media.mode=='all'){
			air.trace("=========== last song");
			index = 0;
		}
		table.rows[index].cells[0].onclick();

	},
	prior:function(){
		var index = elp.media.track ;
		var table = document.getElementById('playlist') ;
		if(index > 0){
			index -=1 ;		
		}else{
			index = table.rows.length - 1 ;
		}
		table.rows[index].cells[0].onclick() ;

	},
	playbackcomplete:function(event){},//-- end elp.media
	setmode:function(value){
		elp.media.mode = value;
	},
	error:function(event){
		//
		// when an error occurs we must signal the user an error occurred
		// TODO: Log the error and make sure the user can send us a report or not
		//
		air.trace(event);
		//if(event.message != null)air.trace(event.message) ;
		jx.dom.set.value('progress','[error]') ;
		elp.media.stop();
		elp.media.reset();
	},
	/**
	*
	*/
	volume:{
		transform:null,
		level:1,
		set:function(value){
			elp.media.volume.transform = elp.media.channel.soundTransform;
			elp.media.volume.transform.volume = value ;
			elp.media.channel.soundTransform = elp.media.volume.transform ;
		},
		up:function(){
			if(elp.media.channel == null) return ;
			var value = parseFloat(elp.media.volume.transform.volume) ;
			if(value +0.25 < 1.25){
				elp.media.volume.set(value+0.25) ;
				jx.dom.set.value('volume',(value+0.25)*100)
			}
		},//--
		down:function(){
			if(elp.media.channel == null) return ;
			var value = parseFloat(elp.media.volume.transform.volume) ;
			if(value -0.25 > -0.25){
				elp.media.volume.set(value -0.25) ;
				jx.dom.set.value('volume',(value-0.25)*100)
			}
		},
		panner:function(){
		}

	}//-- elp.media.volume
}//-- end elp.media


