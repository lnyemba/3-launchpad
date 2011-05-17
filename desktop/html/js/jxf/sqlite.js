/**
* (c) 2010 - 2011 3-launchpad
* SQLite.js - SQLite Handler
*
* This file is a wrapper around sqlite handling for Adobe air and/or Action script 3.0
* The wrapper is synchronous for now and will be enhanced to be 
*
* Dependencies:
*	AIRAliases.js  from adobe air 1.5+
*/

var sqlite={
    log:function(event){
     air.trace("========================================================================= ") ;
      if(event.error){
        air.trace(event.error.message) ;
        air.trace(event.error.details );
       }else{
          air.trace(event) ;
       }
     air.trace("========================================================================= ") ;    
    },//-- end sqlite.log(event)
    run:{
        /**
         * Creating an SQLite database within the user application data directory
         * @param path  name and path within the user application data directory
         * Databases will not be created elsewhere (alas)
         */
      create:function(path){
	var conn = new air.SQLConnection();
	var openHandler = function(e){
	  sqlite.log("done") ;
	}
	conn.addEventListener(air.SQLEvent.OPEN, openHandler);
	var file = air.File.applicationStorageDirectory.resolvePath(path) ;
	conn.open(file);
	conn.close() ;
      },
      isSynchronous:false,
      /**
       * executes an SQL query i.e a statement that returns records. Consider we differ commands from queries
       * @param dbase   path within the user's application data directory
       * @param sql     sql statement (this should be a SELECT)
       * @param fn      callback function
       */
      query:function(dbase,sql,fnPointer){
	
         var connection = new air.SQLConnection() ;
         var file = air.File.applicationStorageDirectory.resolvePath(dbase) ;
         connection.open(file,air.SQLMode.UPDATE) ;
	 if(sqlite.run.isSynchronous == true){
	 	connection.begin() ;
	 }
         var stmt = new air.SQLStatement() ;
         //
         // Inner function, and forwards the manipulation of the result to calling code
         //
         var fn=function(event){
           var result = stmt.getResult() ;
	  
           fnPointer(result) ;
         }
         stmt.sqlConnection 	= connection ;
         stmt.text 		= sql ;
         stmt.addEventListener(air.SQLEvent.RESULT,fn) ;
         stmt.execute() ;
         connection.close() ;
	 sqlite.run.isSynchronous = false ;

      },//-- end sqlite.run.query(table,sql)

    /**
     * Executes an SQL command i.e a statement that does NOT return records
     * @param dbase path of the database within the user's application data directory
     * @param sql   sql command (INSERT|UPDATE|DELETE|CREATE)
     */
     cmd:function(dbase,sql){
        var connection = new air.SQLConnection() ;
        var file = air.File.applicationStorageDirectory.resolvePath(dbase) ;
        connection.open(file,air.SQLMode.UPDATE) ;
        var stmt                =  new air.SQLStatement() ;
        stmt.sqlConnection      = connection ;
        stmt.text               = sql;
        stmt.addEventListener(air.SQLEvent.RESULT,sqlite.log)   ;
        stmt.addEventListener(air.SQLErrorEvent.ERROR,sqlite.log)    ;

        stmt.execute() ;
        connection.close() ;

        
     }//-- end sqlite.run.cmd(dbase,sqlCmd)
    }//-- end sqlite.run
}//-- end sqlite
