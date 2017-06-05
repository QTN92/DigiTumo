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


			onLogin: function() { 	
				// Initial beide Felder auf fehlerfrei setzen, um ggf. neu eintragene Inputs zu berücksichtigen
				this.byId("__xmlview1--user").setValueState(sap.ui.core.ValueState.None);
				this.byId("__xmlview1--passwort").setValueState(sap.ui.core.ValueState.None);
				
				// Auslesen des Inputs für User und PW
				var userInput = this.byId("__xmlview1--user").getValue();
				var pwInput = this.byId("__xmlview1--passwort").getValue();
				
				// Auswertung des Inputs
				// Handling, falls min. ein Input fehlt
				if(userInput === "" || pwInput ==="") {
					// Unterscheidung, ob beides oder nur eines nicht eingegeben wurde inkl. Handling
					if(userInput === "" && pwInput ==="") {
						// Inputfelder kennzeichnen, um fehlende Werte hervorzuheben
						this.byId("__xmlview1--user").setValueState(sap.ui.core.ValueState.Error);
						this.byId("__xmlview1--user").setShowValueStateMessage(false);
						this.byId("__xmlview1--passwort").setValueState(sap.ui.core.ValueState.Error);
						this.byId("__xmlview1--passwort").setShowValueStateMessage(false);
						// Fehlermeldung ausgeben
						sap.m.MessageToast.show("Bitte Nutzernamen und Passwort eingeben!");
					}
					// Handling, wenn nur Username fehlt; Handling äquivalent
					else if(userInput ==="") {
						this.byId("__xmlview1--user").setValueState(sap.ui.core.ValueState.Error);
						this.byId("__xmlview1--user").setShowValueStateMessage(false);
						sap.m.MessageToast.show("Bitte Nutzernamen eingeben!");
					}
					// Handling, wenn nur PW fehlt; Handling äquivalent
					else{
						this.byId("__xmlview1--passwort").setValueState(sap.ui.core.ValueState.Error);
						this.byId("__xmlview1--passwort").setShowValueStateMessage(false);
						sap.m.MessageToast.show("Bitte Passwort eingeben!");
					}
				}
				// Handling, wenn Username und PW eingegeben wurden
				else {
					// Ajax call zum Aufruf des PHP zum Datenabruf
					$.ajax({
						url: "php/login.php",
						data: {
							"user": userInput,
							"passwort": pwInput
						},
						type: "POST",
						context: this,
						// handleSuccess() wird bei erfolgreicher Ausführung der PHP ausgeführt
						success: function handleSuccess(response) {
							switch (response) {
								// Unterscheidung zwischen den Rückgabewerten der PHP-Ausführung
								// 0: Login war erfolgreich
								case '0':	
									// Zu Patientenübersicht wechseln
									this.onPatienten();
									// Initialzustand der Login-Felder wiederherstellen
									this.byId("__xmlview1--user").setValue("");
									this.byId("__xmlview1--passwort").setValue("");
									break;
								// 1: Nutzername war falsch/ nicht vorhanden
								case '1':
									sap.m.MessageToast.show("Nutzer nicht vorhanden!");
									this.byId("__xmlview1--user").setValueState(sap.ui.core.ValueState.Error);
									this.byId("__xmlview1--user").setShowValueStateMessage(false);
									break;
								// 2: Passwort war falsch
								case '2':
									sap.m.MessageToast.show("Falsches Passwort!");
									this.byId("__xmlview1--passwort").setValueState(sap.ui.core.ValueState.Error);
									this.byId("__xmlview1--passwort").setShowValueStateMessage(false);
									break;
							}
						},
						error: function handleError() {
							sap.m.MessageToast.show("Die Verbindung ist fehlgeschlagen.");
						}
					});
				}
			},

			onPatienten: function() {
				this.getOwnerComponent().getTargets().display("patienten");
			}
		});
	});