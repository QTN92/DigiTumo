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
				this.byId("__xmlview1--user").setValueState(sap.ui.core.ValueState.None);
				this.byId("__xmlview1--passwort").setValueState(sap.ui.core.ValueState.None);

				// Auslesen des Inputs für User und PW
				var userStrng = this.byId("__xmlview1--user").getValue();
				var pwStrng = this.byId("__xmlview1--passwort").getValue();

				// Auswertung des Inputs
				// Handling, falls min. ein Input fehlt
				if (userStrng === "" || pwStrng === "") {
					// Unterscheidung, ob beides oder nur eines nicht eingegeben wurde inkl. Handling
					if (userStrng === "" && pwStrng === "") {
						// Inputfelder kennzeichnen, um fehlende Werte hervorzuheben
						this.byId("__xmlview1--user").setValueState(sap.ui.core.ValueState.Error);
						this.byId("__xmlview1--user").setShowValueStateMessage(false);
						this.byId("__xmlview1--passwort").setValueState(sap.ui.core.ValueState.Error);
						this.byId("__xmlview1--passwort").setShowValueStateMessage(false);
						// Fehlermeldung ausgeben
						MessageBox.error("Bitte Nutzernamen und Passwort eingeben!");
					}
					// Handling, wenn nur Username fehlt; Handling äquivalent
					else if (userStrng === "") {
						this.byId("__xmlview1--user").setValueState(sap.ui.core.ValueState.Error);
						this.byId("__xmlview1--user").setShowValueStateMessage(false);
						MessageBox.error("Bitte Nutzernamen eingeben!");
					}
					// Handling, wenn nur PW fehlt; Handling äquivalent
					else {
						this.byId("__xmlview1--passwort").setValueState(sap.ui.core.ValueState.Error);
						this.byId("__xmlview1--passwort").setShowValueStateMessage(false);
						MessageBox.error("Bitte Passwort eingeben!");
					}
				}
				// Handling, wenn Username und PW eingegeben wurden
				else {
					// Ajax call zum Aufruf des PHP zum Datenabruf
					$.ajax({
						url: "php/login/login.php",
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
									// Ausgelagertes Handling des erfolgreichen Logins
									this.onLoginSuccessful();
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
							MessageBox.error("Die Verbindung ist fehlgeschlagen.");
						}
					});
				}
			},

			onLoginSuccessful: function() {
				// Rolle des angemeldeten Nutzers abrufen
				$.ajax({
					url: "php/login/getUserRole.php",
					data: {
						"user": this.byId("__xmlview1--user").getValue()
					},	
					type: "POST",
					context: this,
					success: function handleSuccess(response) {
						// Rollenabhängige Navigation
						switch(response) {
						// 0: User ist Admin
						case '0':
							// TODO: Navigation Admin
							MessageBox.show("Anmeldung als Admin erfolgreich");
							break;
						// 1: User kann Nachrichten pflegen
						case '1':
							// TODO: Navigation Newspflege 
							MessageBox.show("Anmeldung zur Pflege von News erfolgreich");
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
			
			//Logik Anwesenheitsliste
			
			onPatienten: function() {
				var oView = this.getView();
				var oDialog = oView.byId("anwesenheitdialog");
				// Dialog laden
				if (!oDialog) {
					// Dialog über fragment factory erstellen
					this.oDialog = sap.ui.xmlfragment(oView.getId(), "DigiTumo.fragment.anwesenheit", this);
					oView.addDependent(oDialog);
				};
				$.ajax({
					url: "php/login/getExperten.php",
					type: "GET",
					context: this,
					success: function handleSuccess(response) {
						var oModel = new JSONModel();
						oModel.setJSON(response);
						sap.ui.getCore().byId("__xmlview1--anwesenheitdialog").setModel(oModel);
					},
					error: function handleError(response) {
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");
					}
				});
				this.oDialog.open();
			},
			
			onSpeichern: function() {
				//
				this.oDialog.close();
				this.getOwnerComponent().getTargets().display("patienten");
			},
			
			onOhneSpeichern: function(){
				this.oDialog.close();
				this.getOwnerComponent().getTargets().display("patienten");
			},
			
			//Testen von Views
			
			onAdmin: function() {
				this.getOwnerComponent().getTargets().display("admin");
			},
			onNewspflege: function() {
				this.getOwnerComponent().getTargets().display("newspflege");
			}
		});
	});