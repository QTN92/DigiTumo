sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel"
	],

	function(Controller, MessageBox, JSONModel) {
		"use strict";

		return Controller.extend("DigiTumo.controller.Dashboard", {
	
			onSaveAction: function(oEvent) {
				var oView = this.getView();
				var oDialog = oView.byId("vorgehendialog");
				// Dialog laden
				if (!oDialog) {
					// Dialog über fragment factory erstellen
					oDialog = sap.ui.xmlfragment(oView.getId(), "DigiTumo.fragment.vorgehen", this);
					var oModel = new JSONModel(jQuery.sap.getModulePath("DigiTumo.model","/vorgehen.json"));
					this.getView().byId("vorgehen").setModel(oModel);
					oView.addDependent(oDialog);
				};
				var datum = new Date();
				var tag = datum.getDate().toString();
				var monat = (datum.getMonth() + 1).toString();
				var jahr = datum.getFullYear().toString();
				if (tag.length == 1) {
					tag = "0" + tag;
				};
				if (monat.length == 1) {
					monat = "0" + monat;
				};
				datum = tag + "." + monat + "." + jahr;
				this.getView().byId("datum").setText(datum);
				oDialog.open();
			},

			onSave: function() {
				var patientId = Object.values(Object.values(Object.values(this.getView().byId("patienteninformation").getModel().getData())[0])[0])[0];
				var vorgehen = this.getView().byId("vorgehen").getSelectedKey();
				var notiz = this.getView().byId("notiz").getValue();
				if(vorgehen == "") {
					MessageBox.error("Bitte eine Entscheidung über das weitere Vorgehen eingeben.");
				}
				else {
					$.ajax({
						url: "php/dashboard/setWeiteresVorgehen.php",
						data: {
							"patientId": patientId,
							"vorgehen": vorgehen,
							"notiz": notiz,
						},
						type: "POST",
						context: this,
						success: function handleSuccess(response) {
							if (response === "fehler") {
								MessageBox.error("Speichern fehlgeschlagen.");
							} else {
								MessageBox.success("Das weitere Vorgehen wurde gespeichert.");
								this.getView().byId("vorgehendialog").close();
								this.getView().byId("vorgehendialog").destroy();
								$.ajax({
									url: "php/dashboard/getWeiteresVorgehen.php",
									data: {
										"patientId": response 
									},
									type: "POST",
									context: this,
									success: function handleSuccess(response) {
										var oModel = new JSONModel();
										oModel.setJSON(response);
										this.getView().byId("vorgehenshistorie").setModel(oModel);
									},
									error: function handleError() {
										MessageBox.error("Die Verbindung ist fehlgeschlagen.");
									}
								})
							};
						},
						error: function handleError() {
							MessageBox.error("Speichern fehlgeschlagen.");
						}
					});
				}
			},

			onClose: function() {
				this.getView().byId("vorgehendialog").close();
				this.getView().byId("vorgehendialog").destroy();
			},

			onStudien: function() {
				this.getOwnerComponent().getTargets().display("studien");
			},

			onBack: function() {
				this.getOwnerComponent().getTargets().display("patienten");
			},

			onLogout: function() {
				$.ajax({
					url: "php/dashboard/clearHilfstabelle.php",
					context: this,
					success: function handleSuccess() {
						this.getOwnerComponent().getTargets().display("login");
						MessageBox.information("Sie haben sich erfolgreich ausgeloggt.");
					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");
					}
				});
			}
		});
	});