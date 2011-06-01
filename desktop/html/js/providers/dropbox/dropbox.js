/**
* (c) 2010 - 2011 3-launchpad, nyemba@gmail.com
* Dropbox API, This requires the keys and auth process
* According to the dropbox API implementation the authentication is as follows:
*	1. check for the access token
*	2. If there are not any available:
*		a. request a token
*		b. get authorization
*		c. get access key
*	3. 
*/

var dstore={
  library:{
    path:null,
    playlist:[],
    owners:{
      meta:[],
      data:{}
    }
  },
  init:{
    login:function(){
    	user = jx.dom.get.value('dropbox.email') ;
	pass = jx.dom.get.value('dropbox.password');
    	dropbox.key = 'iqzdgr0ej8yc2l0' ;
	dropbox.secret = '8466vnv6b09hfvb'
        dropbox.login(user,pass);
	//dropbox.auth.login(user,pass) ;
    }//-- end dstore.init.login() 
}
}
/**
* In this section we handle dropbox authentication specifics
*/
var dropbox={}

dropbox.auth 		= {} ;
dropbox.key 		= null;
dropbox.secret  	= null;
dropbox.token		= null;
dropbox.user		= null;
dropbox.rpc             = jx.ajax.getInstance() ;
dropbox.folders         = {}
dropbox.folders.spec    = {};

dropbox.init=function(){
   	dropbox.key = 'iqzdgr0ej8yc2l0' ;
	dropbox.secret = '8466vnv6b09hfvb'
}
dropbox.init() ;

dropbox.login   =
        function(){
            var user = jx.dom.get.value('dropbox.email') ;
            var pass = jx.dom.get.value('dropbox.password')
            var url = 'https://api.dropbox.com/0/token?email='+user+'&password='+pass+'&oauth_consumer_key='+dropbox.key ;
            
            var inline = function(xmlhttp){
                var r = eval("("+xmlhttp.responseText+")")
                if(r.token != null && r.secret != null){
                    dropbox.token = r ;
                    //
                    // now we can extract traverse the user directory
                    //
                    //air.trace(xmlhttp.responseText)
                    var f = function(xmlr){
                        //air.trace(xmlr.responseText)
                        dropbox.folders.spec = eval("("+xmlr.responseText+")") ;
                        dropbox.utils.parse(dropbox.folders.spec) ;
                        
                    }
                    //dropbox.get.envelope('https://api.dropbox.com/0/account/info?','GET',f) ;
                    //dropbox.get.envelope('https://api-content.dropbox.com/0/files/dropbox/','GET',f)
                        dropbox.get.envelope('https://api.dropbox.com/0/metadata/dropbox/?','GET',f)
                }
            }
            jx.dom.set.value('dropbox.status','Please wait ...')
            dropbox.rpc.send(url,inline,'POST') ;
        }//-- end of dropbox.login

dropbox.get={} ;
dropbox.get.files=
        function(){
            var accessor = {} ;
            //
            // find a way to know what the parameters for signing with sha1
        }
dropbox.get.envelope=
        function(url,method,callback){
            var rpc = jx.ajax.getInstance() ;
            var message = {} ;
            message.action = url
            message.method = (method==null)?'GET':method;
            message.parameters = [] ;
            message.parameters.push(['oauth_consumer_key',dropbox.key]) ;
            message.parameters.push(["oauth_signature_method",'HMAC-SHA1']);
            message.parameters.push(["oauth_token",dropbox.token.token]);

            var accessor = {} ;
            accessor.consumerSecret = dropbox.secret ;
            accessor.tokenSecret    = dropbox.token.secret ;
            

            OAuth.setTimestampAndNonce(message);
            OAuth.SignatureMethod.sign(message, accessor);
            var map = OAuth.getParameterMap(message.parameters) ;
            //air.trace(OAuth.getParameter(message.parameters, "oauth_signature"))
            var keys = ['oauth_consumer_key','oauth_signature_method','oauth_token','oauth_timestamp','oauth_nonce','oauth_signature']
            rpc.headers =[] ;
            var p=[]
            p.push(' OAuth realm="3-launchpad"')
            var entry = {};
            for(var i=0; i < keys.length; i++){                
                p.push(keys[i]+'="'+map[keys[i]]+'"')
            }
            entry = {} ;
            entry.key = 'Authorization' ;
            entry.value = p.join(',')
            rpc.headers.push(entry) ;
            rpc.send(url,callback,method)
            


        }
dropbox.auth.login	=
	function (user,pass){
		dropbox.user = user ;

                var url = '';
                //dropbox.auth.getToken(pass) ;
                //
	}

dropbox.auth.getToken	=
	function(pass){
		var url = 'https://api.dropbox.com/0/oauth/request_token?oauth_consumer_key='+dropbox.key
		var p = function(xmlhttp){
			dropbox.token = xmlhttp.responseText
                        //air.trace(dropbox.token);
                        //
                        // if the response contains oauth_token and oauth_token_secret, then authorization is required
                        //
                        if(dropbox.token.match('.*(oauth_token)*$')){
                            dropbox.auth.getAuthorization(pass) ;
                        }else{
                            //
                            // if the authorization is not required, then we need to log the user in
                            //
                            
                        }
                        

		}
		jx.ajax.send(url,p,'POST') ;
	}
/**
 * opens The authorization window for the application to enable the user to authorize 3-launchpad
 * Actually we need to load the window prior to taking the credentials
 */
dropbox.auth.getAuthorization   =
	function(pass){
		//var url = 'https://www.dropbox.com/0/oauth/authorize?oauth_token='+dropbox.token+'&email='+dropbox.user ;
		var p = urlparser(dropbox.token) ;
		var url = 'http://api.getdropbox.com/0/oauth/authorize?oauth_token='+p.data['oauth_token']+'&email='+dropbox.user+'&password='+pass ;
		air.trace(dropbox.token+'\n'+url) ;
		var win = getWindowInstance(url) ;
}



/**
 * defining dropbox parsers and utilities
 */
dropbox.utils = {} ;

dropbox.library = {}
dropbox.library.playlist = [] ;
dropbox.library.owners = {} ;
/**
 * This function performs a non recursive directory traversal considering dropbox does NOT support search
 */

dropbox.utils.parse=function(spec){
    //var spec = dropbox.folders.spec ;

    for(var i=0;i < spec.contents.length; i++){
        p = spec.contents[i].is_dir ;
        q = spec.contents[i].mime_type == "audio/mpeg" ;
        r = spec.contents[i].path.match("^.*(.mp3)$") != null
        
        if(r && q){
            //
            // we found a file in a directory
            dropbox.library.playlist.push(spec.contents[i])
            index  = dropbox.library.playlist.length -1 ;
            dropbox.library.playlist[index].name = dropbox.library.playlist[index].path.match('^.*\x2F(.*.mp3)$')[1] ;
            dropbox.library.playlist[index].uri = 'https://api-content.dropbox.com/0/files/dropbox'+dropbox.library.playlist[index].path ;;
            dropbox.library.playlist[index].headers = [] ;
            dropbox.library.playlist[index].owner = 'dropbox'
            dropbox.utils.render()
            //air.trace(JSON.stringify(spec.contents[i]))
        }else if(p){
            //
            // we have sumbled accross a directory (traversing it now )
            // At this point another request needs to be fired off and calling this function again
            //
            var path = 'https://api.dropbox.com/0/metadata/dropbox:path/?'.replace(":path",spec.contents[i].path);
            var route = function(xmlr){
                //air.trace(xmlr.responseText )
                try{
                    var dir = eval("("+xmlr.responseText+")") ;
                    if(dir != null && dir.contents != null){
                        dropbox.utils.parse(dir);
                    }
                }catch(error){
                    //air.trace("[error] "+error.message)
                }
            }
            dropbox.get.envelope(path,'GET',route)
        }
    }
}

/**
 * This function will render the and register the list of files found from the remote repository
 * and it will also register the files found with the playlist (incrementally)
 */
dropbox.utils.render = function(){
    var list = dropbox.library.playlist ;
    var meta = ['name']

    var grid = jx.grid.from.map.get(meta,list) ;
    for(var i=0; i < grid.rows.length; i++){
        
        grid.rows[i].info = list[i] ;
    
        div = document.createElement('DIV') ;
        div.innerHTML = '&rsaquo;&rsaquo; dropbox'
        div.className = 'medium'
        div.style['font-weight'] = 'normal'
        grid.rows[i].cells[0].appendChild(div) ;

        //
        // adding the action buttons that
        //
        add = document.createElement('INPUT') ;
        add.type = 'image';
        add.style['float'] = 'right' ;
        add.style['margin-top'] = '-20';
        add.type = 'image'
        add.src = 'img/default/add.png';
        //grid.rows[i].cells[0].appendChild(add);
        
        edit= document.createElement('INPUT') ;
        edit.type = 'image'
        edit.src= 'img/default/edit.png'
        edit.style['float'] = 'right' ;
        edit.style['margin-top'] = '-20px'
        grid.rows[i].cells[0].appendChild(edit);
    }
    grid.id = 'dropbox.music'
    grid.className = 'data-grid'
    jx.dom.hide('dropbox.login')
    jx.dom.set.value('dropbox.size',grid.rows.length)
    jx.dom.set.value('dropbox.files.grid','') ;
    jx.dom.append.child('dropbox.files.grid',grid) ;
    jx.dom.show('dropbox.files')
}//-- end dropbox.utils.render()
