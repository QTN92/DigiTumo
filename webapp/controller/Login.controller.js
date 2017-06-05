sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageToast"
	],

	function(Controller, MessageToast) {
		"use strict";

		return Controller.extend("DigiTumo.controller.Login", {

			onLogin: function() {
				// Initial beide Felder auf fehlerfrei setzen, um ggf. neu eintragene Inputs zu berücksichtigen
				this.user.setValueState(sap.ui.core.ValueState.None);
				this.byId("__xmlview1--passwort").setValueState(sap.ui.core.ValueState.None);

				// Auslesen des Inputs für User und PW
				var userInput = this.byId("__xmlview1--user").getValue();
				var pwInput = this.byId("__xmlview1--passwort").getValue();
        
				// Auswertung des Inputs
				// Handling, falls min. ein Input fehlt
				if (userStrng === "" || pwStrng === "") {
					// Unterscheidung, ob beides oder nur eines nicht eingegeben wurde inkl. Handling
					if (userStrng === "" && pwStrng === "") {
						// Inputfelder kennzeichnen, um fehlende Werte hervorzuheben
						this.user.setValueState(sap.ui.core.ValueState.Error);
						this.user.setShowValueStateMessage(true);
						this.pw.setValueState(sap.ui.core.ValueState.Error);
						this.pw.setShowValueStateMessage(true);
						// Fehlermeldung ausgeben
						sap.m.MessageToast.show("Bitte Nutzernamen und Passwort eingeben!");
					}
					// Handling, wenn nur Username fehlt; Handling äquivalent
					else if (userStrng === "") {
						this.user.setValueState(sap.ui.core.ValueState.Error);
						this.user.setShowValueStateMessage(false);
						sap.m.MessageToast.show("Bitte Nutzernamen eingeben!");
					}
					// Handling, wenn nur PW fehlt; Handling äquivalent
					else {
						this.pw.setValueState(sap.ui.core.ValueState.Error);
						this.pw.setShowValueStateMessage(false);
						sap.m.MessageToast.show("Bitte Passwort eingeben!");
					}
				}
				// Handling, wenn Username und PW eingegeben wurden
				else {
					// Ajax call zum Aufruf des PHP zum Datenabruf
					$.ajax({
						url: "php/login.php",
						data: {
							"user": userStrng,
							"passwort": pwStrng
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
									this.user.setValue("");
									this.pw.setValue("");
									break;
									// 1: Nutzername war falsch/ nicht vorhanden
								case '1':
									sap.m.MessageToast.show("Nutzer nicht vorhanden!");
									this.user.setValueState(sap.ui.core.ValueState.Error);
									this.user.setShowValueStateMessage(false);
									break;
									// 2: Passwort war falsch
								case '2':
									sap.m.MessageToast.show("Falsches Passwort!");
									this.pw.setValueState(sap.ui.core.ValueState.Error);
									this.pw.setShowValueStateMessage(false);
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