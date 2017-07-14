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
				$.ajax({
					url: "php/admin/getRollen.php",
					type: "GET",
					context: this,
					success: function handleSuccess(response) {
						var oModel = new JSONModel();
						oModel.setJSON(response);
						this.getView().byId("Benutzerrolle").setModel(oModel);
					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen."); // Ausgabe einer Messagebox des Typs "Error"
					}
				});
				var anzahlUser;
				$.ajax({
					url: "php/admin/getAnzahlUserMitRolle.php",
					type: "GET",
					context: this,
					success: function handleSuccess(response) {
						anzahlUser = response;
					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen."); // Ausgabe einer Messagebox des Typs "Error"
					}
				});
				$.ajax({ // Aufruf eines AJAX-Calls
					url: "php/admin/getUser.php",
					type: "GET",
					context: this,
					success: function handleSuccess(response) {
						var oModel = new JSONModel();
						oModel.setJSON(response);
						this.getView().setModel(oModel);
						$.ajax({
							url: "php/admin/getUserrollen.php",
							type: "GET",
							context: this,
							success: function handleSuccess(response) {
								oModel = new JSONModel();
								oModel.setJSON(response);
								var id = "Benutzerrolle-" + this.getView().getId() + "--BenutzerTab-";
								for (var i = 0; i < anzahlUser; i++) {
									id = id.substring(0, 38) + i;
									this.getView().byId(id).setSelectedKey(Object.values(Object.values(oModel.getData())[i])[1]);
									this.getView().byId(id).setValue(Object.values(Object.values(oModel.getData())[i])[1]);
								}
							},
							error: function handleError() {
								MessageBox.error("Die Verbindung ist fehlgeschlagen."); // Ausgabe einer Messagebox des Typs "Error"
							}
						});
					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen."); // Ausgabe einer Messagebox des Typs "Error"
					}
				});
			},

			loadUserRollen: function() {

			},

			// Funktion wird beim ersten Aufruf des Views ausgeführt
			onInit: function() {
				this.loadData(); // Aufruf der Funktion loadData
				sap.ui.getCore().attachParseError( // Dient der Eingabeüberprüfung und farblichen Gestaltung der Kästchen
					function(oEvent) {
						var oElement = oEvent.getParameter("value");
						if (oElement.setValueState) {
							oElement.setValueState(sap.ui.core.ValueState.Error);
							oElement.setValueStateText("Bitte ein gültiges Geburtsdatum eingeben.");
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
					this.oDialog = sap.ui.xmlfragment(this.getView().getId(), "DigiTumo.fragment.addUser", this); // Aufruf des Fragments "addBenutzer"
					this.getView().addDependent(oDialog);
				}
				this.oDialog.open(); // Öffnen des Dialogs
			},

			// Funktion wird beim Ändern des Datepicker "geburtsdatum" im Dialog "benutzerdialog" ausgeführt
			handleDateChange: function(oEvent) {
				var valid = oEvent.getParameter("valid");
				if (!valid) {
					this.getView().byId("geburtsdatum").setValueState(sap.ui.core.ValueState.Error); // Ändert den Status auf "Error" (rote Umrandung)
					this.getView().byId("geburtsdatum").setShowValueStateMessage(true);
				} else {
					this.getView().byId("geburtsdatum").setValueState(sap.ui.core.ValueState.None); // Ändert den Status auf "None"
				}
			},

			// Funktion wird beim Klick auf den Button mit dem Diskettensymbol im Dialog "benutzerdialog" ausgeführt
			onSaveNeuerUser: function() {
				var oVorname = this.getView().byId("vorname");
				var oVornameValue = oVorname.getValue(); // Auslesen des Wertes "Vorname"
				var validVorname = true; // Variable "validVorname" initial falsch setzen
				if (oVornameValue === "") { // Abfangen von leerer Eingabe
					oVorname.setValueState(sap.ui.core.ValueState.Error); // Ändert den Status auf "Error"
					oVorname.setValueStateText("Bitte einen Vornamen eingeben."); // Ausgabe einer Messagebox des Typs "Error"
					validVorname = false;
				} else if (oVornameValue.search(/^[a-zA-ZäÄöÖüÜ\- ]+$/) === -1) { // Abfangen von Sonderzeichen und Zahlen 
					oVorname.setValueState(sap.ui.core.ValueState.Error); // Ändert den Status auf "Error"
					oVorname.setValueStateText("Der Vorname darf nur Buchstaben enthalten."); // Ausgabe einer Messagebox des Typs "Error"
					validVorname = false;
				} else if (oVornameValue.length > 40) {
					oVorname.setValueState(sap.ui.core.ValueState.Error);
					oVorname.setValueStateText("Der Vorname darf max. 40 Zeichen lang sein.");
					validVorname = false;
				} else {
					oVorname.setValueState(sap.ui.core.ValueState.None); // Ändert den Status auf "None"
					oVornameValue = oVornameValue.trim();
					oVornameValue = oVornameValue[0].toUpperCase() + oVornameValue.substring(1, oVornameValue.length);
				}

				var oNachname = this.getView().byId("nachname");
				var oNachnameValue = oNachname.getValue(); // Auslesen des Wertes "Vorname"
				var validNachname = true; // Variable "validNachname" initial falsch setzen
				if (oNachnameValue === "") { // Abfangen von leerer Eingabe
					oNachname.setValueState(sap.ui.core.ValueState.Error); // Ändert den Status auf "Error"
					oNachname.setValueStateText("Bitte einen Nachnamen eingeben.");
					validNachname = false;
				} else if (oNachnameValue.search(/^[a-zA-ZäÄöÖüÜ\- ]+$/) === -1) { // Abfangen von Sonderzeichen und Zahlen
					oNachname.setValueState(sap.ui.core.ValueState.Error); // Ändert den Status auf "Error"
					oNachname.setValueStateText("Der Nachname darf nur Buchstaben enthalten.");
					validNachname = false;
				} else if (oNachnameValue.length > 40) {
					oNachname.setValueState(sap.ui.core.ValueState.Error);
					oNachname.setValueStateText("Der Nachname darf max. 40 Zeichen lang sein.");
					validNachname = false;
				} else {
					oNachname.setValueState(sap.ui.core.ValueState.None); // Ändert den Status auf "None"
					oNachnameValue = oNachnameValue.trim();
					oNachnameValue = oNachnameValue[0].toUpperCase() + oNachnameValue.substring(1, oNachnameValue.length);
				}

				var oGeb = this.getView().byId("geburtsdatum");
				var oGebValue = oGeb.getValue(); // Auslesen des Wertes "geburtsdatum"
				var validGeburtsdatum = true; // Variable "validGeburtsdatum" initial falsch setzen
				if (oGebValue === "") { // Abfangen von leerer Eingabe
					oGeb.setValueState(sap.ui.core.ValueState.Error); // Ändert den Status auf "Error"
					oGeb.setValueStateText("Bitte ein Geburtsdatum eingeben.");
					validGeburtsdatum = false;
				} else if (oGebValue.substring(6, 10) >= new Date().getFullYear()) {
					oGeb.setValueState(sap.ui.core.ValueState.Error);
					oGeb.setValueStateText("Bitte ein gültiges Geburtsdatum eingeben.");
					validGeburtsdatum = false;
				} else if (oGeb.getValueState() === "Error") { // Falls Status "None"
					oGeb.setValueStateText("Bitte ein gültiges Geburtsdatum eingeben.");
					validGeburtsdatum = false; // Variable "validGeburtsdatum" auf wahr setzen
				} else {
					if (oGebValue.substring(6, 10) > (new Date().getFullYear()) - 18) {
						oGeb.setValueState(sap.ui.core.ValueState.Error);
						oGeb.setValueStateText("Der User muss min. 18 Jahre alt sein.");
						validGeburtsdatum = false;
					} else if (oGebValue.substring(6, 10) === (new Date().getFullYear()) - 18) {
						if (parseInt(oGebValue.substring(3, 5)) > (new Date().getMonth()) + 1) {
							oGeb.setValueState(sap.ui.core.ValueState.Error);
							oGeb.setValueStateText("Der User muss min. 18 Jahre alt sein.");
							validGeburtsdatum = false;
						} else if (parseInt(oGebValue.substring(3, 5)) === (new Date().getMonth()) + 1) {
							if (parseInt(oGebValue.substring(0, 2)) > new Date().getDate()) {
								oGeb.setValueState(sap.ui.core.ValueState.Error);
								oGeb.setValueStateText("Der User muss min. 18 Jahre alt sein.");
								validGeburtsdatum = false;
							}
						}
					}
				}
				var oPw = this.getView().byId("passwort");
				var oPwValue = oPw.getValue(); // Auslesen des Wertes "passwort"	
				var validPasswort = true; // Variable "validPasswort" initial falsch setzen
				if (oPwValue.length < 8) { // Abfangen eines Passworts unter 8 Zeichen
					oPw.setValueState(sap.ui.core.ValueState.Error); // Ändert den Status auf "Error"
					oPw.setValueStateText("Das Passwort muss aus min. acht Zeichen bestehen."); // Ausgabe einer Messagebox des Typs "Error"
					validPasswort = false;
				} else if (oPwValue.length > 30) {
					oPw.setValueState(sap.ui.core.ValueState.Error);
					oPw.setValueStateText("Das Passwort darf max. 30 Zeichen lang sein.");
					validPasswort = false;
				} else {
					var zahl = false; // Variable "zahl" initial falsch setzen
					for (var i = 0; i < oPwValue.length; i++) { // Schleife mit Anzahl der Durchläufe gleich Länge des Passworts in einzelnen Buchtaben
						if (!isNaN(oPwValue[i])) { // isNaN --> is not a number
							zahl = true; // Variable "validGeburtsdatum" auf wahr setzen
						}
					}
					if (!zahl) {
						oPw.setValueState(sap.ui.core.ValueState.Error); // Ändert den Status auf "Error"
						oPw.setValueStateText("Das Passwort muss min. eine Zahl enthalten."); // Ausgabe einer Messagebox des Typs "Error"
						validPasswort = false;
					} else {
						oPw.setValueState(sap.ui.core.ValueState.None); // Ändert den Status auf "None"
					}
				}

				var oBerechtigung = this.getView().byId("berechtigungsstatus");
				var oBerechtigungValue = oBerechtigung.getValue(); // Auslesen des Wertes "berechtigungsstatus"
				var validBerechtigungsstatus = true; // Variable "validBerechtigungsstatus" initial falsch setzen
				if (oBerechtigungValue === "") { // Abfangen von leerer Eingabe
					oBerechtigung.setValueState(sap.ui.core.ValueState.Error); // Ändert den Status auf "Error"
					oBerechtigung.setValueStateText("Bitte einen Berechtigungsstatus auswählen."); // Ausgabe einer Messagebox des Typs "Error"
					validBerechtigungsstatus = false;
				} else if (oBerechtigungValue !== "Arzt" && oBerechtigungValue !== "Administrator" && oBerechtigungValue !== "Studienpflege") { // Abfangen von unbekannter Eingabe
					oBerechtigung.setValueState(sap.ui.core.ValueState.Error); // Ändert den Status auf "Error"
					oBerechtigung.setValueStateText("Bitte einen gültigen Berechtigungsstatus auswählen."); // Ausgabe einer Messagebox des Typs "Error"
					validBerechtigungsstatus = false;
				} else {
					oBerechtigung.setValueState(sap.ui.core.ValueState.None); // Ändert den Status auf "None"
				}

				if (validVorname && validNachname && validGeburtsdatum && validPasswort && validBerechtigungsstatus) {
					$.ajax({ // Aufruf eines AJAX-Calls
						url: "php/admin/generateUserId.php",
						data: {
							"vorname": oVornameValue,
							"nachname": oNachnameValue
						},
						type: "POST",
						context: this,
						success: function handleSuccess(userId) {
							$.ajax({
								url: "php/admin/setNeuenUser.php",
								data: {
									"vorname": oVornameValue,
									"nachname": oNachnameValue,
									"geburtsdatum": oGebValue,
									"passwort": oPwValue,
									"berechtigungsstatus": oBerechtigungValue,
									"userId": userId
								},
								type: "POST",
								context: this,
								success: function handleSuccess() {
									this.loadData();
									this.oDialog.destroy();
									this.oDialog.close();
								},
								error: function handleError() {
									MessageBox.error("Die Verbindung ist fehlgeschlagen."); // Ausgabe einer Messagebox des Typs "Error"
								}
							});
						},
						error: function handleError() {
							MessageBox.error("Die Verbindung ist fehlgeschlagen."); // Ausgabe einer Messagebox des Typs "Error"
						}
					});
				} else {
					MessageBox.error("Bitte die Eingaben überprüfen!");
				}
			},

			// Funktion wird beim Klick auf den Button mit dem roten X im Dialog "benutzerdialog" ausgeführt
			onCancelNeuerUser: function() {
				var pointer = this;
				if (
					this.getView().byId("vorname").getValue() !== "" ||
					this.getView().byId("nachname").getValue() !== "" ||
					this.getView().byId("geburtsdatum").getValue() !== "" ||
					this.getView().byId("passwort").getValue() !== "" ||
					this.getView().byId("berechtigungsstatus").getValue() !== ""
				) {
					MessageBox.confirm("Möchten Sie wirklich alle Änderungen verwerfen?", {
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						onClose: function(sResult) {
							if (sResult === "YES") {
								pointer.oDialog.destroy();
								pointer.oDialog.close();
							}
						}
					});
				} else {
					this.oDialog.destroy(); // Zerstören des Dialogs
					this.oDialog.close(); // Schließen des Dialogs
				}
			},

			// Funktion wird beim Klick auf den Button "DeleteUser" ausgeführt
			onDeleteUser: function(oEvent) {
				var tmp = Object.values(oEvent.getParameters())[0];
				var id = tmp.substring(47, tmp.length);
				var userId = Object.values(Object.values(Object.values(this.getView().getModel().getData())[0])[id])[3];
				var pointer = this;
				MessageBox.confirm("Möchten Sie den Benutzer " + userId + " wirklich löschen?", { // Ausgabe einer Messagebox des Typs "Confirm"
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO], // Definieren der Aktionen
					onClose: function(sResult) {
						if (sResult === "YES") { // Falls Aktion "YES"
							$.ajax({ // Aufruf eines AJAX-Calls
								url: "php/admin/deleteUser.php",
								data: {
									"userId": userId
								},
								type: "POST",
								context: this,
								success: function handleSuccess(response) {
									if (response === "0") {
										MessageBox.error(
											"Der einzige Administrator kann nicht gelöscht werden. Bitte erst einen weiteren Administrator erstellen, bevor Sie diesen Nutzer löschen."
										);
									} else {
										pointer.loadData();
									}
								},
								error: function handleError() {
									MessageBox.error("Die Verbindung ist fehlgeschlagen."); // Ausgabe einer Messagebox des Typs "Error"
								}
							});
						}
					}
				});
			},

			onSave: function() {
				var id = new Array(5);
				id[0] = "Vorname-" + this.getView().getId() + "--BenutzerTab-";
				id[1] = "Nachname-" + this.getView().getId() + "--BenutzerTab-";
				id[2] = "Benutzerkennung-" + this.getView().getId() + "--BenutzerTab-";
				id[3] = "Passwort-" + this.getView().getId() + "--BenutzerTab-";
				id[4] = "Benutzerrolle-" + this.getView().getId() + "--BenutzerTab-";
				var userListe = new Array();
				var i = 0;
				while (this.getView().byId(id[0] + i) !== undefined) {
					userListe[i] = new Array(id.length);
					for (var j = 0; j < userListe[i].length; j++) {
						userListe[i][j] = this.getView().byId(id[j] + i).getValue();
					}
					i++;
				}

				var validVorname = true;
				var validNachname = true;
				var validPasswort = true;
				var validBenutzerrolle = true;
				id = this.getView().getId() + "--BenutzerTab-";
				for (i = 0; i < userListe.length; i++) {
					id = id.substring(0, 24) + i;
					if (userListe[i][0] === "") {
						this.getView().byId("Vorname-" + id).setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("Vorname-" + id).setValueStateText("Bitte einen Vornamen eingeben.");
						validVorname = false;
					} else if (userListe[i][0].search(/^[a-zA-ZäÄöÖüÜ\- ]+$/) === -1) {
						this.getView().byId("Vorname-" + id).setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("Vorname-" + id).setValueStateText("Der Vorname darf nur Buchstaben enthalten.");
						validVorname = false;
					} else if (userListe[i][0].length > 40) {
						this.getView().byId("Vorname-" + id).setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("Vorname-" + id).setValueStateText("Der Vorname darf max. 40 Zeichen lang sein.");
						validVorname = false;
					} else {
						this.getView().byId("Vorname-" + id).setValueState(sap.ui.core.ValueState.None);
						userListe[i][0] = userListe[i][0].trim();
						userListe[i][0] = userListe[i][0][0].toUpperCase() + userListe[i][0].substring(1, userListe[i][0].length);
					}

					if (userListe[i][1] === "") {
						this.getView().byId("Nachname-" + id).setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("Nachname-" + id).setValueStateText("Bitte einen Nachnamen eingeben.");
						validNachname = false;
					} else if (userListe[i][1].search(/^[a-zA-ZäÄöÖüÜ\- ]+$/) === -1) {
						this.getView().byId("Nachname-" + id).setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("Nachname-" + id).setValueStateText("Der Nachname darf nur Buchstaben enthalten.");
						validNachname = false;
					} else if (userListe[i][1].length > 40) {
						this.getView().byId("Nachname-" + id).setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("Nachname-" + id).setValueStateText("Der Nachname darf max. 40 Zeichen lang sein.");
						validNachname = false;
					} else {
						userListe[i][1] = userListe[i][1].trim();
						userListe[i][1] = userListe[i][1][0].toUpperCase() + userListe[i][1].substring(1, userListe[i][1].length);
						this.getView().byId("Nachname-" + id).setValueState(sap.ui.core.ValueState.None);
					}

					if (userListe[i][3].length < 8) {
						this.getView().byId("Passwort-" + id).setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("Passwort-" + id).setValueStateText("Das Passwort muss aus min. acht Zeichen bestehen.");
						validPasswort = false;
					} else if (userListe[i][3].length > 30) {
						this.getView().byId("Passwort-" + id).setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("Passwort-" + id).setValueStateText("Das Passwort darf max. 30 Zeichen lang sein.");
						validPasswort = false;
					} else {
						var zahl = false;
						for (j = 0; j < userListe[i][3].length; j++) {
							if (!isNaN(userListe[i][3][j])) {
								zahl = true;
							}
						}
						if (!zahl) {
							this.getView().byId("Passwort-" + id).setValueState(sap.ui.core.ValueState.Error);
							this.getView().byId("Passwort-" + id).setValueStateText("Das Passwort muss min. eine Zahl enthalten.");
							validPasswort = false;
						} else {
							this.getView().byId("Passwort-" + id).setValueState(sap.ui.core.ValueState.None);
						}
					}

					if (userListe[i][4] === "") {
						this.getView().byId("Benutzerrolle-" + id).setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("Benutzerrolle-" + id).setValueStateText("Bitte einen Berechtigungsstatus auswählen.");
						validBenutzerrolle = false;
					} else if (userListe[i][4] !== "Arzt" && userListe[i][4] !== "Administrator" && userListe[i][4] !== "Studienpflege") {
						this.getView().byId("Benutzerrolle-" + id).setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("Benutzerrolle-" + id).setValueStateText("Bitte einen gültigen Berechtigungsstatus auswählen.");
						this.getView().byId("Benutzerrolle-" + id).setValue("");
						validBenutzerrolle = false;
					} else {
						this.getView().byId("Benutzerrolle-" + id).setValueState(sap.ui.core.ValueState.None);
					}
				}

				if (validVorname && validNachname && validPasswort && validBenutzerrolle) {
					$.ajax({ // Aufruf eines AJAX-Calls
						url: "php/admin/updateUser.php",
						data: {
							"userListe": userListe
						},
						type: "POST",
						context: this,
						success: function handleSuccess(response) {
							if (response === "0") {
								MessageBox.error(
									"Die Rolle des einzigen Administrators kann nicht geändert werden. Bitte erst einen weiteren Administrator erstellen, bevor Sie die Rolle dieses Nutzers ändern."
								);
							} else {
								MessageBox.success("Speichern erfolgreich."); // Ausgabe einer Messagebox des Typs "Success"
							}
							this.loadData();
						},
						error: function handleError() {
							MessageBox.error("Die Verbindung ist fehlgeschlagen."); // Ausgabe einer Messagebox des Typs "Error"
						}
					});
				} else {
					MessageBox.error("Bitte die Eingaben überprüfen!");
				}
			},

			// Funktion wird beim Klick auf den Button "cancel" ausgeführt
			onCancel: function() {
				var pointer = this;
				MessageBox.confirm("Möchten Sie wirklich alle Änderungen verwerfen?", { // Ausgabe einer Messagebox des Typs "Confirm"
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO], // Definieren der Aktionen
					onClose: function(sResult) {
						if (sResult === "YES") { // Falls Aktion "YES"
							pointer.loadData(); // Aufruf der Funktion loadData
						}
					}
				});
			},

			// Funktion wird beim Klick auf den Button "logout" ausgeführt
			onLogout: function() {
				var pointer = this;
				MessageBox.confirm("Möchten Sie sich wirklich abmelden? Nicht gespeicherte Änderungen gehen verloren.", {
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function(sResult) {
						if (sResult === "YES") {
							pointer.loadData();
							pointer.getOwnerComponent().getTargets().display("login");
						}
					}
				});
			}
		});
	});