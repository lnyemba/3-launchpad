/**
* This file handles the theming:
*	- loads current theming from database
*	- sets the current theme and saves it to back-end
* Themes at this point are majorily built around images that come from either local drive; built-in or remote i.e 3-launchpad.org
* The engine must gracefully handle these source of images considering the remote images are organized by theme
*/
var theme = {} ;
theme.current = 'zen' ;
theme.data = {} ;
theme.init =function(){
    var sql = "select * from params where alias='theme'"
    var path = '3launchpad.db3' ;

    var callback=function(rec){
      theme.current = rec.data[0].value ;
      theme.set() ;
    }
    sqlite.run.query(path,sql,callback) ;
  }//-- end theme.init()

theme.set= function(id){

    if(id != null){
      theme.current = id ;
      
      var sql = "update params set value = ':value' where alias='theme'";
      var path = '3launchpad.db3' ;
      
      sql = sql.replace(':value',theme.current) ;
      sqlite.run.cmd(path,sql) ;
    }
    
    jx.dom.set.css('app',theme.current) ;
    jx.dom.set.value('current.theme',theme.current) ;
    
  }//-- end theme.set(id)

theme.get = {} ;
/**
 * This function will read the application internal folder and return list of image files found
 * The information is stored in usable format i.e an associative array with attributes:
 *  name,uri
 */
theme.get.internal = function(){
    var list =[] ,index = 0;
    var folder = air.File.applicationDirectory.resolvePath("html/img/themes") ;
    var files = folder.getDirectoryListing() ;
    for(var i=0; i < files.length; i++){

        if(files[i].isDirectory == true || files[i].name.match(/^.*.(jpg|png)$/i)==null){
            continue ;
        }
        list [index] ={} ;
        list[index].name = files[i].name.replace(/(.png|.jpg)$/i,"") ;
        list[index].uri = '/html/img/themes/'+files[i].name ;
        ++index;
    }
    return list ;
}

theme.get.local=function(){}
theme.get.remote=function(){}

/**
 * This namespace defines how themes will be browsed & navigated. The idea is that the consistent data structures be passed to it
 */
theme.browse ={
}
/**
 * a given library is passed to the initialziiation function that will create preview panels
 * @param id    identifier of the theme in the theme bank (theme.data)
 */
theme.browse.init=function(id){
    jx.dom.set.value('pcontent','')
    var lib = theme.data[id] ;
    jx.dom.set.value('theme.source',id);
    if(lib == null){
        return;
    }
    theme.current = id ;
    theme.browse.nav.index = 0 ;
    for(var i=0; i < lib.length; i++){
        div = document.createElement('DIV') ;
        img = document.createElement('IMG');
        img.src = lib[i].uri ;
        img.style['width'] = '250px';
        img.style['height']= 'auto';

        div.appendChild(img)
        
        div.id = "imgpanel_"+i ;
        div.uri = lib[i].uri ;
        div.style['float'] = 'left' ;
        div.style['width'] = '250px';
        
        div.style['height']= '150px';
        div.style['autoflow'] = 'hidden'
        if(i > 2){
            ;//div.style['display'] = 'none'
        }
        jx.dom.append.child('pcontent',div)
    }
    theme.browse.nav.index =0;
}//-- end theme.browse.init(id)
/**
 * This namespace will implement theme navigation given the 
 */
theme.browse.nav = {}
theme.browse.nav.index = 0;
/**
 * This function will jump to the last element on the list considering the current position
 * The animation will be visible to the user so it is like the user is flying through it
 */
theme.browse.nav.last=function(){
    var current = theme.browse.nav.index ;
    var lib     = theme.data[theme.current]
    var offset  = 3 ;
    if(current ==  lib.length -offset ){
        return ;
    }
    //
    // at this point we are sure to have at least one element in the shadows (need to inforce this assertion)
    //

    var delta =  (lib.length - current -offset )
    
    delta = -(delta * 250)+parseInt($('#pcontent').css('margin-left')) ;
    $('#pcontent').animate({'margin-left':delta});
    theme.browse.nav.index = lib.length - offset ;
}
/**
 * This function will jump to the first element on the list considering the current position
 * The animation will be visible to the user so it is like the user is flying through it
 */
theme.browse.nav.first=function(){
    var current = theme.browse.nav.index ;
    
    var lib     = theme.data[theme.current]
    var offset  = 3 ;
    if(current ==  0 ){
        return ;
    }
    $('#pcontent').animate({'margin-left':0});
    theme.browse.nav.index = 0 ;
}

theme.browse.nav.next = function(){
    var current = theme.browse.nav.index;
    var lib     = theme.data[theme.current] ;
    var offset  = 3;
    if(current == 0){
        return ;
    }
    
    var id = '#pcontent'
    var position = (parseInt($(id).css('margin-left')) + 250)
    
    $(id).animate({'margin-left':position}) ;
    
    theme.browse.nav.index = (current-1) ;
    
    
//    $(prefix+next).hide();
//    theme.browse.nav.index = (next-offset)
//    air.trace(current+'\t'+offset)
//
}

theme.browse.nav.back = function(){

    var current = theme.browse.nav.index;
    var next    = theme.browse.nav.index ;
    var lib     = theme.data[theme.current] ;
    var offset  = 3;
    ++next ;
    if(current == lib.length-3){
        
        
        return ;

    }
    var id = '#pcontent'
    
    var position = (parseInt($(id).css('margin-left')) - 250)
    
    $(id).animate({'margin-left':position}) ;
    
    if(current == lib.length - offset){
        ;//theme.browse.nav.index = lib.length -
    }
    theme.browse.nav.index = (current + 1)

//    for(var i=0; i < offset; i++){
//
//        position = i+(i*200) ;
//
//        $(prefix+next).show() ;
//        $(prefix+next).animate({left:position})
//
//        ++next;
//    }
//    theme.browse.nav.index = (next - offset)
    
    
}
