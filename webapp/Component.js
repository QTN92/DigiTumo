sap.ui.define(["sap/ui/core/UIComponent"], function(UIComponent) {
	"use strict";
	return UIComponent.extend("DigiTumo.Component", {

		metadata: {
			rootView: "DigiTumo.view.Login",
			routing: {
				config: {
					routerClass: "sap.m.routing.Router",
					viewPath: "DigiTumo.view",
					controlId: "loginscreen",
					controlAggregation: "pages",
					viewType: "XML"
				},
				routes: [{
					name: "page1",
					pattern: "",
					target: "page1"
				}, {
					name: "page2",
					pattern: "Page2",
					target: "page2"
				}],
				targets: {
					page1: {
						viewName: "Login",
						viewLevel: 0
					},
					page2: {
						viewName: "Patienten",
						viewLevel: 1
					}
				}
			}
		},

		init: function() {
			UIComponent.prototype.init.apply(this, arguments);

			// Parse the current url and display the targets of the route that matches the hash
			this.getRouter().initialize();
		}

	});
}, /* bExport= */ true);