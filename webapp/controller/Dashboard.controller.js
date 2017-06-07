sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel"
	],

	function(Controller, MessageBox, JSONModel) {
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
						this.byId("score").setValue(response);
						// Abhängig vom Score wird dieser entsprechend gefärbt
						if(response <= 3) {
							this.byId("score").setValueColor("Error");
						}
						else if(response > 3 && response <= 7) {
							this.byId("score").setValueColor("Critical");
						}
						else {
							this.byId("score").setValueColor("Good");
						}
					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");
					}
				});
				
				// Newsfeed: neue Studien etc.
				$.ajax({
					url: "php/dashboard/getNews.php",
					type: "GET",
					context: this,
					success: function handleSuccess(response) {
						// TODO
					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen");
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
							growing: true
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
