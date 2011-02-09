/**
* defining basic widget here .. let's hope it's worth the trouble
*/
if(!jx){
	var jx ={} ;
}

jx.widgets={
    get:{
	dialog:{
	  test:function(){
	      var json={
		  
		  fields:['ouput name','Y Axis label','Graph type','Y Axis units','opposite','show'],
		  caption:'R-Output Config',
		  buttons:[
		      {
			  name:'cancel',
			  action:'system.log("cancelling")'
			},
			{
			  name:'save',
			  action:'system.log("saving")'
			  },
			  {
			      name:'close',
			      action:''
			    }
		    ],
		    html:{
		    	
		    }
		}
		dom = this.input(json) ;
		jx.dom.set('r.output',dom.innerHTML);
	    },
	    
	    /**
	    * This function will return a DOM object that will serve as an input form
	    */
	    input:function(json){
		var buttons	= json.buttons;
		var fields	= json.fields;
		var caption	= json.caption;
		
		var isMovable	= json.ismovable;
		var table = document.createElement('TABLE');
		
		var row	= null,cell=null,input = null;
		caption = (caption == null)?"":caption ;
		row = document.createElement('TR') ;
		row.className='default';
		
		cell= document.createElement('TD');
		cell.appendChild(document.createTextNode(caption)) ;
		cell.style.fontWeight = 'bold';
		cell.style.align = 'center';
		row.appendChild(cell);
		
		cell= document.createElement('TD');
		var close = document.createElement('SPAN') ;
		var index  = 0;
		for(; buttons != null && index < buttons.length; ++index ){
			if(buttons[index].name == 'close'){
			  	close.appendChild(document.createTextNode('[ x ]')) ;
			  	close.style.cursor = 'pointer';
				close.setAttribute("onclick",buttons[index].action) ;
				cell.appendChild(close) ;
				cell.align='right';
				row.appendChild(cell);
				table.appendChild(row);
				break;
			}
		}


		table.border = 0;
		//table.width = '100%'
		for(var i=0; i < fields.length; i++){
			row = document.createElement('TR') ;
			row.className='default'
			cell= document.createElement('TD');
			cell.appendChild(document.createTextNode(fields[i])) ;
		  	row.appendChild(cell);
		  
		  	cell= document.createElement('TD');
			if(json.input != null && json.input[fields[i]]!= null){
				input = json.input[fields[i]] ;
			}else{
			  input 		= document.createElement('INPUT') ;
			  input.type		= 'text'
			  input.className	= 'default'
			  input.id 		= fields[i] ;
			}
			cell.appendChild(input);
			row.appendChild(cell);
			table.appendChild(row);
		  
		  }
		  
		  //
		  // Inspecting if there are any buttons in to direct action
		  //
		  var action,onclick;
		  if(buttons != null){
		    row = document.createElement('TR') ;
		    row.className = 'default';
		    cell = document.createElement('TD');
		    cell.colSpan = '2';
		    cell.align='center'
		    for(var i=0; i < buttons.length;i++){
		      if(buttons[i].name == "close"){
			continue;
		      }else{
			  action = document.createElement('INPUT');
			  action.type = 'BUTTON' ;
			  action.value = buttons[i].name ;
			  
			  // @deprecated: action.setAttribute("onclick",buttons[i].action) ;
			  // The following is HTML 5 compatible, the above syntax will only work for HTML 4
			  // for some reason it doesn't work for HTML5
			  // ""+buttons[i].action+"";
			  //,false) ;
			  
			  
			
			  action.onclick = buttons[i].action ;
				; //buttons[i].action ;
			  if(buttons[i].css != null){
			  	action.className = buttons[i].css;
				//system.log(action.className) ;
			  }
			   cell.appendChild(action) ;
			  if(i < buttons.length-1){
			    cell.appendChild(document.createTextNode(' '));
			  }
			}
		      }
		      row.appendChild(cell);
		      table.appendChild(row);
		      
		    }
		var frame = document.createElement('SPAN');
		frame.appendChild(table);
		return frame ;
	      },//-- end jx.widgets.get.dialog.input(json);
	      
	      /**
	      * open a URI as a dialog (an alternative to iframes)
	      */
	      open:function(uri){}//-- end jx.widgets.get.dialog.open(uri)
	  },//-- end jx.widgets.get.dialog()

	  grid:function(meta,records,title){
	      var table,rows,cell,name;
	      table = document.createElement('TABLE') ;
	      if(title != null && title == true){
	      	table.cellspacing = 0;
		table.width = '100%'
	      	row = document.createElement('TR') ;
		row.className = 'default' ;
		row.style.backgroundColor = '#f3f3f3';
		for(var i=0; i < meta.length; i++){
			cell = document.createElement('TD') ;
			cell.appendChild(document.createTextNode(meta[i])) ;
			cell.style.fontWeight = 'bold'
			cell.style.borderBottom = '1px solid #d3d3d3' ;
			row.appendChild(cell);
		}
		table.appendChild(row);

	      }
	      for(var i=0; i < records.length; i++){
		row = document.createElement('TR') ;
		row.className = 'default';
		
		for(var j=0; j < meta.length; j++){
		  name = meta [j] ;
		  cell = document.createElement('TD') ;
                  cell.valign = 'top'
		  cell.appendChild(document.createTextNode(records[i][name])) ;
		  row.appendChild(cell) ;
		}
		table.appendChild(row) ;
	      }
	      var span = document.createElement('SPAN');
	      span.appendChild(table);
	      return table ;
	  },//-- end jx.widgets.get.grid(meta,records,title)
          sheet:function(records){
              //
              // This file depends on a css document spreadsheet.css for the styles to have effect
              // The spreadsheet is readonly (for now)
              //
              var table         = document.createElement('TABLE') ;
              table.className   = "sheet" ;
              table.cellspacing = '0';
              table.cellpadding = '0'
             
              var meta          = records.meta ;
              var labels        = records.labels ;
              labels = (labels == null)?records.meta:records.labels
              var thead         = document.createElement('THEAD') ;
              var tbody         = document.createElement('TBODY');
              var tr,th,td,div,text,resizer ;
              labels.splice(0,0," ") ;
             
              
              tr = document.createElement('TR') ;

              var beg = "A".charCodeAt(0) ;
              
              for(var i=0; i < 26; i++){
                th   = document.createElement('TH') ;
                div         = document.createElement('DIV');
                text        = document.createElement('DIV');
                resizer     = document.createElement('DIV');

                div.className       = 'header'
                text.className      = 'headerText'
                resizer.className   = 'horizontalResizer'
                if(labels[i] != null){
                    text.appendChild(document.createTextNode(labels[i])) ;
                }else{
                    text.appendChild(
                        document.createTextNode(String.fromCharCode(beg+i))
                    )
                }
                resizer.appendChild(document.createTextNode(" ")) ;

                div.appendChild(text) ;
                div.appendChild(resizer);
                th.appendChild(div) ;
                th.style['width'] = '20px'
                tr.appendChild(th) ;

              }
              thead.appendChild(tr);
              //meta.splice(0,1)
              //----------- now adding rows to the
              var colName,value ;
              for(var i=0; i < records.data.length; i++){
                  tr    = document.createElement('TR') ;                  
                  td = document.createElement('TD') ;

                  
                  div         = document.createElement('DIV');
                  text        = document.createElement('DIV');
                  resizer     = document.createElement('DIV');

                  td.style['width']     = '20px'
                  td.className          = 'sheetRow1stCell' ;
                  div.style['width']    = '20px';
                  div.style['height']   = '20px';

                  text.className            = 'rowHeaderText';
                  text.style['width']       = '20px';
                  text.style['height']      = '18px';

                  resizer.className         = 'verticalResizer'
                  resizer.style['width']    = '20px';
                  resizer.style['height']   = '2px';

                  text.appendChild(document.createTextNode(i+1)) ;
                  resizer.appendChild(document.createTextNode(" ")) ;
                  div.appendChild(text)
                  div.appendChild(resizer) ;
                  td.appendChild(div) ;

                  tr.appendChild(td) ;

                  for(var j=0; j < 90-beg; j++){
                        td = document.createElement('TD') ;
                        td.className    = 'sheetCell';
                        if(j < meta.length){
                            colName         = meta[j]
                            value                   = records.data[i][colName] ;
                        }else{
                            colName = "";
                            value = "";
                        }

                        text                    = document.createElement('DIV');
                        text.className          = 'sheetCellContent'
                        text.style['width']     = '68px';
                        text.style['height']    = '20px';
                        
                        if(value == null){
                            value = "";
                        }
                        text.appendChild(document.createTextNode(value)) ;
                        td.appendChild(text) ;
                        tr.appendChild(td);
                  }
                  tbody.appendChild(tr);
              }
              table.appendChild(thead) ;
              table.appendChild(tbody) ;
              table.border = '0px'
              var frame = document.createElement('DIV');
              frame.style['overflow'] = 'auto'
              frame.appendChild(table)
              return table; //frame ;

          },//-- end jx.widgets.get.sheet(records)
          workbook:function(){
              var wbook = {
                  meta      :[],
                  records   :[],
                  add:function(name,meta,sheet){
                        var index = records.length ;
                        var sheet = jx.widgets.get.sheet(meta,records,null) ;
                      records[index] = {
                          "name":name,
                          "sheet":sheet
                      }
                  },
                  render:function(index){
                      if(index == null){

                      }
                  },//-- end
                  save:function(){}
              }
              return wbook
          },//-- end jx.widgets.get.workbook
	  WindowTitleBar:function(caption,cmds){
	    var table = document.createElement('TABLE') ;
	    var row = document.createElement('TR') ;
	    row.className = 'default'            
	    row.style.backgroundColor = '#d3d3d3'

	    
	    table.width='100%';
	    table.cellSpacing = '0';
	    var cell= document.createElement('TD') ;
            
	    cell.appendChild(document.createTextNode(caption)) ;
            cell.id = caption+'.title' ;
	    row.appendChild (cell) ;
	    //
	    // expected commands are max,min,close. These are window commands
	    //
	    if(cmds != null){
	      var symbol = {
		  min:' [ _ ] ',
		  max:'[ + ] ',
		  close:' [ x ]'
		} ;
	      var keys = ['max','min','close'] ;	//-- order is important
	      var span = null,label ,action;
	      cell = document.createElement('TD') ;
	      cell.align='right' ;
	      for(var i=0; i < keys.length; i++){
		label = symbol[keys[i]] ;
		action = cmds[keys[i]]
		if(action != null){
		  span = document.createElement('SPAN') ;
		  span.appendChild(document.createTextNode(label)) ;
		  span.onclick = action ;
		  span.style.cursor = 'pointer';
		  cell.appendChild(span) ;
		  
     
		}
	      }
	      row.appendChild(cell);

	    }
	    table.appendChild(row) ;
	    var div = document.createElement('DIV') ;
	    div.appendChild(table);
	    
            div.style.border = '2px solid white' ;

		//system.log(div.innerHTML);

	    return div;
	  }//-- end jx.widgets.get.WindowTitleBar(caption,cmds)
      },//-- end jx.widgets.get
      drag:{
	  object:null,
	  originalX:null,
	  originalY:null,
	  onmove:function(event,object){
              if(jx.widgets.drag.object==null){
                  return ;
              }
	      var currentMouseX = event.pageX ;
	      var currentMouseY = event.pageY ;
	      var deltaX = - parseInt(jx.widgets.drag.originalX) + parseInt(currentMouseX) ;
	      var deltaY = - parseInt(jx.widgets.drag.originalY) + parseInt(currentMouseY) ;

              jx.widgets.drag.object.style.top += 0;
              jx.widgets.drag.object.style.left += 0;

	      var left = parseInt(object.style.left) ;  //-- we extract the value to remove the units
	      var top	= parseInt(object.style.top) ;
	      
	      jx.widgets.drag.object.style.position = 'absolute'
	      jx.widgets.drag.object.style.left = (left+deltaX) ;
	      jx.widgets.drag.object.style.top	= (top+deltaY) ;
	      
	      
	      jx.widgets.drag.originalX = currentMouseX; //event.pageX == null ? event.clientX:event.pageX ;
	      jx.widgets.drag.originalY = currentMouseY; //event.pageY == null ? event.clientY:event.pageY ;
                system.log(deltaX+'\n'+left+' '+object.style.left)
                system.log(deltaY+'\n'+top+' '+object.style.top)
	      //return false;
	    },//-- end jx.widgets.drag.move
	  enable:function(event,object){
	      jx.widgets.drag.object = object ;
	      jx.widgets.drag.originalX = event.pageX ;
	      jx.widgets.drag.originalY = event.pageY ;
	      //
	      //TODO: This operation should be an augmentation not setting new values
	      // Think of adding the events, not overriding any potentially existing events
	      //
	      object.onmousemove = function(event){
                  jx.widgets.drag.onmove(event,this) ;
             }
	      object.onmouseup = function(){
                  jx.widgets.drag.disable() ;
              }
	      object.onmouseout = function(){
                  jx.widgets.drag.disable() ;
              }
	      return false;
	    },//-- end jx.widgets.drag.enable(event,object)
	    disable:function(){
	      jx.widgets.drag.originalX = null;
	      jx.widgets.drag.originalY = null;
	      //
	      //TODO: Consider user might have existing attributes and they should not be removed
	      // Better handling of attributes should be implemented i.e remove only the ones added earlier using regular expression
	      //
	      //jx.widgets.drag.object.setAttribute("onmousemove","");
	      //jx.widgets.drag.object.setAttribute("onmouseup","");
	      //jx.widgets.drag.object.setAttribute("onmouseout","");
	      
	      
	      jx.widgets.drag.object	= null;
	      
	      }//-- end jx.widgets.drag.disable
	}//-- end jx.widgets.drag
  }
