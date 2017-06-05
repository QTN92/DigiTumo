<?php
	function sql($sql) {
		// Aufruf der Funktion zur Erstellung einer DB-Verbindung
		$conn = connect();

		// Ausführung des Statements und Speichern des Ergebnisses
		$result = $conn->query($sql);

		// Handling wenn das Statement kein Select war
		if (gettype($result) == 'boolean') {
			// Rückgabe: War die Abfrage erfolgreich oder nicht?
			return $result;
		}
		// Handling wenn das Statement ein Select war
		else {
			// Iteration über alle Ergebnisreihen zum Auslesen des Ergebnisses
			$rows = array();
			while ($r = $result->fetch_assoc()) {
				$rows[] = $r;
			};
			// Rückgabe: Ergebnis
			return $rows;
		};

		// Schließen von Ergebnisset und Verbindung zur Freigabe von Ressourcen
		$result->close();
		$conn->close();
	}

	function connect() {
		$servername = "localhost";
		$username = "admin";
		$password = "";
		$database = "test";

		// Erstellen der DB-Verbindung 
		$conn = new mysqli($servername, $username, $password, $database);

		// Prüfung der Verbindung
		if ($conn->connect_error) {
			die($conn->connect_error);
		};
		// Rückgabe der Verbindung
		return $conn;
	}
?>