sap.ui.define(["sap/ui/core/UIComponent"], function(UIComponent) {
	"use strict";
	return UIComponent.extend("DigiTumo.Component", {

		metadata: {
			rootView: "DigiTumo.view.App",
			routing: {
				config: {
					targetsClass: "sap.m.routing.Targets",
					viewPath: "DigiTumo.view",
					controlId: "rootControl",
					controlAggregation: "pages",
					viewType: "XML"
				},
				targets: {
					login: {
						viewName: "Login",
						viewLevel: 0
					},

					patienten: {
						viewName: "Patienten",
						viewLevel: 1
					}
				}
			}
		},

		init: function() {
			UIComponent.prototype.init.apply(this, arguments);

			// Parse the current url and display the targets of the route that matches the hash
			this.getTargets().display("login");
		}

	});
}, /* bExport= */ true);