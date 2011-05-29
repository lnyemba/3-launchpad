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


theme.get.remote ={} ;

theme.get.remote.init=function(){
    
}


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
    theme.browse.nav.index = 0;
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
        img.src = (lib[i].uri == null)?lib[i]:lib[i].uri ;
        img.style['width'] = '250px';
        img.style['height']= 'auto';

        div.appendChild(img)
        
        div.id = "imgpanel_"+i ;
        div.uri =img.src

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
    if(current ==  lib.length -offset-1 ){
        return ;
    }
    //
    // at this point we are sure to have at least one element in the shadows (need to inforce this assertion)
    //

    var delta =  (lib.length -current -offset)
    
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
    if(current == 0 || lib.length < offset){
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
    if(current == lib.length-3 || lib.length <= offset){
        
        
        return ;

    }
    var id = '#pcontent'
    
    var position = (parseInt($(id).css('margin-left')) - 250)
    $(id).animate({'margin-left':position}) ;
    theme.browse.nav.index = (current + 1)
    
}

/**
 * This section shows how images from the hard drive are handled:
 *  if the data place holder is null then we need to index a given folder and save the stream to the internal db
 *
 */
theme.local = {}
theme.local.data = []
theme.local.render = {}
/**
 * This is the indexing function that will load the files from a folder and store them in the namespace data placeholder
 * The alogrithm here is a basic recursive directory traversal algorithm that will be initiated
 */
theme.local.load=function(path){
    var parent = new air.File(path) ;
    var list = parent.getDirectoryListing() ;
    for(var i=0; i < list.length; i++){
        if(list[i].isDirectory == true){
            theme.local.load(list[i].nativePath)
        }else if(list[i].extension != null && list[i].extension.match(/(jpg|jpeg|png|bmp)/i)){
            var entry = {} ;
            entry.name = list[i].name.replace(/.(jpg|jpeg|png|bmp)$/i,'')
            entry.uri = ('file://'+list[i].nativePath) ;
            theme.local.data.push(entry)
        }
    }
    //
    // we're done indexing the folders now we can render them
    //
    if(theme.local.data.length > 0){
        //
        // we have a common rendering function
        theme.data['my pictures'] = theme.local.data ;
        theme.browse.init("my pictures")
        
    }
}

/**
 * This function will render the input form based on known parameters: width of DIV is 250px
 * ... basically html rendering
 */
theme.local.render.input=function(){
    var div = document.createElement('DIV') ;
    div.innerHTML = '<b>Making 3-launchpad Yours</b><br><br>Use your pictures as themes:<br><br><li type="square">Personalizing 3-launchpad</li><li type="square">Making it meaningful</li><li type="square">Album like browsing</li>... for a better music experience'
    div.className = 'shaded-light'
    div.align = 'left'
    div.style['width'] = '244px'
    div.style['height']= '149px'
    div.style['float'] = 'left'
    div.style['border']= '1px solid white'
    div.style['padding'] = '2px'

    jx.dom.set.value('pcontent','') ;
    jx.dom.append.child('pcontent',div) ;

    div = document.createElement('DIV') ;
    div.className = 'shaded-light'
    div.align = 'left'
    div.innerHTML = '<b>How does it work?</b><br><br>Simply Select a folder with your pictures and you\'re ready to go<br><br>We hope you enjoy the new theming engine';
    div.style['width'] = '244px';
    div.style['height']='149px';
    div.style['float'] = 'left'
    div.style['border']= '1px solid white'
    div.style['padding'] = '2px'
    jx.dom.append.child('pcontent',div)

    div = document.createElement('DIV') ;
    div.className = 'shaded-light'
    div.align = 'left'
    div.innerHTML = '<b>Start Here</b><br>';
    div.style['width'] = '244px';
    div.style['height']='149px';
    div.style['float'] = 'left'
    div.style['border']= '1px solid white'
    div.style['padding'] = '2px'
    input  = document.createElement('INPUT') ;
    input.type = 'button' ;
    input.className = 'default-button' ;
    
    input.style['margin-top']   = '45%'
    input.value = 'Import'
    input.onclick=function(){
        var fbrowser = air.File.documentsDirectory ;
        //
        // Inline functions
        var setPictures=function(e){
          theme.local.load(e.target.nativePath) ;          

        } ;
        fbrowser.addEventListener("select",setPictures) ;
        fbrowser.browseForDirectory("Select Picture Folder");
    }
    div.appendChild(input)

    input  = document.createElement('INPUT') ;
    input.type = 'button' ;
    input.className = 'default-button' ;

    input.style['margin-top']   = '45%'
    input.style['margin-left']  = '10px'
    input.value = 'Browse'
    input.onclick=function(){
        if(theme.local.data.length > 0){
            theme.browse.init('my pictures')
        }
    }
    div.appendChild(input);
    jx.dom.append.child('pcontent',div)
    $('#pcontent').animate({'margin-left':0});
    theme.data ['my picture config'] = [0,1,2]
    theme.current = 'my picture config'
    theme.browse.nav.index = 0;
    jx.dom.set.value('theme.source','')
}

/**
 * This namespace will implement remote images from e-launchpad
 * TODO: Mirror sites will have to be included
 */
theme.remote = {}
theme.remote.host = 'http://3-launchpad.org:5984/e-launchpad/' ;
theme.remote.folders=[]
theme.remote.data = {}
theme.remote.render={}
http://media:5984/e-launchpad/http://media:5984/e-launchpad/_design/api/_view/image.library
/**
 * Initialization of the
 */
theme.remote.init = function(){
var rpc = jx.ajax.getInstance() ;
    var url = theme.remote.host+'_design/api/_view/image.library' ;
    var fn = function(jstr){
        var doc = eval("("+jstr.responseText+")") ;
        
        var folders = (doc.rows != null)?doc.rows[0].value:null//doc.categories ;
        var rpcimg = {}
        
        if(folders != null){

            for(var i=0; i < folders.length; i++){

                id = folders[i].name ;
                uri= [theme.remote.host,folders[i].uri]
                uri = uri.join('')
                if(rpcimg[id] == null){
                    rpcimg[id] = [] ;
                }

                rpcimg[id].push(uri) ;

                //folders[i].uri = theme.remote.host+'_design/api/_view/'+id
                //theme.remote.folders.push(folders);
            }
            theme.remote.folders = rpcimg;//folders;
        }
    }
    rpc.send(url,fn)

}
/**
 * This function will
 */
theme.remote.render.input=function(){
    var list = theme.remote.folders ;
    //
    // We initialize this to allow navigation using the arrows
    if(theme.data ['remote-images'] == null){
        theme.data ['remote-images'] = [];
        
    }
    theme.current = 'remote-images'
    theme.browse.nav.index = 0;
    jx.dom.set.value('theme.source','3-LP images library')

    jx.dom.set.value('pcontent','')
    var div = document.createElement('DIV') ;
    div.innerHTML = '<b>How it works</b><br><br><li type="square">Images are organized by folders</li><li type="square">Open a folder to explore it<li type="square">Change image sources below<br><br><b>Image Sources:</b>'
    div.align="left";
    div.className = "shaded-light" ;
    mirrors = [{'name':'3-launchpad','url':'http://3-launchpad.org:5984/e-launchpad/'},{'name':'3-LP Labs','url':'http://xdev.no-ip.org:5984/e-launchpad/'}] ;
    for(var i in mirrors){
        input = document.createElement('INPUT') ;
        input.type='button';
        input.className = 'default-button' ;
        if(i % 2 == 0){
            input.style['margin'] = '1'
        }
        input.value = mirrors[i].name ;
        input.url = mirrors[i].url ;
        input.onclick=function(){
            theme.remote.host = this.url ;
            theme.remote.init()  ;
            window.setTimeout(function(){
            theme.remote.render.input()},200);

        }
        div.appendChild(input)

    }
    
    jx.dom.append.child('pcontent',div)
    var count = 0;
    for(var id in list){
        div = document.createElement('DIV')
        div.id = id
        div.images = list[id]
        div.innerHTML = '<b style="text-transform:capitalize;" align="left"> '+id.replace('.',' ')+'<br>image count : '+list[id].length+'</b><br>' ;
        div.style['width'] = '244px'
        div.style['height'] = '149px'
        div.style['border'] = '1px solid white'
        div.style['padding']= '2px'
        div.align="left"
        div.className = 'action shaded-light'

        img = document.createElement('IMG')
        img.src = list[id][0];
        img.style['width'] = '100%'
        div.appendChild(img)

        div.onclick=function(){
            if(theme.data[this.id] == null){
                theme.data[this.id] = this.images ;
            }
            theme.browse.init(this.id) ;
            theme.browse.nav.index = 0;
            jx.dom.set.value('theme.source',this.id.replace('.',' ')) ;
            $('#pcontent').animate({'margin-left':0});

        }
        
        jx.dom.append.child('pcontent',div)
        ++count;
    }
    theme.data ['remote-images'] = new Array(count+1)
    $('#pcontent').animate({'margin-left':0});
}//-- end theme.remote.render.input
