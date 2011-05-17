/**
 * This file is dedicated to creating grids only. Nothing more & nothing less
 */

if(!jx){
    var jx = {}
}

/**
 * This namespace will generate a grid from a simple array (not a complext object)
 * It's important to we are working with an n dimensional array n > 1
 */
jx.grid = {from:{}}
jx.grid.from.list={}
/**
 * @param list  array of data (n dimension with n >= 1)
 */
jx.grid.from.list.get=function(list,meta){
    var table = document.createElement('TABLE') ;
    var tr,td ;
    air.trace(list.constructor == Array)
    for(var i=0; i < list.length; i++){
        tr = document.createElement('TR')
        if(list[i].constructor == Array){
           for(var j=0; j < list[i].length;j++){
               td = document.createElement('TD') ;
               td.valign='top'
               td.innerHTML = list[i][j]
               tr.appendChild(td)
           }
        }else{
            td = document.createElement('TD') ;
            td.innerHTML = list[i]; //appendChild(document.createTextNode(list[i])) ;
            td.valign = 'top'
            tr.appendChild(td)
        }
        table.appendChild(tr)
    }
    return table ;
}//-- end jx.grid.from.list.get()

/**
 * returns a grid from a hash map
 * @param   meta    hash map meta information i.e list of fields
 * @param   list    linear list of hash maps (data set)
 */
jx.grid.from.map = {} ;
jx.grid.from.map.get=function(meta,list){
       var table = document.createElement('TABLE') ;
    var tr,td,field ;
    var p = meta.constructor == Array ; // our meta is actually an array
    var q = list.constructor == Array ; // we should have a list of something
    //air.trace(p+"\t"+q+"\t"+list[0]['path'])
    for(var i=0; p && q && i < list.length; i++){
        tr = document.createElement('TR')
	for(var j=0; j < meta.length;j++){
	    field = meta[j] ;
	    td = document.createElement('TD') ;
	    td.valign='top'
	    td.innerHTML = list[i][field]            
	    tr.appendChild(td)
	}

        table.appendChild(tr)
    }
    return table ;

}
