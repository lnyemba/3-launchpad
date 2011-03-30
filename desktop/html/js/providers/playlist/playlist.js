/**
* dependencies:
*	gstore-handler.js	- google handler
*	lstore.js		- local file handler
*/
var playlist={

  size:0,
  /**
  * @param rec	lstore.library.playlist | gstore.library.playlist |dropbox.library.playlist
  */
  init:function(rec,pointer){
    var table,tr,td ;
    //var rec = library.playlist ;
    table = document.createElement('TABLE') ;
   // air.trace(rec.name);
    for(var i=0; i < rec.length; i++){
      tr 			= document.createElement('TR') ;
      tr.className 		= 'shaded' ;
      //tr.style['font-weight']	= 'bold';
      //tr.style['font-size']	= '14px'
      tr.info			= rec[i] ;
      tr.index			= i;
      tr.style['cursor']	= 'pointer';
      
      tr.onmouseover		= function(){
	this.style['color']	= '#436EEE' ;
	
      }
      tr.onmouseout		= function(){
	this.style['color']	= null;
      }

      td 			= document.createElement('TD') ;
      td.style['valign']	= 'middle' ;

      td.style['height']	= '35px';
      td.uri			= rec[i].uri ;
      td.name			= rec[i].name;
      td.info			= rec[i];
      td.index			= i;
      span 			= document.createElement('DIV');
      span.style['margin-left'] = '10px';
      span.className='medium'
      span.innerHTML		= rec[i].name ;//.substring(0,30) ;
      td.appendChild(span);
      if(pointer !=null){
	span = document.createElement('DIV') ;
	span.style['font-size'] = '10px' ;
	span.style['margin-left'] = '10px' ;
	span.style['font-weight'] = 'bold';
	span.style['color'] = 'black' ;
	span.innerHTML  = '&rsaquo;&rsaquo; '+ rec[i].owner ;
	td.appendChild(span) ;
	td.onclick=function(){
	  player.controls.init(this.index);
	}
      }else{
	td.onclick=function(){
	  player.add(this.info);
	}
      }
      tr.appendChild(td) ;
      table.appendChild(tr) ;
    }//-- end of loop
    return table ;
    
  }//-- playlist.init(rec)

}
//
// let's define the rendering formats of the playlist
//
playlist.get = {} ;

//
// This will implement a form of cover album
// depends on jquery; roundabout.js by Fred LeBlanc & the associated Css I enhanced
//
playlist.get.cover=function(rec,pointer){
	var ul = document.createElement('UL') ;
	for(var i=0; i < rec.length; i++){
		li = document.createElement('LI') ;
		frame = document.createElement('DIV') ;
		frame.style['border'] = '1px solid gray';
		frame.align='left'
		frame.style['height'] = '95%'
		frame.className = 'rounded-corners'
		footer= document.createElement('DIV') ;
		footer.className = 'small' 
		img	= document.createElement('img');
		img.src	= 'img/default/default-album.jpg'
		img.style['margin'] = '2px'
		html = ['<div align="left"> ',rec[i].name,'</div>','<div align="left"> &rsaquo;&rsaquo;',rec[i].owner,'</div>'] ;
		footer.innerHTML = html.join('') ;
		footer.style['background-color'] = '#f3f3f3' ;
		footer.style['border-top'] = '1px solid gray';

		frame.appendChild(img) ;
		frame.appendChild(footer);
		li.appendChild(frame) ;
		ul.appendChild(li) ;

	}

	return ul;
	
}

