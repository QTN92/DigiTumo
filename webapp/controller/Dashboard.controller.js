sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		"sap/ui/model/json/JSONModel"
	],

	function(Controller, MessageToast, JSONModel) {
		"use strict";

		return Controller.extend("DigiTumo.controller.Dashboard", {

			onInit: function() {
				var patient_vorname = "Amelie";
				var patient_nachname = "Balmann";
				var patient_geburtsdatum = "1992-12-16";
				$.ajax({
					url: "php/getDashboardPatientendaten.php",
					data: {
						"patient_vorname": patient_vorname,
						"patient_nachname": patient_nachname,
						"patient_geburtsdatum": patient_geburtsdatum
					},
					type: "POST",
					context: this,
					success: function handleSuccess(response) {
						var oModel = new JSONModel();
						oModel.setJSON(response);
						this.getView().setModel(oModel);
						alert(response);
					},
					error: function handleError() {
						sap.m.MessageToast.show("Die Verbindung ist fehlgeschlagen.");
					}
				})
			},

			onBack: function() {
				this.getOwnerComponent().getTargets().display("patienten");
			},

			onSave: function() {
				var dialog_vorgehen = new sap.m.Dialog({
					contentWidth: "550px",
					contentHeight: "300px",
					title: "Vorgehen festhalten",
					type: "Message",
					content: [
						new sap.m.Label({
							text: "Datum",
							labelFor: "Datum"
						}),
						new sap.m.DatePicker("Datum"),
						new sap.m.Label({
							text: "Aktion",
							labelFor: "Aktion"
						}),
						new sap.m.ComboBox("Aktion", {
							width: "100%"
						}),
						new sap.m.Label({
							text: "Anmerkungen",
							labelFor: "Anmerkungen"
						}),
						new sap.m.TextArea("Anmerkungen", {
							width: "100%",
							growing: "true"
						})

					],
					beginButton: new sap.m.Button({
						icon: "sap-icon://save",
						type: "Accept",
						press: function() {
							var sText = sap.ui.getCore().byId("Anmerkungen").getValue();
							dialog_vorgehen.close();
						}
					}),
					endButton: new sap.m.Button({
						icon: "sap-icon://sys-cancel",
						type: "Reject",
						press: function() {
							dialog_vorgehen.close();
						}
					}),
					afterClose: function() {
						dialog_vorgehen.destroy();
					}
				});

				dialog_vorgehen.open();
			},

			onLogout: function() {
				this.getOwnerComponent().getTargets().display("login");
			}

		});
	});