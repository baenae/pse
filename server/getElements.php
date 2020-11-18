<?php
	
	$server = '';
	$database = '';
	$username = '';
	$password = '';
	
	//Verbindung zur Datenbank aufbauen
	$link = mysql_connect($server, $username, $password)
		or die("Keine Verbindung möglich: " . mysql_error());
		
	mysql_query ("set character_set_client='utf8'"); 
	mysql_query ("set character_set_results='utf8'");
	mysql_query ("set collation_connection='utf8_general_ci'"); 
	
	if ($link)
	{
		mysql_select_db($database) 
			or die("Auswahl der Datenbank fehlgeschlagen");
	}

	$result = mysql_query('SELECT * FROM elemente');
	//Ergebnis aus SQL Objekt holen
	
	header("Content-Type: text/plain charset=utf-8");
	header('Access-Control-Allow-Origin: *');
	// respond to preflights
	if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
	  // return only the headers and not the content
	  // only allow CORS if we're doing a GET - i.e. no saving for now.
	  if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']) && $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'] == 'GET') {
		header('Access-Control-Allow-Origin: *');
		header('Access-Control-Allow-Headers: X-Requested-With');
	  }
	  exit;
	}

	
	$output = '{"wert1": [';

	while ($datensatz = mysql_fetch_array($result, MYSQL_ASSOC)) 
	{
		if ($output != '{"wert1": [')
		{
			$output .= "," . "";
		}
		$output .= json_encode ($datensatz);
	}
	$output .= '], "wert2": 17, "wert3": true }';

	mysql_free_result($result);
	echo($output);

?>