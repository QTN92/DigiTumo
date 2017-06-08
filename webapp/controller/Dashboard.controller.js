sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/Fragment"
	],

	function(Controller, MessageBox, JSONModel, Fragment) {
		"use strict";

		return Controller.extend("DigiTumo.controller.Dashboard", {

			onLoad: function(patientenid) {
				// Patientendaten
				// Abfrage von Detailinformationen zum Patienten
				$.ajax({
					url: "php/dashboard/getDashboardPatientendaten.php",
					data: {
						"patientenid": patientenid
					},
					type: "POST",
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
				// Abfrage vom Gesundheitsscore des Patienten
				$.ajax({
					url: "php/dashboard/getGesundheitsscore.php",
					data: {
						"patientenid": patientenid
					},
					type: "POST",
					context: this,
					success: function handleSuccess(response) {
						this.byId("__xmlview3--score").setValue(response);
						// Abhängig vom Score wird dieser entsprechend gefärbt
						if (response <= 3) {
							this.byId("__xmlview3--score").setValueColor("Error");
						} else if (response > 3 && response <= 7) {
							this.byId("__xmlview3--score").setValueColor("Critical");
						} else {
							this.byId("__xmlview3--score").setValueColor("Good");
						};
					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");
					}
				});
			},

			onBack: function() {
				this.getOwnerComponent().getTargets().display("patienten");
			},

			onSaveAction: function(oEvent) {
				var oView = this.getView();
				var oDialog = oView.byId("vorgehendialog");
				// Dialog laden
				if (!oDialog) {
					// Dialog über fragment factory erstellen
					oDialog = sap.ui.xmlfragment(oView.getId(), "DigiTumo.fragment.vorgehen", this);
					oView.addDependent(oDialog);
				}
				oDialog.open();
			},
			
			onClose: function () {
				this.getView().byId("vorgehendialog").close();
			},

			onSave: function() {
				var patientenid = Object.values(Object.values(Object.values(this.getView().getModel().getData())[0])[0])[0];
				var datum = this.byId("__xmlview3--datum").getValue();
//				var vorgehen = this.byId("__xmlview3--vorgehen").getText();
				var vorgehen = "dummy";
				var anmerkungen = this.byId("__xmlview3--anmerkungen").getValue();
				$.ajax({
					url: 'php/dashboard/setWeiteresVorgehen.php',
					data: {
						"patientenid": patientenid,
						"datum": datum,
						"vorgehen": vorgehen,
						"anmerkungen": anmerkungen
					},
					type: "POST",
					context: this,
					success: function handleSuccess(response) {
						MessageBox.success("Das weitere Vorgehen wurde gespeichert.");
						console.log(response);
					},
					error: function handleError() {
						MessageBox.error("Speichern fehlgeschlagen.");
					}
				})
			},

			onStudien: function() {
				this.getOwnerComponent().getTargets().display("studien");
			},

			onLogout: function() {
				this.getOwnerComponent().getTargets().display("login");
			}

		});
	});