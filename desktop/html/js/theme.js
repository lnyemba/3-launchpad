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
    max:8,
    current:0,
   
    next:function(){
      var moveto = function(){
	if(theme.browse.current < theme.browse.max-1){
	  ++theme.browse.current;
	}else{
	  theme.browse.current = 0;
	}
      }//-- end of inline function 
      theme.browse.transition(moveto,"next")
    },
    prev:function(){
     var move_to=function(){
       if(theme.browse.current > 0){
	--theme.browse.current;
      }else{
	theme.browse.current = theme.browse.max -1;
      }
    }
      theme.browse.transition(move_to,"back")
    },//-- theme.browse.prev()
    show:function(){
      id = 'preview'+theme.browse.current ;
      for(var i=0; i < theme.browse.max; i++){
	jx.dom.hide('preview'+i) ;
      }
      
      jx.dom.show(id);
    },
    transition:function(move_to,flag){
      id = 'preview'+theme.browse.current ;
      var option = {} ;
      if(flag == "next"){
	option['margin-left']='100%'
	
      }
      option.width = '0';
     
      
      
      pointer = function(){
	jx.dom.hide(id);
	jx.dom.set.style(id,'width','100%') ;
	jx.dom.set.style(id,'margin-left','0')
	move_to() ;
	id = 'preview'+theme.browse.current 
	jx.dom.show(id) ;
      }
      $('#'+id).animate(option,350,pointer)
    }
  }
  
}
