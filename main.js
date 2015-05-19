
// Plugins should load their own versions of any libraries used even if those libraries are also used 
// by the GeositeFramework, in case a future framework version uses a different library version. 

require({
    // Specify library locations.
    // The calls to location.pathname.replace() below prepend the app's root path to the specified library location. 
    // Otherwise, since Dojo is loaded from a CDN, it will prepend the CDN server path and fail, as described in
    // https://dojotoolkit.org/documentation/tutorials/1.7/cdn
    packages: [
        {
            name: "d3",
            location: "//d3js.org",
            main: "d3.v3.min"
        },
        {
            name: "underscore",
            location: "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4",
            main: "underscore-min"
        }
    ]
});

define([
		"dojo/_base/declare",
		"framework/PluginBase",
		"dojo/parser",
		"dijit/registry",
		"dojo/dom-class",
		"dojo/dom-style",
		"dojo/_base/lang",
		"dojo/query",
		 "d3",
		"use!underscore",
		"./app",
		"dojo/text!plugins/eca/eca_data.json",
		"dojo/text!plugins/eca/eca_interface.json",
		"dojo/text!./templates.html"
       ],
       function (declare, PluginBase, parser, registry, domClass, domStyle, lang, query, d3, _, eca, appData, ecaConfig, templates) {
           return declare(PluginBase, {
               toolbarName: "Economics of Climate Adaptation",
               toolbarType: "sidebar",
               resizable: false,
               showServiceLayersInLegend: true,
               allowIdentifyWhenActive: true,
               infoGraphic: "",
               pluginDirectory: "plugins/eca",
               width: 425,
               height: 650,
               
               activate: function () {
					this.ecaTool.showTool();
					tool = this.ecaTool;
               },
               
               deactivate: function () { 
                   this.ecaTool.hideTool();
               },
               
               hibernate: function () {
				   this.ecaTool.hideTool();                         
               },
               
               initialize: function (frameworkParameters) {
				   declare.safeMixin(this, frameworkParameters); 
                   var djConfig = {
                       parseOnLoad: true
                   };
                   domClass.add(this.container, "claro");
                   this.ecaTool = new eca(this, appData, ecaConfig, templates);
                   this.ecaTool.initialize(this.ecaTool);
               },
                   
               getState: function () {
                   
                  // return state
                   
                },
                
               setState: function (state) { 
                    
                    //this.ecaTool.parameters = state;
                    
               },
               
               identify: function(){
               
               }
           });
       });
