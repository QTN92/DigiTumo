sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageToast"
	],

	function(Controller, MessageToast) {
		"use strict";
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf digitumo.Login
		 */
		return Controller.extend("DigiTumo.controller.Patienten", {

			onInit: function() {
				// Initiale Verbindung zur Datenbank herstellen
/*				$.ajax({
					url: "php/db.php",
					context: this,
					// Success behandelt in diesem Fall sowohl success als auch failure, da bei fehlgeschlagenem Verbindungsaufbau kein verwertbarer Fehler geworfen wird
					success: function handleSuccess(response) {
						if (response === "success") {
							MessageToast.show("Verbindung zur Datenbank wurde erfolgreich hergestellt.", {});
						} else {
							//					sap.m.MessageBox.error("Verbindung zur Datenbank ist fehlgeschlagen.", {});
							// TODO MessageToast endgültig durch MessageBox ersetzen. MessageToast nur zur Erleichterung der Entwicklung
							MessageToast.show("Verbindung zur Datenbank ist fehlgeschlagen.", {});
						}
					}
				});*/
				
			}
		});
	});