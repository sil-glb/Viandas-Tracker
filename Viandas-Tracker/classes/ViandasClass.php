<?php

class Viandas {
	
    private $_oBaseDatos; 
 
    public function __construct()
    {        
        $this->_oBaseDatos = Bd::get_instancia();
        $this->_oBaseDatos->conectar();              
    } 
	
	public function add_user($token,$name)
	{	
		$checkExists = mysql_query('SELECT * FROM users WHERE fbtoken = "'.$token.'"');
		
		if (mysql_num_rows($checkExists) <= 0)
		{
			$query = 'INSERT INTO users (name,fbtoken) VALUES ("'.$name.'","'.$token.'")';
			mysql_query($query,$this->_oBaseDatos->get_link_id());
		}	
		
		return true;
	}
	
	
	
	public function add_menu($jsonobject)
	{
		$data = json_decode($jsonobject);
		
		$name = $data->name;
		$description = $data->description;
		$id_admin = $data->id_admin;
		$id_supplier = $data->id_supplier;
		$weekday = $data->weekday;	
		
		$query = 'INSERT INTO menu (name,description,id_admin,id_supplier,weekday) VALUES ("'.$name.'","'.$description.'","'.$id_admin.'","'.$id_supplier.'","'.$weekday.'")';
		
		$rs = mysql_query($query,$this->_oBaseDatos->get_link_id());
		
		if ($rs !== false)
			return true;
		else
			return false;	
	}
	
	public function add_supplier($jsonobject)
	{
		$data = json_decode($jsonobject);
		
		$name = $data->name;
		
		$query = 'INSERT INTO suppliers (name) VALUES ("'.$name.'")';
		
		$rs = mysql_query($query,$this->_oBaseDatos->get_link_id());
		
		if ($rs !== false)
			return true;
		else
			return false;	
	
	}
	
	//Cambiar el chequeo de la fecha
	public function get_day_menues()
	{	
		$today = date('Y-m-d');
		$json = '[';
		
		$query = mysql_query('SELECT m.*, s.name as supplier, u.name as admin FROM menu m 
								LEFT JOIN suppliers s ON (s.id = m.id_supplier)
								LEFT JOIN users u ON (u.id = m.id_admin)
							   WHERE weekday = "2011-09-14"');					   
							 
		
		while ($data = mysql_fetch_array($query))
		{
			$json .= '{"id_menu":'.$data['id'].',"name":"'.$data['name'].'","description":"'.$data['description'].'","supplier":"'.$data['supplier'].'","admin":"'.$data['admin'].'","details":';		
		
			$check = mysql_query('SELECT * FROM details WHERE id_menu = '.$data['id']);
			
			if (mysql_num_rows($check) > 0)
			{
				$json .= '[';
			
				while ($detailsdata = mysql_fetch_array($check))
				{
					$json .= '{"id_detail":'.$detailsdata['id'].',"name_detail":"'.$detailsdata['name_detail'].'"},';	
				}				
				
				$json = substr($json,0,-1);
				
				$json .= ']';
			}
			else
			{
				$json .= '0';
			}
			
			$json .= '},';
		}
		
		$json = substr($json,0,-1);
		
		$json .= ']';		
		
		return $json;
	}
	
	//Falta hacer el chequeo de fecha y de id de administrador
	public function get_orders()
	{
		$json = '[';
		$today = date('Y-m-d');
		//WHERE o.date = "2011-09-14" 
		$query_orders = mysql_query('SELECT o.*, m.name as nombremenu, u.name as userasked FROM orders o 
										INNER JOIN menu m ON (m.id = o.id_menu)
										INNER JOIN users u ON (u.id = o.id_user)
									 	
									 ORDER BY m.name ASC');
									 
		while ($data = mysql_fetch_array($query_orders))
		{
			$json .= '{"id_order":'.$data['id'].',"menu":"'.$data['nombremenu'].'","user":"'.$data['userasked'].'","date":"'.$data['date'].'","confirmed":"'.$data['confirmed'].'","details":';
		
			$check_details = mysql_query('SELECT do.*, d.name_detail as detail_name FROM details_orders do
											INNER JOIN details d ON (d.id = do.id_detail)
										  WHERE do.id_users_menu = '.$data['id']);						  
										 
										  
			if (mysql_num_rows($check_details) > 0)
			{
				$json .= '[';
				
				while ($detailsdata = mysql_fetch_array($check_details))
				{
					$json .= '{"id_detail":'.$detailsdata['id'].',"name_detail":"'.$detailsdata['detail_name'].'","quant":'.$detailsdata['quant'].'},';	
				}				
				
				$json = substr($json,0,-1);
				
				$json .= ']';
			
			}
			else
			{
				$json .= '0';			
			}
		
			$json .= '},';
		
		}
		
		$json = substr($json,0,-1);
		
		$json .= ']';		
		
		return $json;
	
	}
	
	
	
	
}


?>