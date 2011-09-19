$(document).ready(function(){
	
	
	
	$('#content').load('principal.html', cargarForm);
	
	$("#updatemenu").click(function(){
		$('#content').load('cargarMenues.html', cargarForm);
		
	});
	
	function cargarForm(){
		var rowDetail;
		jQuery("#clistDetails").jqGrid({
				datatype: "local",
				height: 50,
				colNames:['Id','Detalle'], 
				colModel:[ {name:'id_detail',index:'id_detail', visible:false,width:25}, 
					{name:'detalle',index:'detalle', editable: true, edittype:'text', width:200}

					
				], 
				
				caption: "Detalles",
				rowNum:10, rowList:[10,20,30], viewrecords: true, sortorder: "desc", caption: "Full control",
				

				onSelectRow: function(id){
					if(id && id!==rowDetail){
						//alert("algoo");
						//jQuery('#clistDetails').jqGrid('editRow',id,true);
						//jQuery('#clistDetails').jqGrid('editRow',rowDetail,false);
						//
						//jQuery('#clistDetails').jqGrid('restoreRow',rowDetail);
						////jQuery('#clistDetails').jqGrid('restoreRow',rowDetail);
						//rowDetail=id;
						}
					
				}
				
				
				
			});
		
		
		
		$("#commentForm").validate({
				
				
			});
		
		$("#commentForm").submit(function () {
			/* if (!$(this).valid()){
				return false;
			}*/
			
			var parametros = $(this).serializeArray();
        
			var par = {};
					
			$.each(parametros, function() {
			    if (par[this.name] !== undefined) {
				if (!par[this.name].push) {
				    par[this.name] = [par[this.name]];
				}
				par[this.name].push(this.value || '');
			    } else {
				par[this.name] = this.value || '';
			    }
			});
			
			console.debug(par);
			
			var details = [];
			
			var numDetails = jQuery('#clistDetails').jqGrid('getGridParam','records');
						
				
			for(var i=1;i<=numDetails;i++){
				
				var ret = jQuery("#clistDetails").jqGrid('getRowData',i);
				
				details.push(ret.detalle);
					
				
			}
			
			par["lista"] = details || '';
			
			
			var json_par = par;
        
               
			$.ajax({
				    async:          true,
				    data:               json_par,
				    url:		"http://10.140.11.1:8888/Viandas/Viandas-Tracker/Viandas-Tracker/update_menu.php",				    type:      		"post",
				    success:            finInsert
			});
			return false;
			    
		});
		
		jQuery("#addDetails").click( function(){
			
			var cant = jQuery('#clistDetails').jqGrid('getGridParam','records')+1;
			var datarow = {id_detail:cant,detalle:"Detalle de menu"};
			
			var su=jQuery("#clistDetails").jqGrid('addRowData',cant,datarow);
			
		});
		
		jQuery("#delDetails").click( function(){
			
			var id = jQuery('#clistDetails').jqGrid('getGridParam','selrow');
			var su=jQuery("#clistDetails").jqGrid('delRowData',id);
			
			
			
		});
	}
	
	$("#viewmenus").click(function(){
		$('#content').load('verPedidos.html', cargarGrilla);
	});
	
		
		
	function cargarGrilla(){
			var lastsel2
			jQuery("#listOrders").jqGrid({
				datatype: "local",
				height: 250,
				colNames:['Ped No','Menú', 'Usuario', 'Fecha','Detalle', 'Cantidad','Confirmado'], 
				colModel:[ {name:'id_order',index:'id_order', width:55}, 
					{name:'menu',index:'menu', width:150}, 
					{name:'user',index:'user', width:150},
					{name:'date',index:'date',  width:80},
					{name:'detalle',index:'detalle', width:100, align:"right"},
					{name:'cantidad',index:'cantidad', width:50, align:"right"},
					//{name:'confirmed',index:'confirmed', width:80, align:"right",formatter:'select',edittype:"select", editable: true,editoptions:{value:"0:Sin Confirmar;1:Confirmado"}}
					//{name:'confirmed',index:'confirmed', width:80, align:"right",edittype:"checkbox", editable: true,editoptions:{value:"0:1"}}
					{name:'confirmed',index:'confirmed', align:"center", width:60, editable: true,formatter:'checkbox',edittype:"checkbox",editoptions: {value:"1:0"}}
					
				], 
				//multiselect: true,
				caption: "Pedidos",
				//pager: '#pager2',
				onSelectRow: function(id){
					if(id && id!==lastsel2){
						//jQuery('#listOrders').jqGrid('restoreRow',lastsel2);
						jQuery('#listOrders').jqGrid('editRow',lastsel2,false);
						jQuery('#listOrders').jqGrid('editRow',id,true);
						lastsel2=id;
						}
				}
				
			});
		     
			$.ajax({
					async:          true,
					url:		"http://10.140.11.1:8888/Viandas/Viandas-Tracker/Viandas-Tracker/get_orders.php",
					type:      		"post",
					success:            finOrders,
					dataType: 		"json"
				     });
			    
			    
			    
			    
			    var mydata = [{"id_order":1,"menu":"Empanadas","user":"Damian Girardi","date":"0000-00-00","confirmed":"0",
					    "details":[{"id_detail":1,"name_detail":"Carne","quant":3},
						       {"id_detail":1,"name_detail":"Carne","quant":3},
						       {"id_detail":1,"name_detail":"Carne","quant":3},
						       {"id_detail":2,"name_detail":"Jamon y Queso","quant":5}]},
					    {"id_order":2,"menu":"Ravioles de Ricota","user":"Damian Girardi","date":"2011-05-12","confirmed":"1",
					    "details":0}]
			    
			    //finOrders(mydata);
			    
			    function finOrders(data){
				    
				    //data =mydata;
				    $.each(data, function(index,value) {
					    jQuery("#listOrders").jqGrid('addRowData',index+1,data[index]);
					    
					    var detalle = data[index].details;
					    
					    if (detalle.length!=null){
						    descripcion = "";
						    cant = 0;
						    $.each(detalle, function(index,value) {
							    if (descripcion==""){
								    descripcion = value.name_detail +": "+value.quant
							    }
							    else{
								    descripcion = descripcion + "\n" + value.name_detail +": "+value.quant	
							    }
							    cant = cant + value.quant;	
						    });
						    
						    jQuery("#listOrders").jqGrid('setRowData',index+1,{detalle:descripcion});
						    jQuery("#listOrders").jqGrid('setRowData',index+1,{cantidad:cant});
					    }
					    else{
					      jQuery("#listOrders").jqGrid('setRowData',index+1,{cantidad:1});
					    }
					    
					    
					});
			    }
			    
			    jQuery("#confirmar").click( function(){
				    
				    var numPedidos = jQuery('#listOrders').jqGrid('getGridParam','records');
				    
				    var pedidos = [];
				    
				    var par="";	
				    for(var i=1;i<=numPedidos;i++){
					    var ret = jQuery("#listOrders").jqGrid('getRowData',i);
					    
					    if (ret.confirmed==1){
						    par = "\"id_order\""+":\""+ret.id_order+"\"";
						    par = "{"+par+"}";
						    
						    pedidos.push(jQuery.parseJSON(par));
					    }
				    }
			    
					    
				    $.ajax({
					async:          true,
					url:		"http://10.140.11.1:8888/Viandas/Viandas-Tracker/Viandas-Tracker/confirm_orders.php",
					type:      		"get",
					data :		pedidos,
					success:            finConfirm,
					error:            function(){alert("Error en la confirmación de los pedidos");$('#listOrders').trigger("reloadGrid");},
					dataType: 		"json"
				     });
					    
		    
			    
				    
			    });	
				    
			    function finConfirm(data){
				    
				    alert("Pedidos Confirmados");
				    $('#listOrders').trigger("reloadGrid");
			    }
		
	
	};
	
	
		
	//jQuery("#listOrders").jqGrid({ 
	//	url:'http://10.140.11.1:8888/Viandas/json.php', //http://10.140.11.1:8888/Viandas/get_orders.php',//'server.php?q=2', 
	//	datatype: "json", 
	//	mtype:'POST',
	//	//postData: $("#myForm").serialize(),
	//	colNames:['Ped No','Fecha', 'Descripción', 'Cantidad','Confirmado'], 
	//	colModel:[ {name:'id_order',index:'id_order', width:55}, 
	//		{name:'menu',index:'menu', width:90}, 
	//		{name:'user',index:'user', width:250},
	//		{name:'date',index:'date', width:80, align:"right"},
	//		{name:'confirmed',index:'confirmed', width:80, align:"right"}
	//	], 
	//	rowNum:10, 
	//	rowList:[10,20,30], 
	//	//pager: '#pager2', 
	//	sortname: 'id', 
	//	viewrecords: true, 
	//	sortorder: "desc", 
	//	caption:"Pedidos Realizados"
	//	}); 
	//	
		//jQuery("#list2").jqGrid('navGrid','#pager2',{edit:false,add:false,del:false});
		
//		 $.ajax({
//                    async:          true,
//                    url:		"http://10.140.11.1:8888/Viandas/get_menues.php",
//                    type:      		"post"
//                    
//		 });
		 
//		 $("#list2").jqGrid('navGrid','#pager',
//                    {add:false,edit:false,del:false,search:true,refresh:true},
//                    {},{},{},{multipleSearch:true});
//		 
//		 $("#list2").jqGrid('filterToolbar',
//                    {stringResult:true,searchOnEnter:true,defaultSearch:"cn"});
	//todaysmenu simple row:
	$.template("todaysrowsimple","<div class='row'><div class='menuid'>${id_menu}</div><div class='menuname'>${name}</div><div class='supplier'>${supplier}</div><div class='order'><input type='button' class='pedir' id='${id_menu}' value='Hacer pedido'/></div></div>");
	
	//todaysmenu composite row:
	$.template("todaysrowcomposite","<div class='row'><div class='menuname'>${name}<div class='plus'>+<div class='details' id='${id_menu}0'></div></div></div><div class='supplier'>${supplier}</div><div class='order'><input type='button' class='pedir' id='${id_menu}' value='Hacer pedido'/></div></div>");
	
	//details row:
	$.template("detailsrow","<div>${name_detail}: <input type='text' /></div>");
	
	$("#todaysmenu1").click(function(){
		$('#content').load('verMenues.html', mostrarMenues);
		
	});
	
	function mostrarMenues(){
			//vaciar la grilla:
		$("#todaysgrid").html('<div id="todaysgridheader" class="row"><div class="menuname">Menu</div><div class="supplier">Proveedor</div><div class="order"></div></div>');
		//consultar los menus de hoy, y por cada uno instanciar el template todaysrow y agregarlo a todaysgrid:
		$.ajax({  
			async: true,
			success: function(data) { 
				$.each(data, function(index,value) {
					var menu = value;
					var classtext = "odd";
					if (index % 2 == 0) { classtext = "even"; };
					/* var menu = {"id_menu":1,"name":"Empanadas","description":"Ricas empanadas","supplier":"Planeta Empanada","admin":"Damian Girardi","details":[{"id_detail":1,"name_detail":"Carne"},{"id_detail":2,"name_detail":"Jamon y Queso"},{"id_detail":3,"name_detail":"Anchoas"}]}; */
					if (menu.details != "0") {
						//agregar la composite row:
						var compositerow = $.tmpl("todaysrowcomposite",menu);
						compositerow.addClass(classtext);
						compositerow.appendTo("#todaysgrid"); 
						// agregar al div details el detalle de gustos:
						var details = menu.details;
						for (elem2 in details) {
							var detailsrow = details[elem2];
							$.tmpl("detailsrow", detailsrow).appendTo(compositerow.find('.details'));
						}
						//setear el evento click del boton plus:
						compositerow.find(".plus").click(function(){
							compositerow.find(".details").toggle(500);
						});
						//des-setear el evento click para el div details (sino, lo hereda del boton plus):
						compositerow.find(".details").click(function(e){
							e.stopPropagation();
						});
						//setear el evento click para el boton Hacer pedido:
						compositerow.find(".pedir").click(function(){
							//chequear que haya al menos una empanada:
							var quant = 0; 
							var total = 0; 
							var details = new Array();
							$.each(compositerow.find(".details").children(), function(index, value) {
								//armar el json para enviar!!! (ir sumando en total)
								var jqueryobj = $(value);
								var gusto = jqueryobj.text().substring(0,jqueryobj.text().indexOf(':'));
								quant = jqueryobj.children().first().val(); //el input es el unico hijo
								total = total + quant;
							});
							if (total==0) {
								alert("Debe encargar por lo menos una unidad.");
								return;
							} else {
								//pedir confirmacion por "total unidades":
								
								//enviar el request:
								var parametros = { 
									"user_token": token,
									"menu_id": "12345",
									"details": details };
								$.ajax({  
									async: true,
									
									data: parametros,
									dataType: "json",
									url: "...",
									type: "get"
								});
							}
							return false;
						});
					} else { 
						var simplerow = $.tmpl("todaysrowsimple", menu);
						simplerow.addClass(classtext);
						simplerow.appendTo("#todaysgrid");
						//setear el evento click para el boton Hacer pedido:
						
					};
				});
			},
			//data: parametros,
			dataType: "json",
			url: "http://10.140.11.1:8888/Viandas/Viandas-Tracker/Viandas-Tracker/get_menues.php",
			type: "get"
		});  
		//mostrar el container de menus
		$("#todaysmenu-container").attr('display', 'block');
		return false;
	};
	
	
});