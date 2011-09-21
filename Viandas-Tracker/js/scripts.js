
$(document).ready(function(){
	
        
//------Token de Usuario de Facebook-----------------------------------------------------------------------------------------------------
        var token;
	FB.init({appId: '114353212003918', status: true,
	cookie: true, xfbml: true});
	
	FB.getLoginStatus(function(response) {		  
              if (response.status == 'unknown') {	  
		 window.location.href = 'login.html';
              }
              else{
                 token = response.session.access_token;

              }
	});	

//------Logout----------------------------------------------------------------------------------------------------------------------------	
	$('#logout').click(function() {
			FB.logout(function(response) {
				window.location.href = 'login.html';
			});
	});		
	
	$('#content').load('principal.html');
	
//------Cargar Menu------------------------------------------------------------------------------------------------------------------------
	$("#updatemenu").click(function(){
		$('#content').load('cargarMenues.html', cargarForm);
		
	});
	
        function urlencode (str) {
                     // URL-encodes string  
                     // 
                     str = (str + '').toString();
                      // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
                     // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
                     return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
                     replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
                 };
                 
	function cargarForm(){
		var rowDetail;
                
                var par = "user="+token;
                
                $.ajax({
				    async:          true,
				    data:               par,
				    url:		"http://10.140.11.67:8888/Viandas/Viandas-Tracker/Viandas-Tracker/get_all_menues.php",
                                    type:      		"get",
                                    success:            finMenues,
                                   traditional: true
                });
                
                function finMenues(data){
                    
                     availableTags = [];
                    
                     availableTags = data.split(":"); 
                     //$.each(data, function(index,value) {
                     //       availableTags.push(value);
                     //});
                    //availableTags=data;
                     
                    $( "#cmenu" ).autocomplete({
                            source: availableTags
                    });     
                     
                }
                
                $.ajax({
				    async:          true,
				    data:               par,
				    url:		"http://10.140.11.67:8888/Viandas/Viandas-Tracker/Viandas-Tracker/get_all_suppliers.php",
                                    type:      		"get",
                                    success:            finProveedor
                                   
                });
                
                function finProveedor(data){
                    
                     availableTags = [];
                    
                     availableTags = data.split(":"); 
                                        
                    $( "#csupplier" ).autocomplete({
                            source: availableTags
                    });     
                     
                }
                
                $( "#cfecha" ).datepicker({
                            dateFormat: 'yy-mm-dd'
		//	showOn: "button",
		//    	buttonImage: "images/calendar.gif",
		//	buttonImageOnly: true
		});
                
                  $.validator.addMethod("DateFormat", function(value,element) {
                            return value.match(/^(19|20)\d\d([- /.])(0[1-9]|1[012])\2(0[1-9]|[12][0-9]|3[01])$/);
                                },
                                    "Fecha en formato yyyy-mm-dd"
                                );

		jQuery("#clistDetails").jqGrid({
				datatype: "local",
				height: 50,
				colNames:['Detalle'], 
				colModel:[ //{name:'id_detail',index:'id_detail', visible:false,width:25}, 
					{name:'detalle',index:'detalle', editable: true, edittype:'text', width:300}

					
				], 
				
				caption: "Detalles",
				
//				cellsubmit:'clientArray',
//                                cellEdit:true,
                                //editurl:'clientArray',
                                url:'clientArray',

				onSelectRow: function(id){
                                          
					if(id && id!==rowDetail){
						
                                               
						jQuery('#clistDetails').jqGrid('editRow',id,true);
						jQuery('#clistDetails').jqGrid('editRow',rowDetail,false);
						//
                                                jQuery("#clistDetails").jqGrid('saveRow',rowDetail, "aa" , 'clientArray');
						//jQuery('#clistDetails').jqGrid('saveRow',rowDetail);
						////jQuery('#clistDetails').jqGrid('restoreRow',rowDetail);
						rowDetail=id;
                                                
                                                
						}
					
				}
				
				
				
			});
		
		
		jQuery.extend(jQuery.validator.messages, {
                     required: "Campo Requerido.",
                     date: "Fecha inválida."
                     
                 });

		$("#commentForm").validate({
		    
				
	      });
		
                
                 
		$("#commentForm").submit(function () {
			 if (!$(this).valid()){
				return false;
			}
			//alert(rowDetail);
                        if(rowDetail){
                            jQuery('#clistDetails').jqGrid('editRow',rowDetail,false);
                            jQuery("#clistDetails").jqGrid('saveRow',rowDetail, "aa" , 'clientArray');
                            
                        }
                            
			var parametros = $(this).serializeArray();
        
			var par = "";
					
			//$.each(parametros, function() {
			//    if (par[this.name] !== undefined) {
			//	if (!par[this.name].push) {
			//	    par[this.name] = [par[this.name]];
			//	}
			//	par[this.name].push(this.value || '');
			//    } else {
			//	par[this.name] = this.value || '';
			//    }
			//});
			
			
			
			var details = "";
			
			var numDetails = jQuery('#clistDetails').jqGrid('getGridParam','records');
				
			for(var i=1;i<=numDetails;i++){
				
				var ret = jQuery("#clistDetails").jqGrid('getRowData',i);
				details = details + "\""+ret.detalle+"\"";
                                
                                if (i!=numDetails){
                                   details = details + ", ";
                                }
				
					
				
			}
			
                        details = "["+details+"]"
                        
//			par["lista"] = details || '';
//			
//                      par["token"] = token || '';
			
                     var par = "";
                     $.each(parametros, function() {
                              par = par + "\""+this.name+"\""+":\""+this.value+"\"";
                              par = par + ",";
                                
                          });
                       par = par + "\"detalles\":"+details;
                       par = par + ",\"token\":\""+token+"\"";
                       par = "{"+par+"}";
                          
                       
                          
                          //var json_par = eval("(" + par + ")");
                          //var parametros = {"name":"1", "sname":"2", "user":"2", "pw":"2", "rpw":"2", "date":"12/12/2011", "email":"e@g.com", "lng":"ingles", "guser":"ulises.coplo"};
                          //var json_par = jQuery.parseJSON(par);
                        
                        
                        
                        var json_par = par;
                                              
                        
               
			$.ajax({
				    async:          true,
				    data:               'menu='+urlencode(json_par),
				    url:		"http://10.140.11.67:8888/Viandas/Viandas-Tracker/Viandas-Tracker/add_menu.php",
                                    type:      		"get",
                                    success:            finUpdate
			});
                        console.debug(par)
			return false;
			
                        
		});
		
                function finUpdate(data){
                     alert("Menú ingresado correctamente");
                     $('#content').load('principal.html');
                     
                }
                
		jQuery("#addDetails").click( function(){
			
			var cant = jQuery('#clistDetails').jqGrid('getGridParam','records')+1;
			var datarow = {id_detail:cant,detalle:"Detalle "+cant};
			
			var su=jQuery("#clistDetails").jqGrid('addRowData',cant,datarow);
			
		});
		
		jQuery("#delDetails").click( function(){
			
			var id = jQuery('#clistDetails').jqGrid('getGridParam','selrow');
			var su=jQuery("#clistDetails").jqGrid('delRowData',id);
			
			
			
		});
	}

//------Ver Pedidos realizados-----------------------------------------------------------------------------------------------------------------

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
                                        data:           'token='+token,
					url:		"http://10.140.11.67:8888/Viandas/Viandas-Tracker/Viandas-Tracker/get_orders.php",
					type:      		"get",
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
						    
						    //pedidos.push(jQuery.parseJSON(par));
                                                    pedidos.push(ret.id_order);
					    }
				    }
			    
				   
                                   
				    $.ajax({
					async:          true,
					url:		"http://10.140.11.67:8888/Viandas/Viandas-Tracker/Viandas-Tracker/confirm_orders.php",
					type:      	"get",
					data :		'orders='+pedidos,
					success:            finConfirm,
					error:            function(){alert("Error en la confirmación de los pedidos");$('#listOrders').trigger("reloadGrid");},
					dataType: 		"json"
				     });
					    
		    
			    
				    
			    });	
				    
			    function finConfirm(data){
				    
				    alert("Pedidos Confirmados");
				    //$('#listOrders').trigger("reloadGrid");
			    }
		
	
	};
	
		
	
	$.template("todaysrowsimple","<div class='row'><div class='menuid'>${id_menu}</div><div class='menuname'>${name}</div><div class='supplier'>${supplier}</div><div class='order'><input type='button' class='pedir' id='${id_menu}' value='Hacer pedido'/></div></div>");
	
	//todaysmenu composite row:
	$.template("todaysrowcomposite","<div class='row'><div class='menuid'>${id_menu}</div><div class='menuname'>${name}<div class='plus'>+<div class='details' id='${id_menu}0'></div></div></div><div class='supplier'>${supplier}</div><div class='order'><input type='button' class='pedir' id='${id_menu}' value='Hacer pedido'/></div></div>");
	
	//details row:
	$.template("detailsrow","<div>${name_detail}: <input type='text' /><div class='detailid'>${id_detail}</div></div>");
	
        
//------Ver Menues cargados-----------------------------------------------------------------------------------------------------------	
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
                                                        var listaDetalles="";
							$.each(compositerow.find(".details").children(), function(index, value) {
								//armar el json para enviar!!! (ir sumando en total)
								var jqueryobj = $(value);
								//var gusto = jqueryobj.text().substring(0,jqueryobj.text().indexOf(':'));
								var d_id = jqueryobj.find(".detailid").text();
								quant = jqueryobj.children().first().val(); //el input es el primer hijo
								total = total + quant;
								var obj = { "id_detail": d_id, "cant": quant };
								details.push(obj);
                                                                if (listaDetalles != "")
                                                                      listaDetalles = listaDetalles + ",{\"id_detail\":\""+d_id+"\",\"cant\":\""+ quant + "\"}";
                                                               else
                                                                      listaDetalles = "{\"id_detail\":\""+d_id+"\",\"cant\":\""+ quant + "\"}";
							});
							if (total==0) {
								alert("Debe encargar por lo menos una unidad.");
								return;
							} else {
								//pedir confirmacion por "total unidades":
								
								//enviar el request:
                                                                var m_id = compositerow.find(".menuid").text();
								var parametros = { 
									"user_token": token,
									"menu_id": m_id,
									"details": details };
                                                                         
                                                                         
                                                               var parametros = "\"user_token\":\""+token+"\","+
                                                                "\"menu_id\":\""+ m_id+"\","+
                                                                "\"details\":["+listaDetalles+"]";
                                                        
                                                               parametros = "{"+parametros+"}";
                                                               console.debug(parametros);
								$.ajax({  
									async: true,
									success: function(data) {
										alert("Su pedido fue registrado. En breve le enviaremos la confirmación vía email.");
									},
									data:  'order='+parametros,
									
									url: "http://10.140.11.67:8888/Viandas/Viandas-Tracker/Viandas-Tracker/add_order.php",
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
                                                
                                                simplerow.find(".pedir").click(function(){
							//chequear que haya al menos una empanada:
                                                       	
							var total = 1; 
							var details = new Array();							                                                                                                               
                                                        //enviar el request:
                                                        var m_id = simplerow.find(".menuid").text();
                                                        //var parametros = { 
                                                        //        "user_token": token,
                                                        //        "menu_id": m_id,
                                                        //        "details": details };
                                                        
                                                        var parametros = "\"user_token\":\""+token+"\","+
                                                                "\"menu_id\":\""+ m_id+"\","+
                                                                "\"details\":[]";
                                                        
                                                        parametros = "{"+parametros+"}";
                                                        
                                                        console.debug(parametros);
                                                        $.ajax({  
                                                                async: true,
                                                                success: function(data) {
                                                                        alert("Su pedido fue registrado. En breve le enviaremos la confirmación vía email.");
                                                                },
                                                                data:  'order='+parametros,
                                                                url: "http://10.140.11.67:8888/Viandas/Viandas-Tracker/Viandas-Tracker/add_order.php",
                                                                type: "get"
                                                        });
							
							return false;
						});
						
					};
				});
			},
			//data: parametros,
			dataType: "json",
			url: "http://10.140.11.67:8888/Viandas/Viandas-Tracker/Viandas-Tracker/get_menues.php",
			type: "get"
		});  
		//mostrar el container de menus
		$("#todaysmenu-container").attr('display', 'block');
		return false;
	};
	
	
});