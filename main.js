
// Plugins should load their own versions of any libraries used even if those libraries are also used 
// by the GeositeFramework, in case a future framework version uses a different library version. 

require({
    // Specify library locations.
    // The calls to location.pathname.replace() below prepend the app's root path to the specified library location. 
    // Otherwise, since Dojo is loaded from a CDN, it will prepend the CDN server path and fail, as described in
    // https://dojotoolkit.org/documentation/tutorials/1.7/cdn
    packages: [
        {
            name: "jquery",
            location: "//ajax.googleapis.com/ajax/libs/jquery/1.9.0",
            main: "jquery.min"
        },
        {
            name: "underscore",
            location: "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4",
            main: "underscore-min"
        },
            //         {
            //             name: "extjs",
            // location: location.pathname.replace(/\/[^/]+$/, "") + "plugins/coastal_defense/lib/ext-4.2.1-gpl",
            //             main: "ext-all"
            //         },
        {
            name: "tv4",
            location: location.pathname.replace(/\/[^/]+$/, "") + "plugins/coastal_defense/lib",
            main: "tv4.min"
        },
        {
            name: "jquery_ui",
            location: "//ajax.googleapis.com/ajax/libs/jqueryui/1.10.1",
            main: "jquery-ui.min"
        }
        
        

    ]
});





define([
        "dojo/_base/declare",
        "framework/PluginBase",
        "jquery",
        "dojo/parser",
        "dijit/registry",
        "dojo/dom-class",
        "dojo/dom-style",
        "dojo/_base/lang",
        "dojo/query",
        "use!underscore", 
        "./app"
       ],
       function (declare, PluginBase, $, parser, registry, domClass, domStyle, lang, query, _, eca) {
           return declare(PluginBase, {
               toolbarName: "ECA Tool",
               toolbarType: "sidebar",
               resizable: false,
               showServiceLayersInLegend: true,
               allowIdentifyWhenActive: false,
               infoGraphic: "",
               pluginDirectory: "plugins/eca",
               width: 625,
               height: 625,
               
               
               activate: function () {
                    self = this;
                    var showInfoGraphic = localStorage.getItem(this.toolbarName + " showinfographic");
                    if (( showInfoGraphic === "true") || (showInfoGraphic == null)) {
                       var pluginId = this.container.parentNode.parentNode.id;
                       var introPanelButton = dojo.query("#" + pluginId + " .plugin-infographic  [widgetid*='Button']")[0];
                       dojo.connect(introPanelButton, "onclick", function() {
                            self.ecaTool.showTool(self.ecaTool);
                       });
                    } else {
                        this.ecaTool.showTool(this.ecaTool);
                    }
                    //t = this.ecaTool
               },
               
               deactivate: function () { 
               
               },
               
               hibernate: function () {
                         
               },
               
               initialize: function (frameworkParameters) {
                   declare.safeMixin(this, frameworkParameters); 
                   var djConfig = {
                       parseOnLoad: true
                   };
                   self = this;
                   domClass.add(this.container, "claro");
                   this.ecaTool = new eca(this);
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
