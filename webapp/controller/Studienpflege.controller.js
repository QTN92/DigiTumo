sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel"
	],

	function(Controller, MessageBox, JSONModel) {
		"use strict";

		return Controller.extend("DigiTumo.controller.Studienpflege", {

			loadData: function() {
				$.ajax({
					url: "php/studienpflege/getStudien.php",
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
			},

			onAddStudie: function() {
				var oDialog = this.getView().byId("studiendialog");
				if (!oDialog) {
					this.oDialog = sap.ui.xmlfragment(this.getView().getId(), "DigiTumo.fragment.addStudie", this);
					this.getView().addDependent(oDialog);
				}
				this.oDialog.open();
			},
			
			onSaveNeueStudie: function() {
				var vorname = this.getView().byId("vorname").getValue();
				var validVorname = true;																					
				if(vorname == "") {																					
					this.getView().byId("vorname").setValueState(sap.ui.core.ValueState.Error);								
					this.getView().byId("vorname").setValueStateText("Bitte einen Vornamen eingeben.");														
					validVorname = false;
				}
				else {
					if(vorname.search(/^[a-zA-Z ]+$/) == -1) {																
						this.getView().byId("vorname").setValueState(sap.ui.core.ValueState.Error);					
						this.getView().byId("vorname").setValueStateText("Der Vorname darf nur Buchstaben enthalten. Umlaute sind nicht zulässig.");		
						this.getView().byId("Vorname").setValue("");													
						validVorname = false;
					}
					else {
						this.getView().byId("vorname").setValueState(sap.ui.core.ValueState.None);							
						vorname = vorname.trim();
						vorname = vorname[0].toUpperCase() + vorname.substring(1, vorname.length);
					};
				};

				var nachname = this.getView().byId("nachname").getValue();												
				var validNachname = true;																				
				if(nachname == "") {																					
					this.getView().byId("nachname").setValueState(sap.ui.core.ValueState.Error);						
					this.getView().byId("nachname").setValueStateText("Bitte einen Nachnamen eingeben.");												
					validNachname = false;
				}
				else {
					if(nachname.search(/^[a-zA-Z ]+$/) == -1) {														
						this.getView().byId("nachname").setValueState(sap.ui.core.ValueState.Error);					
						this.getView().byId("nachname").setValueStateText("Der Nachname darf nur Buchstaben enthalten. Umlaute sind nicht zulässig.");					
						validNachname = false;
					}
					else {
						this.getView().byId("nachname").setValueState(sap.ui.core.ValueState.None);						
						nachname = nachname.trim();
						nachname = nachname[0].toUpperCase() + nachname.substring(1, nachname.length);
					};
				};
				
				var titel = this.getView().byId("titel").getValue();
				var validTitel = true;
				if(titel == "") {
					this.getView().byId("titel").setValueState(sap.ui.core.ValueState.Error);					
					this.getView().byId("titel").setValueStateText("Bitte einen Titel eingeben.");
					validTitel = false;
				}
				else {
					this.getView().byId("titel").setValueState(sap.ui.core.ValueState.None);
				};

				var validJahr = true;
				var jahr = this.getView().byId("jahr").getValue();		
				if(jahr == "") {
					this.getView().byId("jahr").setValueState(sap.ui.core.ValueState.Error);					
					this.getView().byId("jahr").setValueStateText("Bitte ein Jahr eingeben.");
					validJahr = false;
				}
				else if(jahr.search(/^[0-9]+$/) == -1) {
					this.getView().byId("jahr").setValueState(sap.ui.core.ValueState.Error);					
					this.getView().byId("jahr").setValueStateText("Bitte ein gültiges Jahr eingeben.");
					validJahr = false;
				}
				else if(parseInt(jahr) > new Date().getFullYear()){
					this.getView().byId("jahr").setValueState(sap.ui.core.ValueState.Error);					
					this.getView().byId("jahr").setValueStateText("Bitte ein gültiges Jahr eingeben.");
					validJahr = false;
				}
				else {
					this.getView().byId("jahr").setValueState(sap.ui.core.ValueState.None);
				};
								
				var medium = this.getView().byId("medium").getValue();
				var validMedium = true;
				if(medium == "") {
					this.getView().byId("medium").setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId("medium").setValueStateText("Bitte ein Medium eingeben.");
					validMedium = false;
				}
				else {
					this.getView().byId("medium").setValueState(sap.ui.core.ValueState.None);
				};
				
				var abstract = this.getView().byId("abstract").getValue();
				var validAbstract = true;
				if(abstract == "") {
					this.getView().byId("abstract").setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId("abstract").setValueStateText("Bitte einen Abstract eingeben.");
					validAbstract = false;
				}
				else {
					this.getView().byId("abstract").setValueState(sap.ui.core.ValueState.None);
				};
				
				var verweis = this.getView().byId("verweis").getValue();
				var validVerweis = true;
				if(verweis == "") {
					this.getView().byId("verweis").setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId("verweis").setValueStateText("Bitte einen Verweis zum Original eingeben.");
					validVerweis = false;
				}
				else {
					this.getView().byId("verweis").setValueState(sap.ui.core.ValueState.None);
				};
				
				if(validVorname && validNachname && validTitel && validMedium && validAbstract && validVerweis) {
					$.ajax({
						url: "php/studien/setNeueStudie.php",
						data: {
							"vorname": vorname,
							"nachname": nachname,
							"titel": titel,
							"jahr": jahr,
							"medium": medium,
							"abstract": abstract,
							"verweis": verweis
						},
						type: "POST",
						context: this,
						success: function handleSuccess() {
							this.loadData();
						},
						error: function handleError() {
							MessageBox.error("Die Verbindung ist fehlgeschlagen.");
						}
					});
					this.oDialog.destroy();
					this.oDialog.close();
				}
				else {
					MessageBox.error("Bitte die Eingaben überprüfen!");		
				};
			},
			
			onCancelNeueStudie: function() {
				var pointer = this;
				if(
					this.getView().byId("vorname").getValue() != "" ||
					this.getView().byId("nachname").getValue() != "" ||
					this.getView().byId("titel").getValue() != "" ||
					this.getView().byId("jahr").getValue() != "" ||
					this.getView().byId("medium").getValue() != "" ||
					this.getView().byId("abstract").getValue() != "" ||
					this.getView().byId("verweis").getValue() != ""
				) {
					MessageBox.confirm("Möchten Sie wirklich alle Änderungen verwerfen?", {										
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],										
						onClose: function(sResult) {
							if(sResult == "YES") {																				
								pointer.oDialog.destroy();
								pointer.oDialog.close();
							};
						}
					});
				}
				else {
					this.oDialog.destroy();
					this.oDialog.close();
				}; 
			},
			
			onDeleteStudie: function(oEvent) {
				var pointer = this;
				var tmp = Object.values(oEvent.getParameters()).toString();
				var id = parseInt(tmp.substring(48, tmp.length));
				var tmp = Object.values(Object.values(this.getView().getModel().getData())[0])[id];
				MessageBox.confirm("Möchten Sie diesen Artikel wirklich löschen?", {							
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],									
					onClose: function(sResult) {
						if(sResult == "YES") {		
							$.ajax({																					
								url: "php/studien/deleteStudie.php",
								data: {
									"vorname": Object.values(tmp)[1],
									"nachname": Object.values(tmp)[0],
									"titel": Object.values(tmp)[2],
									"jahr": Object.values(tmp)[3]
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

			onSave: function() {
				
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

			onLogout: function() {		
				var pointer = this;
				MessageBox.confirm("Möchten Sie sich wirklich abmelden? Nicht gespeicherte Änderungen gehen verloren.", {
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function(sResult) {
						if(sResult == "YES") {
							pointer.getOwnerComponent().getTargets().display("login");							
						}
					}
				});
			},
			
		});
	});