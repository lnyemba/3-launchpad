/**
* This is an adobe air media player. The idea of having an application that plays mp3 files is that
*/


/**
* Initialization of a global media player
* headers	: uri headers is an array of objects {key:null,value:null}. If null then headers will be ignored
*/
var player = null;
var prequest;
var report;
var channel;
function InitPlayer (uri,headers){
	player 	= new air.Sound() ;
	prequest= new air.URLRequest(uri) ;
	prequest.method = 'GET';
	report	= {} ;
	//
	// adding headers to the request with authentication information and other google sensitive stuff
	//
	var reqHeader;
	for(var i=0; i < headers.length; i++){
		reqHeader = new air.URLRequestHeader(headers[i].key,headers[i].value) ;
		prequest.requestHeaders.push(reqHeader) ;
	}
	player.addEventListener("complete",startPlayer)
	player.addEventListener("id3",id3handler) ;
	player.addEventListener("ioError",function(event){event})
	player.load(prequest) ;

}//-- end initialize.init

function startPlayer(){

	channel = player.play() ;
}
function stopPlayer(){
	channel.stop();
}

function id3handler(event){
	report.id3 = event.target.id3 ;
	jx.dom.set.value('media.info','wtf')
}

function getReport(){
	return report ;
}
