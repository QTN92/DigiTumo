sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel"
	],

	function(Controller, MessageBox, JSONModel) {
		"use strict";

		return Controller.extend("DigiTumo.controller.Login", {

			onLogin: function() {
				// Initial beide Felder auf fehlerfrei setzen, um ggf. neu eintragene Inputs zu berücksichtigen
				this.getView().byId("user").setValueState(sap.ui.core.ValueState.None);
				this.getView().byId("passwort").setValueState(sap.ui.core.ValueState.None);

				// Auslesen des Inputs für User und PW
				var userId = this.getView().byId("user").getValue();
				var passwort = this.getView().byId("passwort").getValue();

				// Auswertung des Inputs
				// Handling, falls min. ein Input fehlt
				if (userId === "" || passwort === "") {
					// Unterscheidung, ob beides oder nur eines nicht eingegeben wurde inkl. Handling
					if (userId === "" && passwort === "") {
						// Inputfelder kennzeichnen, um fehlende Werte hervorzuheben
						this.getView().byId("user").setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("user").setShowValueStateMessage(false);
						this.getView().byId("passwort").setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("passwort").setShowValueStateMessage(false);
						// Fehlermeldung ausgeben
						MessageBox.error("Bitte Nutzernamen und Passwort eingeben!");
					}
					// Handling, wenn nur Username fehlt; Handling äquivalent
					else if (userId === "") {
						this.getView().byId("user").setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("user").setShowValueStateMessage(false);
						MessageBox.error("Bitte Nutzernamen eingeben!");
					}
					// Handling, wenn nur PW fehlt; Handling äquivalent
					else {
						this.getView().byId("passwort").setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("passwort").setShowValueStateMessage(false);
						MessageBox.error("Bitte Passwort eingeben!");
					}
				}
				// Handling, wenn Username und PW eingegeben wurden
				else {
					// Ajax call zum Aufruf des PHP zum Datenabruf
					$.ajax({
						url: "php/login/login.php",
						data: {
							"userId": userId,
							"passwort": passwort
						},
						type: "POST",
						context: this,
						// handleSuccess() wird bei erfolgreicher Ausführung der PHP ausgeführt
						success: function handleSuccess(response) {
							switch (response) {
								// Unterscheidung zwischen den Rückgabewerten der PHP-Ausführung
								// 0: Login war erfolgreich
								case '0':	
									// Ausgelagertes Handling des erfolgreichen Logins
									this.onLoginSuccessful();
									// Initialzustand der Login-Felder wiederherstellen
									this.getView().byId("user").setValue("");
									this.getView().byId("passwort").setValue("");
									break;
									// 1: Nutzername war falsch/ nicht vorhanden
								case '1':
									MessageBox.error("Nutzer nicht vorhanden!");
									this.getView().byId("user").setValueState(sap.ui.core.ValueState.Error);
									this.getView().byId("user").setShowValueStateMessage(false);
									break;
									// 2: Passwort war falsch
								case '2':
									MessageBox.error("Falsches Passwort!");
									this.getView().byId("passwort").setValueState(sap.ui.core.ValueState.Error);
									this.getView().byId("passwort").setShowValueStateMessage(false);
									break;
							}
						},
						error: function handleError() {
							MessageBox.error("Die Verbindung ist fehlgeschlagen.");
						}
					});
				}
			},

			onLoginSuccessful: function() {
				// Rolle des angemeldeten Nutzers abrufen
				$.ajax({
					url: "php/login/getUserrolle.php",
					data: {
						"userId": this.getView().byId("user").getValue()
					},	
					type: "POST",
					context: this,
					success: function handleSuccess(response) {
						// Navigation kann in späterer Version erweitert werden
						// Mögliches Szenario: Ein Nutzer hat mehrere Rollen
						// Aktuelles Szenario: Ein Nutzer hat eine Rolle
						// Response: Rückgabe aller Rollen eines Users
						var rollen = new Array(response.length);
						for(var i = 0; i < rollen.length; i++) {
							rollen[i] = response[i];
						};
						// Ab hier: Navigation basierend auf aktuellem Szenario
						// Die folgende Passage muss für die Implementation des möglichen Szenarios geändert werden
						switch(rollen[0]) {
						// 0: User ist Admin
						case '0':
							this.getOwnerComponent().getTargets().display("admin");
							break;
						// 1: User kann Nachrichten pflegen
						case '1':
							// TODO: Navigation Studienpflege 
							this.getOwnerComponent().getTargets().display("studienpflege");
							break;
						// 2: User ist Arzt
						case '2':
							this.getOwnerComponent().getTargets().display("patienten");
							break;
						}
					}
				});
			},
			
			onPwInputChange: function() {
				this.byId("passwort").setValueState(sap.ui.core.ValueState.none);
			},
			
			onUserInputChange: function() {
				this.byId("user").setValueState(sap.ui.core.ValueState.none);
			},
				
			// TEST-BUTTON
			onPatienten: function() {
				this.getOwnerComponent().getTargets().display("patienten");
			},
			onAdmin: function() {
				this.getOwnerComponent().getTargets().display("admin");
			},
			onStudienpflege: function() {
				this.getOwnerComponent().getTargets().display("studienpflege");
			}
		});
	});