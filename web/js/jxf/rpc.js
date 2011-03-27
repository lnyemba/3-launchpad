/**
* (c) 2010 jxf - rpc module. 
*
* The idea of behind this module is fetching data via an RPC-like call:
*	. RESTful web services
*	. XML/SOAP (not yet implemented)
*	. Remote document (HTML; XML; JSON) 
*	. Local documents (HTML; XML; JSON)
* The module will return the data to a callback function should a parser be specified, the module will parse the data and return the parsed data to the callback function
* This allows the client code to minimize parsing should returned data be in a standard format.
* TODO:
*	Improve on how returned data is handled (if necessary).
*/
if(!jx){
  var jx = {}
}
jx.ajax = {
	send:function(url,callback,method){
	  var xmlhttp =  new XMLHttpRequest()  ;
	  method = (method==null)?'GET':method ;
	  xmlhttp.onreadystatechange = function(){
	    if(xmlhttp.readyState == 4){	
		  callback(xmlhttp) ;
		}
	  }//-- end of Inline function
	  var key,value ;
	  xmlhttp.open(method,url,true) ;
	  xmlhttp.send(null) ;
	
	},//-- end jx.ajax.getInstance() ;
	open:function(id,url){
		var iframe = document.getElementById(id) ;
		iframe.src = url ;
	},//-- end jx.ajax.open(id,url);
	headers:[],
	run:function(url,callback,method){
		var xmlhttp =  new XMLHttpRequest()  ;
    		method = (method==null)?'GET':method ;
    		xmlhttp.onreadystatechange = function(){
      		if(xmlhttp.readyState == 4){	
		      //air.trace(xmlhttp.getAllResponseHeaders()) ;
			callback(xmlhttp) ;
		      }
		}//-- end of Inline function
		var key,value ;
		xmlhttp.open(method,url,true) ;

		if(jx.ajax.headers.length > 0){
			for(var i=0; i < jx.ajax.headers.length; i++){
				key = jx.ajax.headers[i]['key'] ;
				value= jx.ajax.headers[i]['value'];
				
				if(key != null && value != null){
					xmlhttp.setRequestHeader(key,value) ;
				}
			}
		}
		xmlhttp.send(null) ;
    	},//-- end jx.ajax.run
    parser:null
  }//--end jx.ajax
 

