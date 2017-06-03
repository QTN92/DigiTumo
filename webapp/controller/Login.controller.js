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
		return Controller.extend("DigiTumo.controller.Login", {

			onInit: function() {
				// Initiale Verbindung zur Datenbank herstellen
				$.ajax({
					url: "php/connect.php",
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
				});
			},

			onLogin: function() {
				//Werte aus den Inputfeldern auslesen
				var userInput = this.byId("__xmlview0--user").getValue();
				var pwInput = this.byId("__xmlview0--passwort").getValue();

				 // Ajax call to call php to handle login
				$.ajax({

					url: "php/login.php",
					//			TODO
					data: {
						"user": userInput,
						"password": pwInput
					},
					type: "POST",
					context: this,
					success: function handleSuccess(response) {

						switch (response) {
							case '0':
								sap.m.MessageToast.show("Login erfolgreich");
								break;
							case '1':
								sap.m.MessageToast.show("Nutzer nicht vorhanden");
								break;
							case '2':
								sap.m.MessageToast.show("Falsches Passwort");
								break;
						}
					}
				});
			}
		});
	});