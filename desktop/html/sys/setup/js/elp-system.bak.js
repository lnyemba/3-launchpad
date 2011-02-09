/**
* Eridu Launch Pad 0.1
* Steve L. Nyemba <nyemba@gmail.com>
*
*/
if(! elp){
	var elp = {};
}
var mp3player;

elp.system = {
	remotefiles:null,
	get:{
		records:null,
		music:function(){
			//var url = 'https://docs.google.com/feeds/folders/private/full/folder/contents'
			var url = 'https://docs.google.com/feeds/default/private/full?q=*.mp3'
			var fn = function(xmlhttp){
					elp.system.remotefiles = gapi.gdocs.parse(xmlhttp.responseXML)
				//
				// At this point we need to populate the remote folder panel with relevant data
				//
				select =  document.getElementById('music.filters') ;
				index = select.selectedIndex ;
				select.options.length = 0;

				elp.system.html.render.remotefiles();
				if(index > 0){
					select.selectedIndex = index;
					select.onchange() ;
				}
				
		
			}
			jx.ajax.run(url,fn,'GET') ;

		}//-- end elp.system.get.music()
	},//-- end elp.system.get
	html:{
		open:function(tab,init){
			var tabs = [
				{
					'tab':'go.live.tab',
					'panel':'go.live'
	
				},
				{
					'tab':'go.system.tab',
					'panel':'go.system'
				},
				{
					'tab':'go.help.tab',
					'panel':'go.help'
				}
				] 
			var dom
			for(var i=0; i < tabs.length; i++){
				dom	= document.getElementById(tabs[i]['tab']) ;
				jx.dom.hide(tabs[i]['panel']) ;
				if(dom == null){ continue ;}
				dom.enabled	= false ;
				dom.className 	= 'inactiveTab';
				if(dom.id == tab){
					dom.enabled	= true;
					dom.className	= 'activeTab';
					jx.dom.show(tabs[i]['panel']) ;
				}
				if(i > 0){
					jx.dom.enable(dom.id) ;
				}
			}
			//
			// running the initialization function pointer to initialize the tab that has been enabled
			//
			if(init != null){
				init() ;
			}
		},//-- end of elp.system.html.open(tab,init)
		render:{
			filter:null,
			owners:[],
			remotefiles:function(){
				var rec		= elp.system.remotefiles;
				var filter 	= null;
				var select 	= document.getElementById('music.filters');
				if(select.options.length != 0){
					elp.system.html.render.filter = jx.dom.get.dropdownvalue('music.filters')
					filter = elp.system.html.render.filter ;
					if(filter == ''){
						filter = null;
					}
				}
				if(filter == null){
					select.options.length = 0;
					select.options[0] = new Option('all my music','') ;
					//
					// storing owners and the numbe of songs they have in the list
					//
					var owners=null;
					var index = null;
					for(var i=0; i < rec.owners.meta.length; i++){
						owner = rec.owners.meta[i] ;
						index = rec.owners.data[owner]
						select.options[i+1] = new Option( (owner+' ( '+index+' )') ,owner)
					}
				}

				var table = document.createElement('TABLE') ;
				table.id = 'playlist';
				table.width='100%'
				var tr,td,input,len;
				elp.media.playlist = [] ;

				for(var i=0; i < rec.data.length; i++){
					if(filter != null && rec.data[i].owner != filter ){
						continue;
					}
					tr 			= document.createElement('TR');
					tr.className 		= 'medium' ;
					len 			= rec.data[i].name.length ;
					tr.style['cursor'] 	= 'pointer';
					tr.file 		= (len > 30)?(rec.data[i].name.substring(0,26)+' ... '):rec.data[i].name ;
					tr.uri			= rec.data[i].uri
					elp.media.playlist.push(tr.uri) ;
					tr.index		= table.rows.length;

					tr.onmouseover = function(event){
						this.style['background-color'] = '#f3f3f3'
					}
					tr.onmouseout = function(event){
						this.style['background-color']='white';
					}
					tr.onclick = function(event){
						jx.dom.set.value('file.name',this.file) ;
						elp.media.stop() ;
						elp.media.player 	= null;
						elp.media.channel	= null;
						elp.media.track 	= parseInt(this.index);

						jx.dom.set.value('progress','00 %')
						jx.dom.set.value('artist','&nbsp;');
						jx.dom.set.value('song',' &nbsp;')
						elp.media.init(this.uri) ;
					}

					td = document.createElement('TD') ;
					td.valign='top'
					td.appendChild(document.createTextNode(rec.data[i].name))

					tr.appendChild(td);
					table.appendChild(tr) ;

				}
				jx.dom.set.value('remote','');
				jx.dom.append.child('remote',table);
			}//-- end elp.system.html.render.remotefiles(rec)
		}
	}//-- end of elp.system.html
}//-- end elp.system

elp.media={
	playlist:[],
	track:-1,
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
			elp.media.trans = new air.SoundTransform(0.6,0) ;
			elp.media.timer = setInterval(elp.media.volume.panner,100) ;
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
		}
		player = new air.Sound() ;
		player.addEventListener("complete",elp.media.play)
		player.addEventListener("id3",elp.media.id3handler) ;
		player.addEventListener("progress",elp.media.progress);
		player.addEventListener("ioError",function(event){event})
		//player.addEventListener("soundComplete",elp.media.soundComplete);
		player.load(prequest) ;
		elp.media.player = player;

	},
	id3handler:function(event){
		jx.dom.set.value('artist',event.target.id3['artist']) ;
		jx.dom.set.value('song',event.target.id3['songName']) ;
		
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
		jx.dom.hide('pause');
		var mode = elp.media.mode ;
		if(mode == 'none'){
			elp.media.position = null;
		}else if(mode == 'song'){
			elp.media.play() ;
		}else if(mode=='all'){
			elp.media.next() ;
		}
		
	},//-- end elp.media.soundComplete
	play:function(){
		if(elp.media.player != null){
			if(elp.media.position != null){
				elp.media.channel = elp.media.player.play(elp.media.position);
			}else{
				elp.media.channel = elp.media.player.play(0,1,elp.media.trans);
				}
			jx.dom.set.value('progress','[<span color="#104E8B">Playing</span>]')
			elp.media.channel.addEventListener(air.Event.SOUND_COMPLETE,elp.media.soundComplete)
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
	},//--
	stop:function(){
		if(elp.media.player != null){
			if(elp.media.channel!= null){
				elp.media.channel.stop();
			}
			elp.media.player.removeEventListener("complete",elp.media.play) ;
			elp.media.player.removeEventListener("progress",elp.media.progress);
		}
			
		elp.media.channel = null;
		elp.media.position= null;
		jx.dom.set.value('progress','00 %')
		jx.dom.hide('pause');
		jx.dom.show('play');
	},
	next:function(){
		//
		// let's check the current track index 
		var table = document.getElementById('playlist') ; 
		var index = elp.media.track ;
		if(index+1 < table.rows.length){
			index +=1 ;
		}else if(elp.media.mode=='all'){
			index = 0;
		}
		table.rows[index].onclick();

	},
	prior:function(){
		var index = elp.media.track ;
		var table = document.getElementById('playlist') ;
		if(index > 0){
			index -=1 ;		
			table.rows[index].onclick() ;
		}
	},
	playbackcomplete:function(event){},//-- end elp.media
	setmode:function(value){
		elp.media.mode = value;
	},
	/**
	*
	*/
	volume:{
		up:function(){},
		down:function(){},
		panner:function(){}

	}//-- elp.media.volume

}//-- end elp.media


elp.help={
	init:function(){
		//
		// read the help file
		if(jx.ajax.headers.length == 0){
			jx.dom.disable('go.system.tab');
			jx.dom.enable('go.live.tab');
		}else{
			jx.dom.disable('go.live.tab');			
		}
	}//-- end elp.help.init
}
