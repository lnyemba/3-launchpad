/**
* This is a wrapper around the google api that allows the performance of basic tasks against google
* DEPENDENCIES:
*	rpc.js	: implementation of jxf rpc interface that performs ajax calls
*	json.js	: implementation of json library for javascript (of course)
*/

if(!gapi){
	var gapi={} ;
}

gapi.login={
	googleToken:null,
        headers:null,
	/**
	* uid	: dom user id (email in the case of google)
	* pid	: dom password id
	*/
	init:function(uid,pid,forward,error){
		var uri = 'https://www.google.com/accounts/ClientLogin?accountType=HOSTED_OR_GOOGLE' ;
		var params = [
			uri,
			'&Email=',
			jx.dom.get.value(uid),
			'&Passwd=',
			jx.dom.get.value(pid),
			'&service=writely'
			
		]
		var fn= function(xmlhttp){
			var istream = xmlhttp.responseText ;
			var gkey = null;
			if(istream.split('Auth=') != null){
				var regex = new RegExp('Auth=(.+)') ;
				gkey = istream.match(regex) ;
                                gapi.googleToken = gkey ;

				if(gkey !=  null){
					gkey = gkey[1] ;
					var token = 
						{
							'key':'Authorization',
							'value':('GoogleLogin auth='+gkey)
						}
					
					jx.ajax.headers.push(token) ;
					jx.ajax.headers.push(
						{
							'key':'GData-Version',
							'value':'3.0'
						}
					);
                                        gapi.headers = [token,{'key':'GData-Version','value':'3.0'}] ;


				}
			}
			if(gkey != null && forward != null){
				forward() ;
			}else{
				error();
			}

		}
		jx.dom.set.value(pid,'') ;
		jx.ajax.run(params.join(''),fn,'POST') ;
	}//-- end gapi.login.init(user,password);
	
}//-- end gapi.login

/**
* This section are utilities to be used within the google docs environment:
*	xml parser
*/
gapi.gdocs={
	/**
	* This function will take in a google docs xml response and parse out the document information and return it as an associative array:
	* 	{
			meta:[],	//-- contains field names
			data:[]		//-- each entry is an object with attributes found in meta
		}
	*/
	parse:function(xmlhttp,callback){
		air.trace(xmlhttp.responseText)
		var nodes = xmlhttp.firstChild.getElementsByTagName('entry');
		
		var rec ={} ;
		rec.meta =['uri','name','owner','email'] ;
		rec.data = [] ;
		rec.owners={
			meta:[],
			data:[]
		} ;
		var owner,index;
		var extract = function(entry,tag){
			return entry.getElementByTagName(tag)[0].childNodes[0].nodeValue
		}
		//-- end of inline function
		for(var i=0; i < nodes.length; i++){
			//
			// we will be extracting the following fields from the xml document returned by google docs
			// <id>		: with the http reference of the file
			// <title>	: name of the file as it is displayed in google docs
			// <author>	: owner of the file (name/email)
			//
			rec.data[i] = {}
			for(var j=0; j < nodes[i].childNodes.length; j++){
				//alert(nodes[i].childNodes[j].firstChild.nodeValue) ;
				entry = nodes[i].childNodes[j] ;
				//rec.data[i] = {} ;
				if(entry.nodeName == 'content'){
					rec.data[i].uri = entry.attributes[1].value ;
				}else if(entry.nodeName == 'title'){
					rec.data[i].name = entry.firstChild.nodeValue ;
					rec.data[i].name = rec.data[i].name.replace(/(.mp3)$/i,'');
				}else if(entry.nodeName == 'author'){
					rec.data[i].owner = entry.childNodes[0].firstChild.nodeValue ;
					rec.data[i].email = entry.childNodes[1].firstChild.nodeValue
					owner = rec.data[i].owner ;	
					index = 0;
					if(rec.owners.data[owner] == null){
						rec.owners.meta.push(owner);
						rec.owners.data[owner] = [];

					}
					//else{
						//index = rec.owners.data[owner] 
						//rec.owners.data[owner] = index +1
						rec.owners.data[owner].push (rec.data[i])
						
					//}
					
				}else if(entry.nodeName == 'gd:resourceId'){
					rec.data[i].id = entry.firstChild.nodeValue.replace('file:','');
				}




				//air.trace(rec.data[i].uri)	
				 
			}
			//alert(extract(entry,'id'));
		}
		//
		// returning the control to the caller/calling code
		// should the caller not be specified the function will return the value
		//
		if(callback != null){
			callback(rec) ;	
		}else{
			return rec ;
		}


	}//-- end gapi.gdocs.parse	
}


