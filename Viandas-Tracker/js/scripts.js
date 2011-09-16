$(document).ready(function(){
	
	
	
	$('#content').load('cargarPedidos.html', cargarForm);
	
	$("#updatemenu").click(function(){
		$('#content').load('cargarPedidos.html', cargarForm);
		
	});
	
	function cargarForm(){
		jQuery("#clistDetails").jqGrid({
				datatype: "local",
				height: 50,
				colNames:['Id','Detalle'], 
				colModel:[ {name:'id_detail',index:'id_order', width:55}, 
					{name:'detalle',index:'detalle', width:200}

					
				], 
				
				caption: "Detalles"
				
				
				
			});
		$("#commentForm").validate();
		
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
					url:		"http://10.140.11.1:8888/Viandas/get_orders.php",
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
					url:		"http://10.140.11.1:8888/Viandas/confirm_orders.php",
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


});