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
				//select =  document.getElementById('music.filters') ;
				//index = select.selectedIndex ;
				//select.options.length = 0;

				elp.system.html.render.remotefiles();
				//if(index > 0){
				//	select.selectedIndex = index;
				//	select.onchange() ;
				//}
				
		
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
			remotefiles:function(filter){
				jx.dom.show('remote.panel'); 
				jx.dom.show('mp3player'); 
				jx.dom.hide('save.playlist');
				jx.dom.hide('set.playlist');
				//jx.dom.set.value('current.filter',(filter==null)?'my music library':filter)
				var rec		= elp.system.remotefiles;
				var table 	= document.getElementById('playlist.sources');
				table.style['border'] = '2px solid g';
				if(filter == null && elp.system.html.render.filter != null){
					filter = elp.system.html.render.filter ;
					
				}
				jx.dom.set.value('current.filter',(filter==null)?'my music library':filter)

				if(filter == null){
					//select.options.length = 0;
					//select.options[0] = new Option('my music library','') ;
					;
					table.innerHTML = null;
					table.cellSpacing = '0px';
					table.appendChild(document.createElement('TR')) ;
					table.rows[0].style['cursor'] = 'pointer';
					table.rows[0].className = 'shaded-light data-row';
					table.rows[0].appendChild(document.createElement('TD')) ;
					table.rows[0].appendChild(document.createElement('TD')) ;
					table.rows[0].cells[0].innerHTML = 'my music library' ;					
					table.rows[0].cells[1].innerHTML = rec.data.length+' songs';
					table.rows[0].cells[1].style['border-bottom'] = '1px solid white';
					table.rows[0].cells[1].style['font-size'] = '10px';
					
					table.rows[0].cells[1].align='right'
					table.rows[0].style['text-transform'] = 'capitalize';
					table.rows[0].style['border-top'] = '1px solid white';
					table.rows[0].onmouseover = function(event){
						this.style['color'] = '#FFB90F';
					}
					table.rows[0].onmouseout = function(event){
						this.style['color'] = 'black';
					}
					table.rows[0].onclick=function(event){
						elp.system.html.render.filter = null;
						elp.system.html.render.remotefiles();
					}
					//
					// storing owners and the numbe of songs they have in the list
					//
					var owners=null;
					var counts = null;
					for(var i=0; i < rec.owners.meta.length; i++){
						owner = rec.owners.meta[i] ;
						counts = rec.owners.data[owner]
						tr = document.createElement('TR') ;
						tr.className 		= 'shaded-light data-row' ;
						tr.style['cursor']	= 'pointer'
						tr.onmouseover 	= function(event){
							this.style['color'] = '#FFB90F';
						}
						tr.onmouseout	= function(event){
							this.style['color'] = 'black';
						}
						tr.owner	= owner;
						tr.onclick	= function(event){
							table.filter = this.owner ;
							elp.system.html.render.remotefiles(this.owner);
						}

						td 		= document.createElement('TD') ;
						td.valign 	= 'top';
						td.style['text-transform'] = 'capitalize';
						td.style['border-top'] = '1px solid white' ;
						td.innerHTML	= owner;
						tr.appendChild(td) ;

						td		= document.createElement('TD') ;
						td.valign	= 'bottom';
						td.align	= 'right';
						td.style['width'] = '74px';
						td.style['border-top'] = '1px solid white' ;
						td.style['font-size'] = '10px';
						td.style['font-weight'] = 'normal';
						td.innerHTML	= counts+ ' songs';
						tr.appendChild(td);

						table.appendChild(tr) ;

						//select.options[i+1] = new Option( (owner+' ( '+index+' )') ,owner)
						//select.style['text-transform']='capitalize';
						//select.options[i+1].style['margin-left']='15px'
					}

					//
					// for the custom playlist created
					//
					var p = elp.media.plhandler.get.list() 
					
					var max = (table.rows.length + p.owners.meta.length) ;
					var j=0;
					var tr,td;
					for(var i=table.rows.length; i < max; i++){
						owner = p.owners.meta[j] ; j++;
						counts = p.owners.data[owner] ;
						
						tr = document.createElement('TR') ;
						tr.className 		= 'shaded-light data-row' ;
						tr.style['cursor']	= 'pointer'
						tr.onmouseover 	= function(event){
							this.style['color'] = '#FFB90F';
						}
						tr.onmouseout	= function(event){
							this.style['color'] = 'black';
						}
						tr.owner 	= owner;
						tr.onclick	= function(event){
							table.filter = this.owner ;
							elp.system.html.render.remotefiles(this.owner)
						}

						td 		= document.createElement('TD') ;
						td.valign 	= 'top';
						td.style['text-transform'] = 'capitalize';
						td.style['border-top'] = '1px solid white' ;
						td.innerHTML	= owner;
						tr.appendChild(td) ;

						td		= document.createElement('TD') ;
						td.valign	= 'bottom';
						td.align	= 'right';
						td.style['font-size'] = '10px';
						td.style['font-weight'] = 'normal';
						td.style['width'] = '74px';
						td.style['border-top'] = '1px solid white';
						td.style['text-transform'] = 'capitalize';
						td.innerHTML	= counts +' songs'
						tr.appendChild(td);
						table.appendChild(tr);

						//[i] = new Option(owner+' ( '+index+' )',owner) ;
					}
				}else{
					if(elp.media.plhandler.list.owners.data[filter]!=null){
						rec = elp.media.plhandler.list ;
					}
				}
				var table = document.createElement('TABLE') ;
				table.id = 'playlist';
				table.width='100%'
				table.cellSpacing = '0px';
				var tr,td,input,len;
				elp.media.playlist = [] ;
				for(var i=0; i < rec.data.length; i++){
					if(filter != null && rec.data[i].owner != filter ){
						continue;
					}
					tr 			= document.createElement('TR');
					tr.className 		= 'shaded-light data-row' ;
					
					
					tr.onmouseover = function(event){
						this.style['color'] = '#FFB90F'
					}
					tr.onmouseout = function(event){
						this.style['color']='black';
					}

					td = document.createElement('TD') ;
					td.valign='top'
					len 			= rec.data[i].name.length ;
					td.style['cursor'] 	= 'pointer';
					td.style['border-top']	= '1px solid white';
					td.file 		= (len > 28)?(rec.data[i].name.substring(0,28)):rec.data[i].name ;
					td.file			= td.file.replace('.mp3','');
					td.file			= td.file.replace('.MP3','');
					td.uri			= rec.data[i].uri
					td.id			= rec.data[i].id ;
					elp.media.playlist.push(td.uri) ;
					td.index		= table.rows.length;

					td.appendChild(document.createTextNode(td.file))
					td.onclick = function(event){
						jx.dom.set.value('file.name',this.file) ;
						this.uri = this.uri.replace(/^\s*/, "").replace(/\s*$/, "");
						//elp.media.stop() ;
						//elp.media.player 	= null;
						//elp.media.channel	= null;
						elp.media.track 	= parseInt(this.index);
						
						jx.dom.hide('play');
						jx.dom.show('pause');
						jx.dom.set.value('progress','[wait ...]')
						jx.dom.set.value('artist','Unknown Artist');
						jx.dom.set.value('song','Unknown Song');
						
						//air.trace(jx.ajax.headers[0]['value']) ;
						//air.trace(this.uri) ;
						
						elp.media.init(this.uri) ;
						jx.dom.set.value('search.remote.library','[search]') ;
						jx.dom.delegate('search.remote.library','focus') ;
						jx.dom.delegate('search.remote.library','blur') ;
					}
					
					tr.appendChild(td);

					td 		= document.createElement('TD') ;
					td.valign	='top'
					td.style['border-top']	= '1px solid white';
					input 		= document.createElement('INPUT') ;
					input.type 	= 'checkbox' ;					
					input.style['margin-top']='1px';
					input.obj	= rec.data[i] ;
					input.onclick	= function(event){
						//
						// Opening the window to save the new playlist
						//
						if(this.checked == true){
							elp.media.plhandler.cache.push(this.obj) ;
							jx.dom.show('save.playlist') ;
							jx.dom.hide('mp3player');
							jx.dom.delegate('playlist.name','focus') ;
							jx.dom.delegate('playlist.name','blur') ;
						}else{
							var t = elp.media.plhandler.cache ;
							for(var i=0; i < t.length; i ++){
								ob = t[i] ;
								if(ob.uri == this.obj.uri){
									t.splice(i,1) ;
									elp.media.plhandler.cache =t ;
									break;
								}
							}
						
						}
					}
					if(filter == null){
					  td.appendChild(input);
					  tr.appendChild(td);
					}


					table.appendChild(tr) ;

				}
				jx.dom.set.value('remote','');
				jx.dom.append.child('remote',table);
				elp.system.html.render.filter = filter ;
				//jx.dom.show('remote.panel');
			}//-- end elp.system.html.render.remotefiles(rec)
		}
	}//-- end of elp.system.html
}//-- end elp.system

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
