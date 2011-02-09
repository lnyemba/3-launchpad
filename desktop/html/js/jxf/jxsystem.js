/**
* (c) 2009-2010 PgSquare
* Steve L. Nyemba, nyemba@gmail.com

* This file is a wrapper around air.NativeProcess that is designed to simplify the interface to running a system command
* Dependency:
*       AIRAliases.js   from Adobe Air 2.0+
*/
var system={
	debug:'off',
        log:function(event){
                air.trace("========================================================");
                air.trace(event) ;
                air.trace("========================================================");
            },//-- end system.log(event) ;
        /**
        * This function will execute a system command and return the output to the callback function
        * Operating system specific calls should be handled by calling code
        * Pre : air.NativeProcess.isSupported == true
        */
        process:null,
        run:function(cmd,params,callback){
		var process ;
		var outdata = [] ;
            //
            // Inner function that captures the output of the system command that was executed and forwards the call
            // to the callback function i.e returning control to calling code
            //
	    
            var onOutput=function(event){
                
                //var bytes = system.process.standardOutput ;
		 var stdout = process.standardOutput ;

		var text  = stdout.readUTFBytes(stdout.bytesAvailable);
               
                //system.process.closeInput(); 
		//system.process.exit(true) ;
		//process.closeInput() ;
		//process.exit(true) ;
		var input = new Array(cmd,params.join(' '))
		//system.log("param len : "+params.join(' ')+'\nout len '+text) ;
		outdata.push(text) ;
                
		//callback(outdata.join('')) ;

                }//-- end of onOutput inline function

		var onExit=function(event){
			if(system.debug == 'on'){
				system.log("Now Exiting \nin : "+params.join(' ')+'\nout : '+outdata.join('')) ;
			}
                        process.closeInput();
			callback(outdata.join('')) ;
			
		}
                var onError = function(event){
                    //system.log(event);
                }
            //------------------ End of Inner function
            var file            = air.File.applicationDirectory.resolvePath(cmd);
            var appInfo         = new air.NativeProcessStartupInfo();
            
            appInfo.executable  = file
            
            if(params != null){
                if(params[0].length == 1){
                        //
                        // In here I am assuming a single argument has been passed indicating client code passed a string
                        // TODO: Will NOT allow single character parameters (considering javascript is not strongly typed)
                        //
                        
                    }else{

                        for(var i=0; i < params.length; i++){
                                appInfo.arguments.push ( params[i] );
                                
                        }
                }
            }

            //system.process = new air.NativeProcess();
            //system.process.addEventListener(air.ProgressEvent.STANDARD_OUTPUT_DATA, onOutput);
            //system.process.start(appInfo);
	    //
	    // The above lines are commented in order to allow this module to respond effectively to asynchronous calls
	    // Should a call sequence of asynchrnous calls be made by some ajax related process
	    //
	    process = new air.NativeProcess() ;
	    process.addEventListener(air.ProgressEvent.STANDARD_OUTPUT_DATA, onOutput) ;
	    process.addEventListener(air.NativeProcessExitEvent.EXIT,onExit)
            process.addEventListener(air.ProgressEvent.STANDARD_ERROR_DATA, onError);
	    process.start(appInfo) ;	   
            process.closeInput() ;
            
                

            }//-- end system.run(cmd,callback)
            
    } ;
