<?php
	include_once '../db.php';

	$sql = "
		SELECT 
			vorname, 
			nachname, 
			DATE_FORMAT(geburtsdatum, '%d.%m.%Y') AS geburtsdatum, 
			userId, 
			passwort, 
			rolle_bezeichnung AS rolle 
		FROM 
			user 
			JOIN 
				user_besitzt_rolle 
			ON 
				(user.userId = user_besitzt_rolle.user_userId)
	";
	$sqlResult = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$result = '{"user": ' . $sqlResult . '}';
	echo $result;
?>