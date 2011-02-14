var player={
handler:null,
channel:null,
position:null,
index:null,
mode:'none', //{none; song; all}
now:[],
  add:function(info){
      if(info != null){
	player.now.push(info);
      }
      if(player.now.length == 1){
	//
	// we should call the play method
	player.controls.init(0);
	
      }
      table = playlist.init(player.now,'PLAYER_CALLING') ;
      table.width = '100%' ;
      table.id = 'now.playing.songs' ;
      table.cellSpacing = '0px'
      for(var i=0; i < table.rows.length; i++){
	table.rows[i].className = 'medium shaded-dark';
	
	input = document.createElement('INPUT') ;
	input.type = 'checkbox' ;
	td = document.createElement('TD') ;
	td.appendChild(input) ;
	td.valign='middle';
	td.width = '5%'
	table.rows[i].appendChild(td) ;
	
	td = document.createElement('TD') ;
	td.valign='middle';
	td.align='middle';
	td.width='18px';
	div = document.createElement('INPUT') ;
	div.type = 'image' ;
	div.src = 'img/default/remove-song.png'
	//div.innerHTML 	= '[ - ]';
	div.index	= i;
	div.onclick=function(){
	  if(this.index < player.index){
	    player.controls.stop() ;
	    player.controls.reset();
	  }
	  if(this.index < player.now.length){
	    player.now.splice(parseInt(this.index),1) ;
	    table.deleteRow(this.index) ;
	  }
	  if(this.index == player.index){
	    player.controls.stop() ;
	    player.controls.reset() ;
	    player.index = 0;
	  }
	  
	    //player.init(player.init(this.index-1)) ;
	    
	  
	  
	 
	}
	td.appendChild(div);
	table.rows[i].appendChild(td)
      }
      jx.dom.set.value('now.playing','') ;
      jx.dom.append.child('now.playing',table) ;
    },//-- end player.add(info)
  clear:function(){
    player.now = [] ;
    jx.dom.set.value('now.playing','');
    jx.dom.set.value('artist','Unknown') ;
    jx.dom.set.value('song','Uknown') ;
    jx.dom.set.value('progress','0.00 %') ;
    img = document.getElementById('artist.pic') 
    img.src = 'img/default/unknown-artist.jpg';
    player.controls.stop();
  },//-- player.clear()
  controls:{
    
    init:function(index){
      
      info = player.now[index] ;
      if(info == null){
	
	player.clear() ;
	player.controls.reset();
	return ;
      }
      player.index = index ;
      var req = new air.URLRequest(info.uri) ;
      var headers = jx.ajax.headers;
      var reqHeader;
      if(info.uri.match('^http.*$')){
	for(var i=0; i < headers.length; i++){
		reqHeader = new air.URLRequestHeader(headers[i].key,headers[i].value) ;
		req.requestHeaders.push(reqHeader) ;
	}
      }
      var p = player.handler;
      if(p != null){
	player.controls.stop();
	player.controls.reset();
	p = null;
      }
      p = new air.Sound() ;
      p.addEventListener("complete",player.controls.play) ;
      p.addEventListener("id3",player.controls.id3handler) ;
      p.addEventListener("progress",player.controls.progress) ;
      p.addEventListener("ioError",player.controls.error) ;
      p.addEventListener("soundComplete",player.controls.soundComplete) ;
      p.load(req) ;
      player.handler = p;
    },//-- end player.controls.init(index)
    setmode:function(mode){
      player.mode = mode ;
      jx.dom.set.value('mode',mode);
    },//-- end player.setmode(mode)
    play:function(){
      if(player.handler != null){
	if(player.position == null){
	    player.position = 0;
	}
//	if(player.channel == null){
	  player.channel = player.handler.play(player.position,1,player.controls.volume.transform) ;
	//}
	player.channel.addEventListener(air.Event.SOUND_COMPLETE,player.controls.soundComplete);
	
	jx.dom.set.value('progress','[<span color="#104E8B">Playing</span>]') ;
	jx.dom.hide('play.button') ;
	jx.dom.show('pause.button');
      }
    },
    pause:function(e){
	jx.dom.hide('pause.button');
	jx.dom.show('play.button');
	player.position = player.channel.position ;
	player.channel.stop();
	jx.dom.set.value('progress','[Paused]') ;    
    },
    stop:function(e){
	if(player.handler != null){
	      if(player.channel!= null){
		      player.channel.stop();
		}
	}
			
	player.channel 	= null;
	player.position	= 0;
	jx.dom.set.value('progress','00 %')
	jx.dom.hide('pause.button');
	jx.dom.show('play.button');    
    },
    next:function(e){
      //player.controls.stop() ;
      var index = player.index ;
      index +=1 ;
      if(index == player.now.length  ){
	index = 0;
      }

      player.controls.init(index) ;
      //player.controls.play()
    },
    back:function(e){
	//player.controls.stop() ;
	//player.controls.reset();
    	var index = player.index
	if(index > 0){
		index -=1 ;		
	}else{
		index = player.now.length - 1 ;
	}
	
	player.controls.init(index) ;
    },
    complete:function(e){

    },
    id3handler:function(e){
      artist 	= e.target.id3['artist'] ;
      song 	= e.target.id3['songName'] ;
      if(artist == ''|| artist == null){
	artist = 'Unknown' ;
      }
      if(song == '' ||song == null){
	song = 'Unknown'
      }
      jx.dom.set.value('artist',artist) ;
      jx.dom.set.value('song',song) ;
      img = document.getElementById('artist.pic')  ;
      if(artist == 'Unknown'){
	img.src = 'img/default/unknown-artist.jpg';
      }else{
	  var url  = 'http://ws.audioscrobbler.com/2.0/?method=artist.getimages&autocorrect=1&api_key=876c789306d784c59347e153b83b72c0&artist='+artist
	  var fn =function(xmlhttp){
	  r = jx.lastfm.parse(xmlhttp.responseXML)
	    
	    
	    if(r.data.length > 0){
	      var index=Math.floor(Math.random()*r.data.length)
	      img.src = r.data[index].square ;
	    }else{
	      img.src = 'img/default/unknown-artist.jpg' ;
	    }	
	  }
	  jx.ajax.parser  = jx.lastfm.parser ;
	  jx.ajax.send(url,fn,'GET') ;
      }
    },
    error:function(e){},
    soundComplete:function(e){
            //
      // we are at the end of a songName
      // we should inspect the mode = {single; all; none}
      //
      
      
      player.controls.stop() ;
      if(player.mode == 'song'){
	
	player.controls.play() ;
      }else if(player.mode == 'all'){
	player.controls.next() ;
      }
      
    },
    progress:function(e){
	if(player.handler == null){
		
	}else{
		var level = Math.round(100 * (e.bytesLoaded / e.bytesTotal));
		jx.dom.set.value('progress',level+' %');
		var fn = function(){
			jx.dom.set.value('progress','[<span color="#104E8B">Playing</span>]')
		}
		if(level == 100){
			setTimeout(fn,2000);
		}
	}
    },
    reset:function(){
	var resetEvents=function(){
		player.handler.removeEventListener("complete",player.controls.play) ;
		player.handler.removeEventListener("id3",player.controls.id3handler);
		player.handler.removeEventListener("progress",player.controls.progress);
		player.handler.removeEventListener("ioError", player.controls.error);
	}

	//-- end of inline function to reset Events
	if(player.handler != null){
		resetEvents() ;
	}
    },//-- player.controls.reset
    volume:{
      transform:new air.SoundTransform(0.1,0),
      level:1,
      set:function(value){
	player.controls.volume.transform = player.channel.soundTransform;
	player.controls.volume.transform.volume = value ;
	player.channel.soundTransform = player.controls.volume.transform ;
      },
      up:function(){
	if(player.channel == null) return ;
	var value = parseFloat(player.controls.volume.transform.volume) ;
	if(value +0.1 < 1){
		player.controls.volume.set(value+0.1) ;
		jx.dom.set.value('volume.level',parseInt((value+0.1)*100)) ;
	}      
      },
      down:function(){
	if(player.channel == null) return ;
	var value = parseFloat(player.controls.volume.transform.volume) ;
	
	if(value -0.1 > 0.1){
		player.controls.volume.set(value -0.1) ;
		jx.dom.set.value('volume.level',parseInt((value-0.1)*100))
	}      
      }
    }
  },//-- end player.controls
}