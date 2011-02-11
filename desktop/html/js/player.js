var player={
handler:null,
channel:null,
position:null,
index:null,
mode:'none',
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
	td.width='10%';
	div = document.createElement('DIV') ;
	div.innerHTML 	= '[ - ]';
	div.index	= i;
	div.onclick=function(){
	  
	  if(this.index == player.index){
	    player.controls.stop() ;
	  }
	  player.now.splice(this.index,1) ;
	  player.add(null) ;
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
    player.controls.stop();
  },//-- player.clear()
  controls:{
    
    init:function(index){
      
      info = player.now[index] ;
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
    },
    play:function(){
      if(player.handler != null){
	if(player.position == null){
	    player.position = 0;
	}
	if(player.channel == null){
	  player.channel = player.handler.play(player.position,1,player.controls.volume.transform) ;
	}
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
      player.controls.stop() ;
      if(player.index != player.now.length -1 ){
	player.index =+1 ;
	
      }else{
	player.index = 0;
      }
      player.controls.init(player.index) ;
      player.controls.play()
    },
    back:function(e){},
    complete:function(e){

    },
    id3handler:function(e){
      artist 	= e.target.id3['artist'] ;
      song 	= e.target.id3['songName'] ;
      if(artist == ''){
	artist = 'Unknown' ;
      }
      if(song == ''){
	song = 'Unknown'
      }
      jx.dom.set.value('artist',artist) ;
      jx.dom.set.value('song',song) ;
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
    reset:function(){},
    volume:{
      transform:null,
      level:1,
      up:function(){
      
      },
      down:function(){}
    }
  },//-- end player.controls
}