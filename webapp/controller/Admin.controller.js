sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel"
	],

	function(Controller, MessageBox, JSONModel) {
		"use strict";

		return Controller.extend("DigiTumo.controller.Admin", {
			
			// Auslagern des AJAX-Call als eigene Funktion
			loadData: function() {
				$.ajax({																									// Aufruf eines AJAX-Calls
					url: "php/admin/getUser.php",
					type: "GET",
					context: this,
					success: function handleSuccess(response) {
						var oModel = new JSONModel();
						oModel.setJSON(response);
						this.getView().setModel(oModel);
					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");												// Ausgabe einer Messagebox des Typs "Error"
					}
				});
			},
			
			// Funktion wird beim ersten Aufruf des Views ausgeführt
			onInit: function() {
				this.loadData();																							// Aufruf der Funktion loadData
				sap.ui.getCore().attachParseError(																			// Dient der Eingabeüberprüfung und farblichen Gestaltung der Kästchen
					function(oEvent) {
						var oElement = oEvent.getParameter("value");
                        if (oElement.setValueState) {
                        	oElement.setValueState(sap.ui.core.ValueState.Error);
    						oElement.setShowValueStateMessage(false);
                        }
					}
				);
				sap.ui.getCore().attachValidationSuccess(
					function(oEvent) {
						var oElement = oEvent.getParameter("valid");
                        if (oElement.setValueState) {
                        	oElement.setValueState(sap.ui.core.ValueState.None);
                        }
					}
				);
			},
			
			// Funktion wird beim Klick auf den Button "addUser" ausgeführt
			onAddUser: function() {																						
				var oDialog = this.getView().byId("benutzerdialog");
				if (!oDialog) { 
					this.oDialog = sap.ui.xmlfragment(this.getView().getId(), "DigiTumo.fragment.addBenutzer", this);		// Aufruf des Fragments "addBenutzer"
					this.getView().addDependent(oDialog);
				};
				this.oDialog.open();																						// Öffnen des Dialogs
			},

			// Funktion wird beim Ändern des Datepicker "geburtsdatum" im Dialog "benutzerdialog" ausgeführt
			handleDateChange: function(oEvent) {
				var valid = oEvent.getParameter("valid");
				if (!valid) {
					this.getView().byId("geburtsdatum").setValueState(sap.ui.core.ValueState.Error);						// Ändert den Status auf "Error" (rote Umrandung)
					this.getView().byId("geburtsdatum").setShowValueStateMessage(false);									
				}
				else {
					this.getView().byId("geburtsdatum").setValueState(sap.ui.core.ValueState.None);							// Ändert den Status auf "None"
				};
			},
			
			// Funktion wird beim Klick auf den Button mit dem Diskettensymbol im Dialog "benutzerdialog" ausgeführt
			onUserSave: function() {
				var vorname = this.getView().byId("vorname").getValue();													// Auslesen des Wertes "Vorname"
				var validVorname = false;																					// Variable "validVorname" initial falsch setzen
				if(vorname == "") {																							// Abfangen von leerer Eingabe
					this.getView().byId("vorname").setValueState(sap.ui.core.ValueState.Error);								// Ändert den Status auf "Error"
					this.getView().byId("vorname").setShowValueStateMessage(false);
					MessageBox.error("Bitte einen Vornamen eingeben.");														// Ausgabe einer Messagebox des Typs "Error"
				}
				else {
					if(vorname.search(/^[a-zA-Z ]+$/) == -1) {																// Abfangen von Sonderzeichen und Zahlen 
						this.getView().byId("vorname").setValueState(sap.ui.core.ValueState.Error);							// Ändert den Status auf "Error"
						this.getView().byId("vorname").setShowValueStateMessage(false);
						MessageBox.error("Der Vorname darf nur Buchstaben enthalten.");										// Ausgabe einer Messagebox des Typs "Error"
						this.getView().byId("vorname").setValue("");														// Entfernen der falschen Eingabe
					}
					else {
						this.getView().byId("vorname").setValueState(sap.ui.core.ValueState.None);							// Ändert den Status auf "None"
						vorname = vorname.trim();
						vorname = vorname[0].toUpperCase() + vorname.substring(1, vorname.length);
						validVorname = true;																				// Variable "validVorname" auf wahr setzen
					};
				};
				if(validVorname) {																							// Falls Variable Variable "validVorname" wahr ist
					var nachname = this.getView().byId("nachname").getValue();												// Auslesen des Wertes "Vorname"
					var validNachname = false;																				// Variable "validNachname" initial falsch setzen
					if(nachname == "") {																					// Abfangen von leerer Eingabe
						this.getView().byId("nachname").setValueState(sap.ui.core.ValueState.Error);						// Ändert den Status auf "Error"
						this.getView().byId("nachname").setShowValueStateMessage(false);									
						MessageBox.error("Bitte einen Nachnamen eingeben.");												// Ausgabe einer Messagebox des Typs "Error"
					}
					else {
						if(nachname.search(/^[a-zA-Z ]+$/) == -1) {															// Abfangen von Sonderzeichen und Zahlen
							this.getView().byId("nachname").setValueState(sap.ui.core.ValueState.Error);					// Ändert den Status auf "Error"
							this.getView().byId("nachname").setShowValueStateMessage(false);
							MessageBox.error("Der Nachname darf nur Buchstaben enthalten.");								// Ausgabe einer Messagebox des Typs "Error"
							this.getView().byId("nachname").setValue("");													// Entfernen der falschen Eingabe
						}
						else {
							this.getView().byId("nachname").setValueState(sap.ui.core.ValueState.None);						// Ändert den Status auf "None"
							nachname = nachname.trim();
							nachname = nachname[0].toUpperCase() + nachname.substring(1, nachname.length);
							validNachname = true;																			// Variable "validNachname" auf wahr setzen
						};
					};
				};
				if(validVorname && validNachname) {																			// Falls Variable "validVorname" und "validNachname" wahr sind
					var geburtsdatum = this.getView().byId("geburtsdatum").getValue();										// Auslesen des Wertes "geburtsdatum"
					var validGeburtsdatum = false;																			// Variable "validGeburtsdatum" initial falsch setzen
					if(geburtsdatum == "") {																				// Abfangen von leerer Eingabe
						this.getView().byId("geburtsdatum").setValueState(sap.ui.core.ValueState.Error);					// Ändert den Status auf "Error"
						this.getView().byId("geburtsdatum").setShowValueStateMessage(false);
						MessageBox.error("Bitte ein Geburtsdatum eingeben.");												// Ausgabe einer Messagebox des Typs "Error"
					}
					else {
						if(this.getView().byId("geburtsdatum").getValueState() == "None") {									// Falls Status "None"
							validGeburtsdatum = true;																		// Variable "validGeburtsdatum" auf wahr setzen
						};
					};
				};
				if(validVorname && validNachname && validGeburtsdatum) {													// Falls Variable "validVorname", "validNachname" und "validGeburtsdatum" wahr sind
					var passwort = this.getView().byId("passwort").getValue();												// Auslesen des Wertes "passwort"	
					var validPasswort = false;																				// Variable "validPasswort" initial falsch setzen
					if(passwort.length < 8) {																				// Abfangen eines Passworts unter 8 Zeichen
						this.getView().byId("passwort").setValueState(sap.ui.core.ValueState.Error);						// Ändert den Status auf "Error"
						this.getView().byId("passwort").setShowValueStateMessage(false);
						MessageBox.error("Das Passwort muss aus min. acht Zeichen bestehen.");								// Ausgabe einer Messagebox des Typs "Error"
					} 
					else {
						var zahl = false;																					// Variable "zahl" initial falsch setzen
						for(var i = 0; i < passwort.length; i++) {															// Schleife mit Anzahl der Durchläufe gleich Länge des Passworts in einzelnen Buchtaben
							if(!isNaN(passwort[i])) {																		// isNaN --> is not a number
								zahl = true;																				// Variable "validGeburtsdatum" auf wahr setzen
							};
						};
						if(!zahl) {
							this.getView().byId("passwort").setValueState(sap.ui.core.ValueState.Error);					// Ändert den Status auf "Error"
							this.getView().byId("passwort").setShowValueStateMessage(false);
							MessageBox.error("Das Passwort muss min. eine Zahl enthalten.");								// Ausgabe einer Messagebox des Typs "Error"
						}
						else {
							this.getView().byId("passwort").setValueState(sap.ui.core.ValueState.None);						// Ändert den Status auf "None"
							validPasswort = true;																			// Variable "validPasswort" auf wahr setzen
						};
					};
				};
				if(validVorname && validNachname && validGeburtsdatum && validPasswort) {									// Falls Variable "validVorname", "validNachname", "validGeburtsdatum" und "validPasswort" wahr sind
					var berechtigungsstatus = this.getView().byId("berechtigungsstatus").getValue();						// Auslesen des Wertes "berechtigungsstatus"
					var validBerechtigungsstatus = false;																	// Variable "validBerechtigungsstatus" initial falsch setzen
					if(berechtigungsstatus == "") {																			// Abfangen von leerer Eingabe
						this.getView().byId("berechtigungsstatus").setValueState(sap.ui.core.ValueState.Error);				// Ändert den Status auf "Error"
						this.getView().byId("berechtigungsstatus").setShowValueStateMessage(false);
						MessageBox.error("Bitte einen Berechtigungsstatus auswählen.");										// Ausgabe einer Messagebox des Typs "Error"
					}
					else if(berechtigungsstatus !== "Arzt" && berechtigungsstatus !== "Administrator" && berechtigungsstatus !== "Newspflege") {			// Abfangen von unbekannter Eingabe
						this.getView().byId("berechtigungsstatus").setValueState(sap.ui.core.ValueState.Error);				// Ändert den Status auf "Error"
						this.getView().byId("berechtigungsstatus").setShowValueStateMessage(false);
						MessageBox.error("Bitte einen gültigen Berechtigungsstatus auswählen.");							// Ausgabe einer Messagebox des Typs "Error"
					}
					else {
						this.getView().byId("berechtigungsstatus").setValueState(sap.ui.core.ValueState.None);				// Ändert den Status auf "None"
						validBerechtigungsstatus = true;																	// Variable "validBerechtigungsstatus" auf wahr setzen
					}
				};
				
				if(validVorname && validNachname && validGeburtsdatum && validPasswort && validBerechtigungsstatus) {		// Falls Variable "validVorname", "validNachname", "validGeburtsdatum", "validPasswort" und "validBerechtigungsstatus" wahr sind
					$.ajax({																								// Aufruf eines AJAX-Calls
						url: "php/admin/generateUserId.php",
						data: {
							"vorname": vorname,
							"nachname": nachname
						},
						type: "POST",
						context: this,
						success: function handleSuccess(userId) {
							$.ajax({
								url: "php/admin/setNewUser.php",
								data: {
									"vorname": vorname,
									"nachname": nachname,
									"geburtsdatum": geburtsdatum,
									"passwort": passwort,
									"berechtigungsstatus": berechtigungsstatus,
									"userId": userId
								},
								type: "POST",
								context: this,
								success: function handleSuccess(response) {
									this.loadData();
									this.oDialog.destroy();
									this.oDialog.close();
								},
								error: function handleError() {
									MessageBox.error("Die Verbindung ist fehlgeschlagen.");									// Ausgabe einer Messagebox des Typs "Error"
								}
							});
						},
						error: function handleError() {
							MessageBox.error("Die Verbindung ist fehlgeschlagen.");											// Ausgabe einer Messagebox des Typs "Error"
						}
					});
				};
			},
			
			// Funktion wird beim Klick auf den Button mit dem roten X im Dialog "benutzerdialog" ausgeführt
			onClose: function() {
				this.oDialog.destroy();																						// Zerstören des Dialogs
				this.oDialog.close();																						// Schließen des Dialogs
			},
			
			// Funktion wird beim Klick auf den Button "save" ausgeführt
			onSave: function() {
				var i = 0;
				var userListe = new Array();
				var tmpObject = Object.values(this.getView().getModel().getData())[0];
				while (Object.values(tmpObject)[i] != null) {
					userListe[i] = new Array(6);
					for (var j = 0; j < userListe[i].length; j++) {
						userListe[i][j] = Object.values(Object.values(tmpObject)[i])[j];
					};
					i++;
				};
				$.ajax({																									// Aufruf eines AJAX-Calls
					url: "php/admin/updateUser.php",
					data: {
						"userListe": userListe
					},
					type: "POST",
					context: this,
					success: function handleSuccess() {
						MessageBox.success("Speichern erfolgreich.");														// Ausgabe einer Messagebox des Typs "Success"
					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");												// Ausgabe einer Messagebox des Typs "Error"
					}
				});
			},

			// Funktion wird beim Klick auf den Button "cancel" ausgeführt
			onCancel: function() {
				var pointer = this;
				MessageBox.confirm("Möchten Sie wirklich alle Änderungen verwerfen?", {										// Ausgabe einer Messagebox des Typs "Confirm"
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],										// Definieren der Aktionen
					onClose: function(sResult) {
						if(sResult == "YES") {																				// Falls Aktion "YES"
							pointer.loadData();																				// Aufruf der Funktion loadData
						};
					}
				});
			},

			// Funktion wird beim Klick auf den Button "DeleteUser" ausgeführt
			onDeleteUser: function(oEvent) {
				var tmp = Object.values(oEvent.getParameters())[0];
				var id = tmp.substring(47, tmp.length);
				var userId = Object.values(Object.values(Object.values(this.getView().getModel().getData())[0])[id])[3];
				var pointer = this;
				MessageBox.confirm("Möchten Sie den Benutzer " + userId + " wirklich löschen?", {							// Ausgabe einer Messagebox des Typs "Confirm"
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],										// Definieren der Aktionen
					onClose: function(sResult) {
						if(sResult == "YES") {																				// Falls Aktion "YES"
							$.ajax({																						// Aufruf eines AJAX-Calls
								url: "php/admin/deleteUser.php",
								data: {
									"userId": userId
								},
								type: "POST",
								context: this,
								success: function handleSuccess() {
									pointer.loadData();
								},
								error: function handleError() {
									MessageBox.error("Die Verbindung ist fehlgeschlagen.");									// Ausgabe einer Messagebox des Typs "Error"
								}
							})
						};
					}
				});
			},
			
			// Funktion wird beim Klick auf den Button "logout" ausgeführt
			onLogout: function() {												 
				this.getOwnerComponent().getTargets().display("login");														// Anzeigen des Views "Login" 
			}
		});
	});