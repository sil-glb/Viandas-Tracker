<?php

class Bd //Singleton
{
    //almacena un objeto resourse que tiene un identificador de
    //conexion "linkid" o 0 en caso de error
    private $_oLinkId;
    private $_sServidor;
    private $_sNombreBD;
    private $_sUsuario;
    private $_sClave;
    private $_sMensaje;
 
    private static $_oSelf = null;
 
    private function __construct()
    {        
        $this->_sServidor = "localhost";
        $this->_sNombreBD = "globant_viandas";
        $this->_sUsuario = "root";
        $this->_sClave = "";
        $this->_sMensaje = "";
    }
 
    
    public static function get_instancia()
    {
        //Si no hay instancia de BaseDatos
        //en la variable estatica $_oSelf
        if( !self::$_oSelf instanceof self )
        {
            //Se crea un objeto de BaseDatos guardandolo
            //en la varialbe estatica
            //new self ejecuta __construct()
            self::$_oSelf = new self;
        }
        //Se devuelve el objeto creado
        return self::$_oSelf;
    }
 
    
    public function conectar()
    {
        //Si no existe un recurso previo se intenta crear uno nuevo
        if($this->_oLinkId==0)
        {
            //VERIFICAMOS LA CONEXION AL MOTOR DE BD
            
            $oMysqlConnect = mysql_connect
            (
                $this->_sServidor,
                $this->_sUsuario,
                $this->_sClave
            );
 
            //si no es tipo resource es q no ha tenido exito la conexion;
            if(!is_resource($oMysqlConnect))
            {
                $this->_sMensaje = "ERROR: No se puede conectar a la base de datos..! ".$this->_sNombreBD;
                //Lanza la excepcion y se sale del procedimiento
                throw new Exception($this->_sMensaje);
                die;
            }
 
            //Guardamos el id del recurso conectado
            $this->_oLinkId = $oMysqlConnect;
 
            //VERIFICAMOS QUE EXISTA LA BASE DE DATOS EN EL MOTOR
            $bExisteBD  =  mysql_select_db($this->_sNombreBD, $oMysqlConnect);
            //si no se pudo encontrar esa BD lanza un error
            if(!$bExisteBD)
            {
                $this->_sMensaje = "ERROR: No se puede usar la base de datos..! ".$this->_sNombreBD;
                //Lanza la excepcion y se sale del procedimiento
                throw new Exception($this->_sMensaje);
                die;
            }
            else //Si se conecto
            {
                $this->_sMensaje = "SE CONECTO CON EXITO";
                mysql_set_charset('utf8',$this->_oLinkId);
            }
 
        }//fin Ya existe recurso abierto por lo tanto se puede instanciar con get_link_id()
        return true;
    }
	
	private function get_servidor()
    {
        return $this->_sServidor;
    }
 
    public function get_usuario()
    {
        return $this->_sUsuario;
    }
 
    private function get_clave()
    {
        return $this->_sClave;
    }
 
    public function get_mensaje()
    {
        return $this->_sMensaje;
    }
 
    public function get_nombre_bd()
    {
        return $this->_sNombreBD;
    }
 
    /**
    * Devuelve un entero mayor a 0 si hay conexión.
    * En caso contrario 0
    */
    public function get_link_id()
    {
        return $this->_oLinkId;
    }
}
?>