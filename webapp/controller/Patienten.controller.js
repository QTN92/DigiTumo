sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel"
	],

	function(Controller, MessageBox, JSONModel) {
		"use strict";

		return Controller.extend("DigiTumo.controller.Patienten", {

			onInit: function() {
				this.getView().addEventDelegate({
					onAfterShow: function () {
						sap.ui.getCore().byId("__xmlview2").oController.onAnwesenheitVermerken();
					}
				}),
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
					this.oDialog = sap.ui.xmlfragment(this.getView().getId(), "DigiTumo.fragment.setAnwesenheit", this);
					this.getView().addDependent(oDialog);
				}
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

			onSelectionChange: function() {
				var oList = this.getView().byId("__xmlview2--anwesenheitsliste");
				var anzahlAerzte = oList.mAggregations.items.length;
				for (var i = 0; i < anzahlAerzte; i++) {
					if (oList.mAggregations.items[i].mProperties.selected) {
						this.getView().byId("__xmlview2--AnwSpeichern").setEnabled(true);
						this.getView().byId("__xmlview2--ohneAnwSpeichern").setEnabled(false);
						break;
					} 
					else {
						this.getView().byId("__xmlview2--AnwSpeichern").setEnabled(false);
						this.getView().byId("__xmlview2--ohneAnwSpeichern").setEnabled(true);
					}
				}
			},

			// Methoden für das Vermerken der Anwesenheit
			onAnwesenheitSpeichern: function() {
				var alleAerzte = this.getView().byId("anwesenheitsdialog").getModel().getJSON();
				var anzahlAerzte = (alleAerzte.match(/vorname/g) || []).length;
				var anwesendeAerzte = "";
				var id = "__item2-__xmlview2--anwesenheitsliste-";
				for (var i = 0; i < anzahlAerzte; i++) {
					id = id.substring(0, 38) + i;
					if (sap.ui.getCore().byId(id).getSelected()) {
						if (anwesendeAerzte != "") {
							anwesendeAerzte = anwesendeAerzte + ", ";
						}
						anwesendeAerzte = anwesendeAerzte + sap.ui.getCore().byId(id).getTitle();
					}
				}
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
				var key = this.getView().byId("filter").getValue();
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

			// Daten für das Dashboard des ausgewählten Patienten werden bereits hier geladen.
			// Werden die Daten erst im Dashboard-Controller geladen, kann es sein, dass das 
			// Dashboard angezeigt wird, bevor die Daten geladen worden sind
			onListItemPress: function(oEvent) {
				// Auslesen des ausgewählten Patienten
				var evt = oEvent.getSource().getId().toString();
				var i = evt.length - 1;
				var id = "";
				while (!isNaN(parseInt(evt[i]))) {
					id = evt[i] + id;
					i--;
				}
				id = parseInt(id);
				var patientId = Object.values(Object.values(Object.values(this.getView().getModel().getData())[0])[id])[0];
				// Laden der allgemeinen Patientendaten und des entsprechenden Röntgenbildes
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
				// Laden des aktuellen Gesundheitsscores
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

				
				// Laden des Krankheitsverlaufs inkl. Medikamentationsverlauf
				//Funktion zum Einbinden zusätzlicher Medikamenten
				$.ajax({
					url: "php/dashboard/getMedikamentation.php",
					data: {
						"patientId": patientId
					},
					type: "POST",
					context: this,
					success: function handleSuccess(response) {
						//QUYNH
					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");
					}
				});
				$.ajax({
					url: "php/dashboard/getKrankheitsverlauf.php",
					data: {
						"patientId": patientId
					},
					type: "POST",
					context: this,
					success: function handleSuccess(response) {
						var oVizFrame = sap.ui.getCore().byId("__xmlview3--vizKrankheitsverlauf");
						oVizFrame.setVizProperties({
							dataLabel: {
								visible: true,
								formatString: "u"
							},
							valueAxis: {
								visible: true,
								title: {
									text: "Medikamentendosis in mg",
									visible: true
								}
							},
							valueAxis2: {
								visible: true,
								title: {
									visible: true
								}
							},
							interaction: {
								syncValueAxis: false
							},
							title: {
								visible: false
							}
						});
						var oModel = new JSONModel();
						oModel.setJSON(response);
						oVizFrame.setModel(oModel);
					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");
					}
				});
				// Laden der Röntgenbilder
				$.ajax({
					url: "php/dashboard/getRoentgenbilder.php",
					data: {
						"patientId": patientId
					},
					type: "POST",
					context: this,
					success: function handleSuccess(response) {
						var htmlContent = "<video width='100%' height='100%' autoplay='true' loop='true' <source src='" 
							+ response 
							+ "' type='video/mp4'> Your browser does not support the video tag. </video>";
						sap.ui.getCore().byId("__xmlview3--htmlVideo").setContent(htmlContent);
					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");
					}
				});
				// Laden des bisherigen weiteren Vorgehens
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
				// Feststellen, ob Experten vermerkt wurden (write-Modus) oder nicht (read-only)
				// Davon ist abhängig, ob der Nutzer ein weiteres Vorgehen vermerken kann
				$.ajax({
					url: "php/dashboard/getModus.php",
					type: "POST",
					context: this,
					success: function handleSuccess(response) {
						if(response == "r") {
							sap.ui.getCore().byId("__xmlview3--vorgehenFesthalten").setEnabled(false);
						}
						else if(response == "rw") {
							sap.ui.getCore().byId("__xmlview3--vorgehenFesthalten").setEnabled(true);
						}
					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");
					}
				});
				this.getOwnerComponent().getTargets().display("dashboard");
			},

			onLogout: function() {
				var pointer = this;
				MessageBox.confirm("Möchten Sie sich ausloggen?", {
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function(sResult) {
						if (sResult == "YES") {
							$.ajax({
								url: "php/dashboard/clearHilfstabelle.php",
								context: this
							});
							pointer.getView().byId("filter").setSelectedKey("");
							pointer.onFilter();
							pointer.getOwnerComponent().getTargets().display("login");
						}
					}
				});
			}
		});
	});