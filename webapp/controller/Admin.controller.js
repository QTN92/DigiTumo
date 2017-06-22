sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel"
	],

	function(Controller, MessageBox, JSONModel) {
		"use strict";

		return Controller.extend("DigiTumo.controller.Admin", {

			onInit: function() {
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

			onAddUser: function() {
				var oDialog = this.getView().byId("benutzerdialog");
				if (!oDialog) {
					this.oDialog = sap.ui.xmlfragment(this.getView().getId(), "DigiTumo.fragment.addStudie", this);
					this.getView().addDependent(oDialog);
				};
				this.oDialog.open();
			},

			onUserSave: function() {
				var vorname = this.byId("__xmlview2--vorname").getValue();
				var nachname = this.getView().byId("__xmlview2--nachname").getValue();
				var geburtsdatum = this.getView().byId("__xmlview2--geburtsdatum").getValue();
				var passwort = this.getView().byId("__xmlview2--passwort").getValue();
				var berechtigungsstatus = this.getView().byId("__xmlview2--berechtigungsstatus").getText();
				$.ajax({
					url: "php/admin/setNewUser.php",
					data: {
						"vorname": vorname,
						"nachname": nachname,
						"geburtsdatum": geburtsdatum,
						"passwort": passwort,
						"berechtigungsstatus": berechtigungsstatus
					},
					type: "POST",
					context: this,
					success: function handleSuccess() {

					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");
					}
				});
				this.oDialog.destroy();
				this.oDialog.close();
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
					userListe[i] = new Array(8);
					for (var j = 0; j < 8; j++) {
						userListe[i][j] = Object.values(Object.values(tmpObject)[i])[j];
					}
					i++;
				}
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

			onDeleteUser: function() {

			},

			onLogout: function() {
				this.getOwnerComponent().getTargets().display("login");
			}
		});
	});