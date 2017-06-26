sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel"
	],

	function(Controller, MessageBox, JSONModel) {
		"use strict";

		return Controller.extend("DigiTumo.controller.Patienten", {
			
			onInit: function() {
				// Binding der Patienten- und Krankenakteninformationen
				$.ajax({
					url: "php/patienten/getPatienten.php",
					type: "GET",
					context: this,
					success: function handleSuccess(response) {
						var oModel = new JSONModel();
						oModel.setJSON(response);
						this.getView().setModel(oModel);
						this.onAnwesenheitVermerken();
					},
					error: function handleError() {
						sap.m.MessageBox.error("Die Verbindung ist fehlgeschlagen.");
					}
				});
				$.ajax({
					url: "php/patienten/getFilter.php",
					type: "GET",
					context: this,
					success: function handleSuccess(response) {
						var oModel = new JSONModel();
						oModel.setJSON(response);
						this.getView().byId("filter").setModel(oModel);
					}
				});
			},

			onAnwesenheitVermerken: function() {
				// Dialog für Vermerken der Anwesenheit
				var oDialog = this.getView().byId("anwesenheitsdialog");
				if (!oDialog) {
					this.oDialog = sap.ui.xmlfragment(this.getView().getId(), "DigiTumo.fragment.anwesenheit", this);
					this.getView().addDependent(oDialog);
				};
				$.ajax({
					url: "php/patienten/getExperten.php",
					type: "GET",
					context: this,
					success: function handleSuccess(response) {
						var oModel = new JSONModel();
						oModel.setJSON(response);
						this.getView().byId("anwesenheitsdialog").setModel(oModel);
					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");
					}
				});
				this.oDialog.open();
			},

			// Methoden für das Vermerken der Anwesenheit
			onAnwesenheitSpeichern: function() {
				var alleAerzte = this.getView().byId("anwesenheitsdialog").getModel().getJSON();
				var anzahlAerzte = (alleAerzte.match(/vorname/g) || []).length;
				var anwesendeAerzte = "";
				var id = "__item2-__xmlview2--anwesenheitsliste-";
				for (var i = 0; i < anzahlAerzte; i++) {
					id = id.substring(0, 38) + i;
					if(sap.ui.getCore().byId(id).getSelected()) {
						if(anwesendeAerzte != "") {
							anwesendeAerzte = anwesendeAerzte + ", ";
						}
						anwesendeAerzte = anwesendeAerzte + sap.ui.getCore().byId(id).getTitle();
					};
				};
				$.ajax({
					url: "php/patienten/setExperten.php",
					data: {
						"anwesendeAerzte": anwesendeAerzte
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
				this.oDialog.close();
				this.oDialog.destroy();
				this.getOwnerComponent().getTargets().display("patienten");
			},

			onAnwesenheitNichtSpeichern: function() {
				this.oDialog.close();
				this.oDialog.destroy();
			},

			onFilter: function() {
				var key = this.getView().byId("filter").getSelectedKey();
				if (key != "") {
					$.ajax({
						url: "php/patienten/getFilterGesetzt.php",
						data: {
							"key": key
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
				} else {
					$.ajax({
						url: "php/patienten/getPatienten.php",
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
				}
			},

			// Logik für den Patientenview
			onListItemPress: function(oEvent) {
				var evt = oEvent.getSource().getId().toString();
				var i = evt.length - 1;
				var id = "";
				while (!isNaN(parseInt(evt[i]))) {
					id = evt[i] + id;
					i--;
				};
				id = parseInt(id);
				var patientId = Object.values(Object.values(Object.values(this.getView().getModel().getData())[0])[id])[0];
				this.getOwnerComponent().getTargets().display("dashboard");
				$.ajax({
					url: "php/dashboard/getPatientendaten.php",
					data: {
						"patientId": patientId
					},
					type: "POST",
					context: this,
					success: function handleSuccess(response) {
						var oModel = new JSONModel();
						oModel.setJSON(response);
						sap.ui.getCore().byId("__xmlview3--patienteninformation").setModel(oModel);
					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");
					}
				});
				$.ajax({
					url: "php/dashboard/getGesundheitsscore.php",
					data: {
						"patientId": patientId
					},
					type: "POST",
					context: this,
					success: function handleSuccess(response) {
						sap.ui.getCore().byId("__xmlview3--score").setValue(response);
						// Abhängig vom Score wird dieser entsprechend gefärbt
						if (response <= 3) {
							sap.ui.getCore().byId("__xmlview3--score").setValueColor("Error");
						} else if (response > 3 && response <= 7) {
							sap.ui.getCore().byId("__xmlview3--score").setValueColor("Critical");
						} else {
							sap.ui.getCore().byId("__xmlview3--score").setValueColor("Good");
						}
					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");
					}
				});
				$.ajax({
					url: "php/dashboard/getWeiteresVorgehen.php",
					data: {
						"patientId": patientId
					},
					type: "POST",
					context: this,
					success: function handleSuccess(response) {
						var oModel = new JSONModel();
						oModel.setJSON(response);
						sap.ui.getCore().byId("__xmlview3--vorgehenshistorie").setModel(oModel);
					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");
					}
				});
				this.getOwnerComponent().getTargets().display("dashboard");
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
			},

			// TEST-BUTTON
			onPress: function() {
				this.getOwnerComponent().getTargets().display("dashboard");
			},
			onDashboard: function() {
				this.getOwnerComponent().getTargets().display("dashboard");
			}
		});
	});