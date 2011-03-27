/**
* This file handles the theming:
*	- loads current theming from database
*	- sets the current theme and saves it to back-end
*/
var theme={
  current:'zen',
  init:function(){
    var sql = "select * from params where alias='theme'"
    var path = '3launchpad.db3' ;
    
    var callback=function(rec){
      theme.current = rec.data[0].value ;      
      theme.set() ;
    }
    sqlite.run.query(path,sql,callback) ;
  },
  set:function(id){

    if(id != null){
      theme.current = id ;
      
      var sql = "update params set value = ':value' where alias='theme'";
      var path = '3launchpad.db3' ;
      
      sql = sql.replace(':value',theme.current) ;
      sqlite.run.cmd(path,sql) ;
    }
    
    jx.dom.set.css('app',theme.current) ;
    jx.dom.set.value('current.theme',theme.current) ;
    
  },//-- end theme.set(id)
  browse:{
    max:12,	//-- total number of theme preview windows
    current:0,
    direction:null,
    next:function(){
      var moveto = function(){
	if(theme.browse.current < theme.browse.max-1){
	  ++theme.browse.current;
	}else{
	  theme.browse.current = 0;
	}
      }//-- end of inline function 
      theme.browse.direction = 'next'
      theme.browse.transition(moveto)
    },
    prev:function(){
     var move_to=function(){
       if(theme.browse.current > 0){
	--theme.browse.current;
      }else{
	  theme.browse.current = theme.browse.max -1;
	}
      }
      theme.browse.direction = 'back' ;
      theme.browse.transition(move_to)
    },//-- theme.browse.prev()
    transition:function(move_to){
      cid = 'preview'+theme.browse.current ;
      move_to() ;
      nid = 'preview'+theme.browse.current ;

       margin = $('#'+cid).outerWidth();
      if(theme.browse.direction != 'next'){
      	margin = -margin;
	
      }
      jx.dom.set.style(nid,'left',-margin)  ;
      jx.dom.show(nid) ;
       $('#'+cid).animate({left:margin}) ;
       $('#'+nid).animate({left:0}) ;
       $('#'+cid).fadeOut("fast") ;
      

    }//-- end theme.browse.transition(move) ;
  }
  
}
