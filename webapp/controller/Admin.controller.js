sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel"
	],

	function(Controller, MessageBox, JSONModel) {
		"use strict";

		return Controller.extend("DigiTumo.controller.Admin", {

			// Auslagern des AJAX-Call als eigene Funktion, da diese mehrfach genutzt wird. Es werden User mit ihren Rollen geladen.
			loadData: function() {
				// Binding der Rollen
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
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");
					}
				});
				var anzahlUser;
				// Binding der Hilfstabelle
				$.ajax({
					url: "php/admin/getAnzahlUserMitRolle.php",
					type: "GET",
					context: this,
					success: function handleSuccess(response) {
						anzahlUser = response;
					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen."); 
					}
				});
				// Binding der User
				$.ajax({
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
								MessageBox.error("Die Verbindung ist fehlgeschlagen."); 
							}
						});
					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");
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
							oElement.setValueStateText("Bitte geben Sie ein gültiges Datum ein.");
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

			// damit der View übersichtlich bleibt, öffnet sich beim Hinzufügen neuer User ein seperater Dialog
			onAddUser: function() {
				var oDialog = this.getView().byId("benutzerdialog");
				if (!oDialog) {
					this.oDialog = sap.ui.xmlfragment(this.getView().getId(), "DigiTumo.fragment.addUser", this);
					this.getView().addDependent(oDialog);
				}
				this.oDialog.open(); // Öffnen des Dialogs
			},

			// Funktion wird beim Ändern des Datepicker "geburtsdatum" im Dialog "benutzerdialog" ausgeführt. SAPUI5 prüft selbstständig, ob der Input ein Datum ist.
			handleDateChange: function(oEvent) {
				var valid = oEvent.getParameter("valid");
				if (!valid) {
					this.getView().byId("geburtsdatum").setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId("geburtsdatum").setShowValueStateMessage(true);
				} else {
					this.getView().byId("geburtsdatum").setValueState(sap.ui.core.ValueState.None);
				}
			},

			/** Funktion wird beim Klick auf den Button mit dem Diskettensymbol im Dialog "benutzerdialog" ausgeführt
			*	Bevor der neue Eintrag gespeichert wird, werden Schritt für Schritt die Eingaben geprüft. Vor- und
			*	Nachname dürfen keine Sonderzeichen oder Zahlen enthalten und nicht länger als 40 Zeichen sein. Das
			*	erste Zeichen wird automatisch groß geschrieben. Leere Eingaben sind immer ungültig. Das Geburstdatum
			*	muss zum einen ein gültiges Datum sein, zum anderen muss der User min. 18 Jahre alt sein. Das Passwort
			*	muss aus min. acht und max. 30 Zeichen bestehen, sowie eine Zahl enthalten. Für jeden Wert wird eine 
			*	Prüfvariable "validWert" erstellt, welche bei fehlerhafter Eingabe auf falsch gesetzt wird. Der Status
			*	des Objekts wird auf Error gesetzt, was eine rote Umrandung und eine Fehlertext für den Nutzer bewirkt.
			*/
			onSaveNeuerUser: function() {
				var oVorname = this.getView().byId("vorname");
				var oVornameValue = oVorname.getValue(); // Auslesen des Wertes "Vorname"
				var validVorname = true; // Variable "validVorname" initial falsch setzen
				if (oVornameValue === "") { // Abfangen von leerer Eingabe
					oVorname.setValueState(sap.ui.core.ValueState.Error); // Ändert den Status auf "Error"
					oVorname.setValueStateText("Bitte geben Sie einen Vornamen ein.");
					validVorname = false;
				} else if (oVornameValue.search(/^[a-zA-ZäÄöÖüÜ\- ]+$/) === -1) { // Abfangen von Sonderzeichen und Zahlen 
					oVorname.setValueState(sap.ui.core.ValueState.Error); // Ändert den Status auf "Error"
					oVorname.setValueStateText("Der Vorname darf nur Buchstaben enthalten.");
					validVorname = false; // Variable "validVorname" falsch setzen
				} else if (oVornameValue.length > 40) { // Abfangen eines Vornamens mit mehr als 40 Zeichen
					oVorname.setValueState(sap.ui.core.ValueState.Error); // Ändert den Status auf "Error"
					oVorname.setValueStateText("Der Vorname darf max. 40 Zeichen lang sein.");
					validVorname = false; // Variable "validVorname" falsch setzen
				} else {
					oVorname.setValueState(sap.ui.core.ValueState.None); // Ändert den Status auf "None"
					oVornameValue = oVornameValue.trim();
					oVornameValue = oVornameValue[0].toUpperCase() + oVornameValue.substring(1, oVornameValue.length); // Setzt das erste Zeichen als Großbuchstaben
				}

				var oNachname = this.getView().byId("nachname");
				var oNachnameValue = oNachname.getValue();
				var validNachname = true;
				if (oNachnameValue === "") {
					oNachname.setValueState(sap.ui.core.ValueState.Error);
					oNachname.setValueStateText("Bitte geben Sie einen Nachnamen ein.");
					validNachname = false;
				} else if (oNachnameValue.search(/^[a-zA-ZäÄöÖüÜ\- ]+$/) === -1) {
					oNachname.setValueState(sap.ui.core.ValueState.Error);
					oNachname.setValueStateText("Der Nachname darf nur Buchstaben enthalten.");
					validNachname = false;
				} else if (oNachnameValue.length > 40) {
					oNachname.setValueState(sap.ui.core.ValueState.Error);
					oNachname.setValueStateText("Der Nachname darf max. 40 Zeichen lang sein.");
					validNachname = false;
				} else {
					oNachname.setValueState(sap.ui.core.ValueState.None);
					oNachnameValue = oNachnameValue.trim();
					oNachnameValue = oNachnameValue[0].toUpperCase() + oNachnameValue.substring(1, oNachnameValue.length);
				}
		
				var oGeb = this.getView().byId("geburtsdatum");
				var oGebValue = oGeb.getValue();
				var validGeburtsdatum = true;
				if (oGebValue === "") {
					oGeb.setValueState(sap.ui.core.ValueState.Error);
					oGeb.setValueStateText("Bitte geben Sie ein Geburtsdatum ein.");
					validGeburtsdatum = false;
				} else if (oGebValue.substring(6, 10) >= new Date().getFullYear()) {
					oGeb.setValueState(sap.ui.core.ValueState.Error);
					oGeb.setValueStateText("Bitte geben Sie ein gültiges Geburtsdatum ein.");
					validGeburtsdatum = false;
				} else if (oGeb.getValueState() === "Error") { // Falls Funktion handleDateChange den Status gesetzt hat
					oGeb.setValueStateText("Bitte geben Sie ein gültiges Geburtsdatum ein.");
					validGeburtsdatum = false;
				} else {
					if (oGebValue.substring(6, 10) > (new Date().getFullYear()) - 18) { // Prüfung der Jahreszahl
						oGeb.setValueState(sap.ui.core.ValueState.Error);
						oGeb.setValueStateText("Der User muss min. 18 Jahre alt sein.");
						validGeburtsdatum = false;
					} else if (oGebValue.substring(6, 10) === (new Date().getFullYear()) - 18) { // Falls der 18. Geburstag im aktuellen Jahr liegt, wird der Monat geprüft
						if (parseInt(oGebValue.substring(3, 5)) > (new Date().getMonth()) + 1) {
							oGeb.setValueState(sap.ui.core.ValueState.Error);
							oGeb.setValueStateText("Der User muss min. 18 Jahre alt sein.");
							validGeburtsdatum = false;
						} else if (parseInt(oGebValue.substring(3, 5)) === (new Date().getMonth()) + 1) { // Falls der 18. Geburstag im aktuellen Monat liegt, wird der Tag geprüft
							if (parseInt(oGebValue.substring(0, 2)) > new Date().getDate()) {
								oGeb.setValueState(sap.ui.core.ValueState.Error);
								oGeb.setValueStateText("Der User muss min. 18 Jahre alt sein.");
								validGeburtsdatum = false;
							}
						}
					}
				}
				
				var oPw = this.getView().byId("passwort");
				var oPwValue = oPw.getValue();
				var validPasswort = true;
				if (oPwValue.length < 8) {
					oPw.setValueState(sap.ui.core.ValueState.Error);
					oPw.setValueStateText("Das Passwort muss aus min. acht Zeichen bestehen.");
					validPasswort = false;
				} else if (oPwValue.length > 30) {
					oPw.setValueState(sap.ui.core.ValueState.Error);
					oPw.setValueStateText("Das Passwort darf max. 30 Zeichen lang sein.");
					validPasswort = false;
				} else {
					var zahl = false;
					for (var i = 0; i < oPwValue.length; i++) {
						if (!isNaN(oPwValue[i])) {
							zahl = true;
						}
					}
					if (!zahl) {
						oPw.setValueState(sap.ui.core.ValueState.Error);
						oPw.setValueStateText("Das Passwort muss min. eine Zahl enthalten.");
						validPasswort = false;
					} else {
						oPw.setValueState(sap.ui.core.ValueState.None);
					}
				}

				var oBerechtigung = this.getView().byId("berechtigungsstatus");
				var oBerechtigungValue = oBerechtigung.getValue();
				var validBerechtigungsstatus = true;
				if (oBerechtigungValue === "") {
					oBerechtigung.setValueState(sap.ui.core.ValueState.Error);
					oBerechtigung.setValueStateText("Bitte wählen Sie einen Berechtigungsstatus aus.");
					validBerechtigungsstatus = false;
				} else if (oBerechtigungValue !== "Arzt" && oBerechtigungValue !== "Administrator" && oBerechtigungValue !== "Studienpflege") {
					oBerechtigung.setValueState(sap.ui.core.ValueState.Error);
					oBerechtigung.setValueStateText("Bitte wählen Sie einen gültigen Berechtigungsstatus aus.");
					validBerechtigungsstatus = false;
				} else {
					oBerechtigung.setValueState(sap.ui.core.ValueState.None);
				}
				
				// Wenn alle Eingaben korrekt sind, wird der neuer Nutzer in die Datenbank geschrieben
				if (validVorname && validNachname && validGeburtsdatum && validPasswort && validBerechtigungsstatus) {
					$.ajax({
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
									this.oDialog.destroy(); // Zerstören des Dialogs
									this.oDialog.close(); // Schließen des Dialogs
								},
								error: function handleError() {
									MessageBox.error("Die Verbindung ist fehlgeschlagen.");
								}
							});
						},
						error: function handleError() {
							MessageBox.error("Die Verbindung ist fehlgeschlagen.");
						}
					});
				} else {
					MessageBox.error("Bitte überprüfen Sie Ihre Eingaben!");
				}
			},

			// Funktion wird beim Klick auf den Button mit dem roten X im Dialog "benutzerdialog" ausgeführt
			onCancelNeuerUser: function() {
				var pointer = this; // Durch die Variable kann auch in der Funktion der Messagebox auf den Dialog verwiesen werden
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
								pointer.oDialog.destroy(); // Zerstören des Dialogs
								pointer.oDialog.close(); // Schließen des Dialogs
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
				MessageBox.confirm("Möchten Sie den Benutzer " + userId + " wirklich löschen?", {
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function(sResult) {
						if (sResult === "YES") {
							$.ajax({
								url: "php/admin/deleteUser.php",
								data: {
									"userId": userId
								},
								type: "POST",
								context: this,
								success: function handleSuccess(response) {
									if (response === "0") {
										MessageBox.error(
											"Der einzige Administrator kann nicht gelöscht werden. Bitte erstellen Sie erst einen weiteren Administrator, bevor Sie diesen Nutzer löschen."
										);
									} else {
										pointer.loadData();
									}
								},
								error: function handleError() {
									MessageBox.error("Die Verbindung ist fehlgeschlagen.");
								}
							});
						}
					}
				});
			},
			
			// Bevor die Benutzerliste gespeichert wird, werden alle Werte geprüft, wie bei onSaveNeuerUser beschrieben
			onSave: function() {
				var id = new Array(5);
				id[0] = "Vorname-" + this.getView().getId() + "--BenutzerTab-";
				id[1] = "Nachname-" + this.getView().getId() + "--BenutzerTab-";
				id[2] = "Benutzerkennung-" + this.getView().getId() + "--BenutzerTab-";
				id[3] = "Passwort-" + this.getView().getId() + "--BenutzerTab-";
				id[4] = "Benutzerrolle-" + this.getView().getId() + "--BenutzerTab-";
				var userListe = new Array();
				var i = 0;
				
				/** In das zweidimensionale Array "userListe" werden alle Nutzer mit Vor-, Nachname, Benutzerkennung, Passwort und Rolle gespeichert.
				*	Somit kann in der folgenden Schleife jeder Wert geprüft werden, bevor er in die Datenbank geschrieben wird. Die Prüfung ist notwendig,
				*	da der Nutzer Änderungen an den bereits vorhanden Einträgen durchführen kann.
				*/
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
						this.getView().byId("Vorname-" + id).setValueStateText("Bitte geben Sie einen Vornamen ein.");
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
						this.getView().byId("Nachname-" + id).setValueStateText("Bitte geben Sie einen Nachnamen ein.");
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
						this.getView().byId("Benutzerrolle-" + id).setValueStateText("Bitte wählen Sie einen Berechtigungsstatus aus.");
						validBenutzerrolle = false;
					} else if (userListe[i][4] !== "Arzt" && userListe[i][4] !== "Administrator" && userListe[i][4] !== "Studienpflege") {
						this.getView().byId("Benutzerrolle-" + id).setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("Benutzerrolle-" + id).setValueStateText("Bitte wählen Sie einen gültigen Berechtigungsstatus aus.");
						this.getView().byId("Benutzerrolle-" + id).setValue("");
						validBenutzerrolle = false;
					} else {
						this.getView().byId("Benutzerrolle-" + id).setValueState(sap.ui.core.ValueState.None);
					}
				}
				
				// Wenn alle Werte stimmen, wird die Liste in die Datebank gespeichert
				if (validVorname && validNachname && validPasswort && validBenutzerrolle) {
					$.ajax({
						url: "php/admin/updateUser.php",
						data: {
							"userListe": userListe
						},
						type: "POST",
						context: this,
						success: function handleSuccess(response) {
							if (response === "0") {
								MessageBox.error(
									"Die Rolle des einzigen Administrators kann nicht geändert werden. Bitte erstellen Sie erst einen weiteren Administrator, bevor Sie die Rolle dieses Nutzers ändern."
								);
							} else {
								MessageBox.success("Speichern erfolgreich.");
							}
							this.loadData();
						},
						error: function handleError() {
							MessageBox.error("Die Verbindung ist fehlgeschlagen.");
						}
					});
				} else {
					MessageBox.error("Bitte überprüfen Sie Ihre Eingaben!");
				}
			},

			// Funktion wird beim Klick auf den Button "cancel" ausgeführt
			onCancel: function() {
				var pointer = this;
				MessageBox.confirm("Möchten Sie wirklich alle Änderungen verwerfen?", {
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO], 
					onClose: function(sResult) {
						if (sResult === "YES") {
							pointer.loadData();
						}
					}
				});
			},

			// Der Logout muss vorher vom Nutzer bestätigt werden
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