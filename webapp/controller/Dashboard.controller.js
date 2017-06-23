sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel"
	],

	function(Controller, MessageBox, JSONModel) {
		"use strict";

		return Controller.extend("DigiTumo.controller.Dashboard", {

			onAfterRendering: function() {
				var oModel = new sap.ui.model.json.JSONModel({
					krankheitsverlauf: [{
						"Monat": "Januar",
						"Gesundheitsscore": 5,
						"Medikamentendosis": 504
					}, {
						"Monat": "Februar",
						"Gesundheitsscore": 3,
						"Medikamentendosis": 100
					}, {
						"Monat": "Maerz",
						"Gesundheitsscore": 6,
						"Medikamentendosis": 350
					}, {
						"Monat": "April",
						"Gesundheitsscore": 5,
						"Medikamentendosis": 504
					}, {
						"Monat": "Mai",
						"Gesundheitsscore": 7,
						"Medikamentendosis": 420
					}, {
						"Monat": "Juni",
						"Gesundheitsscore": 5,
						"Medikamentendosis": 400
					}, {
						"Monat": "Juli",
						"Gesundheitsscore": 5,
						"Medikamentendosis": 400
					}, {
						"Monat": "August",
						"Gesundheitsscore": 8,
						"Medikamentendosis": 350
					}, {
						"Monat": "September",
						"Gesundheitsscore": 7,
						"Medikamentendosis": 350
					}]
				});
				this.getView().setModel(oModel);

				var oVizFrame = this.getView().byId("vizKrankheitsverlauf");

				oVizFrame.setVizProperties({
					plotArea: {
						dataShape: {
							primaryAxis: ["line", "bar", "bar"],
							secondaryAxis: ["line", "bar", "bar", "bar"]
						},
						dataLabel: {
							visible: true,
							formatString: "u"
						}
					},
					valueAxis: {
						label: {
							formatString: "u"
						}
					},
					title: {
						visible: false
					}
				});
				oVizFrame.setModel(oModel);
			},

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
						this.getView().byId("score").setValue(response);
						// Abhängig vom Score wird dieser entsprechend gefärbt
						if (response <= 3) {
							this.getView().byId("score").setValueColor("Error");
						} else if (response > 3 && response <= 7) {
							this.getView().byId("score").setValueColor("Critical");
						} else {
							this.getView().byId("score").setValueColor("Good");
						}
					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");
					}
				});
			},

			onSaveAction: function(oEvent) {
				var oView = this.getView();
				var oDialog = oView.byId("vorgehendialog");
				// Dialog laden
				if (!oDialog) {
					// Dialog über fragment factory erstellen
					oDialog = sap.ui.xmlfragment(oView.getId(), "DigiTumo.fragment.vorgehen", this);
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
				var patientenid = Object.values(Object.values(Object.values(this.getView().getModel().getData())[0])[0])[0];
				var datum = this.getView().byId("datum").getText();
				var vorgehen = this.getView().byId("vorgehen").getText();
				var notiz = this.getView().byId("notiz").getValue();
				var anwesendeExperten = "";
				$.ajax({
					url: "php/dashboard/setWeiteresVorgehen.php",
					data: {
						"patientenid": patientenid,
						"vorgehen": vorgehen,
						"notiz": notiz,
						"anwesendeExperten": anwesendeExperten
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

						};
					},
					error: function handleError() {
						MessageBox.error("Speichern fehlgeschlagen.");
					}
				});
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
					url: "php/clearHilfstabelle.php",
					context: this,
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");
					}
				});
				this.getOwnerComponent().getTargets().display("login");
			}
		});
	});