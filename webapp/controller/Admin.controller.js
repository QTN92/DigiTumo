sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel"
	],

	function(Controller, MessageBox, JSONModel) {
		"use strict";

		return Controller.extend("DigiTumo.controller.Admin", {

			loadData: function() {
				$.ajax({
					url: "php/admin/getUser.php",
					type: "GET",
					context: this,
					success: function handleSuccess(response) {
						var oModel = new JSONModel();
						oModel.setJSON(response);
						this.getView().setModel(oModel);
					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");
					}
				});
			},
			
			onInit: function() {
				this.loadData();
				sap.ui.getCore().attachParseError(
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

			onAddUser: function() {
				var oDialog = this.getView().byId("benutzerdialog");
				if (!oDialog) {
					this.oDialog = sap.ui.xmlfragment(this.getView().getId(), "DigiTumo.fragment.addBenutzer", this);
					this.getView().addDependent(oDialog);
				};
				this.oDialog.open();
			},

			handleDateChange: function(oEvent) {
				var valid = oEvent.getParameter("valid");
				if (!valid) {
					this.byId("__xmlview2--geburtsdatum").setValueState(sap.ui.core.ValueState.Error);
					this.byId("__xmlview2--geburtsdatum").setShowValueStateMessage(false);
				}
				else {
					this.byId("__xmlview2--geburtsdatum").setValueState(sap.ui.core.ValueState.None);
				};
			},
			
			onUserSave: function() {
				var vorname = this.byId("__xmlview2--vorname").getValue();
				var validVorname = false;
				if(vorname == "") {
					this.byId("__xmlview2--vorname").setValueState(sap.ui.core.ValueState.Error);
					this.byId("__xmlview2--vorname").setShowValueStateMessage(false);
					MessageBox.error("Bitte einen Vornamen eingeben.");
				}
				else {
					if(vorname.search(/^[a-zA-Z ]+$/) == -1) {
						this.byId("__xmlview2--vorname").setValueState(sap.ui.core.ValueState.Error);
						this.byId("__xmlview2--vorname").setShowValueStateMessage(false);
						MessageBox.error("Der Vorname darf nur Buchstaben enthalten.");
						this.byId("__xmlview2--vorname").setValue("");
					}
					else {
						this.byId("__xmlview2--vorname").setValueState(sap.ui.core.ValueState.None);
						vorname = vorname.trim();
						vorname = vorname[0].toUpperCase() + vorname.substring(1, vorname.length);
						validVorname = true;
					};
				};
				if(validVorname) {
					var nachname = this.getView().byId("__xmlview2--nachname").getValue();
					var validNachname = false;
					if(nachname == "") {
						this.byId("__xmlview2--nachname").setValueState(sap.ui.core.ValueState.Error);
						this.byId("__xmlview2--nachname").setShowValueStateMessage(false);
						MessageBox.error("Bitte einen Nachnamen eingeben.");
					}
					else {
						if(nachname.search(/^[a-zA-Z ]+$/) == -1) {
							this.byId("__xmlview2--nachname").setValueState(sap.ui.core.ValueState.Error);
							this.byId("__xmlview2--nachname").setShowValueStateMessage(false);
							MessageBox.error("Der Nachname darf nur Buchstaben enthalten.");
							this.byId("__xmlview2--nachname").setValue("");
						}
						else {
							this.byId("__xmlview2--nachname").setValueState(sap.ui.core.ValueState.None);
							nachname = nachname.trim();
							nachname = nachname[0].toUpperCase() + nachname.substring(1, nachname.length);
							validNachname = true;
						};
					};
				};
				if(validVorname && validNachname) {
					var geburtsdatum = this.getView().byId("__xmlview2--geburtsdatum").getValue();
					var validGeburtsdatum = false;
					if(geburtsdatum == "") {
						this.getView().byId("__xmlview2--geburtsdatum").setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("__xmlview2--geburtsdatum").setShowValueStateMessage(false);
						MessageBox.error("Bitte ein Geburtsdatum eingeben.");
					}
					else {
						if(this.getView().byId("__xmlview2--geburtsdatum").getValueState() == "None") {
							validGeburtsdatum = true;
						};
					};
				};
				if(validVorname && validNachname && validGeburtsdatum) {
					var passwort = this.getView().byId("__xmlview2--passwort").getValue();
					var validPasswort = false;
					if(passwort.length < 8) {
						this.byId("__xmlview2--passwort").setValueState(sap.ui.core.ValueState.Error);
						this.byId("__xmlview2--passwort").setShowValueStateMessage(false);
						MessageBox.error("Das Passwort muss aus min. acht Zeichen bestehen.");
					} 
					else {
						var zahl = false;
						for(var i = 0; i < passwort.length; i++) {
							if(!isNaN(passwort[i])) {
								zahl = true;
							};
						};
						if(!zahl) {
							this.byId("__xmlview2--passwort").setValueState(sap.ui.core.ValueState.Error);
							this.byId("__xmlview2--passwort").setShowValueStateMessage(false);
							MessageBox.error("Das Passwort muss min. eine Zahl enthalten.");
						}
						else {
							this.byId("__xmlview2--passwort").setValueState(sap.ui.core.ValueState.None);
							validPasswort = true;
						};
					};
				};
				if(validVorname && validNachname && validGeburtsdatum && validPasswort) {
					var berechtigungsstatus = this.getView().byId("__xmlview2--berechtigungsstatus").getValue();
					var validBerechtigungsstatus = false;
					if(berechtigungsstatus == "") {
						this.getView().byId("__xmlview2--berechtigungsstatus").setValueState(sap.ui.core.ValueState.Error);
						this.byId("__xmlview2--berechtigungsstatus").setShowValueStateMessage(false);
						MessageBox.error("Bitte einen Berechtigungsstatus auswählen.");
					}
					else if(berechtigungsstatus !== "Arzt" && berechtigungsstatus !== "Administrator" && berechtigungsstatus !== "Newspflege") {
						this.getView().byId("__xmlview2--berechtigungsstatus").setValueState(sap.ui.core.ValueState.Error);
						this.byId("__xmlview2--berechtigungsstatus").setShowValueStateMessage(false);
						MessageBox.error("Bitte einen gültigen Berechtigungsstatus auswählen.");
					}
					else {
						this.getView().byId("__xmlview2--berechtigungsstatus").setValueState(sap.ui.core.ValueState.None);
						validBerechtigungsstatus = true;
					}
				};
				
				if(validVorname && validNachname && validGeburtsdatum && validPasswort && validBerechtigungsstatus) {
					$.ajax({
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
									MessageBox.error("Die Verbindung ist fehlgeschlagen.");
								}
							});
						},
						error: function handleError() {
							MessageBox.error("Die Verbindung ist fehlgeschlagen.");
						}
					});
				};
			},

			onClose: function() {
				this.oDialog.destroy();
				this.oDialog.close();
			},

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
				$.ajax({
					url: "php/admin/updateUser.php",
					data: {
						"userListe": userListe
					},
					type: "POST",
					context: this,
					success: function handleSuccess() {
						MessageBox.success("Speichern erfolgreich.");
					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");
					}
				});
			},

			onCancel: function() {
				var pointer = this;
				MessageBox.confirm("Möchten Sie wirklich alle Änderungen verwerfen?", {
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function(sResult) {
						if(sResult == "YES") {
							pointer.loadData();
						};
					}
				});
			},

			onDeleteUser: function(oEvent) {
				var tmp = Object.values(oEvent.getParameters())[0];
				var id = tmp.substring(47, tmp.length);
				var userId = Object.values(Object.values(Object.values(this.getView().getModel().getData())[0])[id])[3];
				var pointer = this;
				MessageBox.confirm("Möchten Sie den Benutzer " + userId + " wirklich löschen?", {
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function(sResult) {
						if(sResult == "YES") {
							$.ajax({
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
									MessageBox.error("Die Verbindung ist fehlgeschlagen.");
								}
							})
						};
					}
				});
			},

			onLogout: function() {
				this.getOwnerComponent().getTargets().display("login");
			}
		});
	});