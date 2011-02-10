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
      }
      tr.appendChild(td) ;
      
      tr.onclick 		= function(){
	
	if(pointer == null){
	  player.add(this.info) ;
	  	  //
	  
	}else{
	  //
	  // call immediately the player
	  //
	  player.controls.init(this.index) ;
	}
      }      

      
      table.appendChild(tr) ;
    }//-- end of loop
    return table ;
    
  }//-- playlist.init(rec)

}
