<?php
	include_once '../db.php';

	$key = $_POST['key'];

	$sql = "
		SELECT 
			patientId, 
			vorname, 
			nachname, 
			DATE_FORMAT(geburtsdatum, '%d.%m.%Y') AS geburtsdatum, 
			bezeichnung AS tumor, 
			datum, 
			stadium AS tumorstadium 
		FROM 
			patient 
			JOIN 
				krankenakte 
			ON 
				(patient.patientId = krankenakte.patient_patientId)
			JOIN 
				krankheiten 
			ON 
				(krankenakte.krankenakteId = krankheiten.krankenakte_krankenakteId)
			JOIN 
				krankheitsverlauf 
			ON 
				(krankenakte.krankenakteId = krankheitsverlauf.krankenakte_krankenakteId) 
		WHERE
			tumor = '0' 
			AND 
				datum = (
					SELECT 
						MAX(datum) 
					FROM 
						krankheitsverlauf 
					WHERE 
						krankenakte_krankenakteId = krankenakte.krankenakteId
				) 
			AND 
				bezeichnung = '$key'
		ORDER BY 
			patientId
	";
	$sqlResult = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$result = '{"patienten": ' . $sqlResult . '}';
	echo $result;
?>