//Module CoastalDefense.js

define([
	    "dojo/_base/declare",
		"use!underscore", 	
	    "dojo/json", 
		"use!tv4", 
		"dojo/store/Memory",
		"dojo/store/Observable",
		"dijit/form/ComboBox", 
		"jquery", 
		"jquery_ui",
		"dijit/form/Button",
		"dijit/form/DropDownButton",
		"dijit/form/ComboButton", 
		"dijit/DropDownMenu", 
		"dijit/MenuItem",
		"dijit/Menu",
		"dijit/layout/ContentPane",
		"dijit/layout/TabContainer",
		"dijit/Tooltip",
		"dijit/TooltipDialog",
		"dijit/Dialog",
		"dijit/popup",
		"dojo/on",
		"dojo/_base/array",
		"dojo/query",
		"dojo/_base/lang",
		"dojo/dom",
		"dojo/dom-class",
		"dojo/dom-style",
		"dojo/_base/window",
		"dojo/dom-construct",
		"dojo/dom-geometry",
		"dijit/form/RadioButton",
		"dojo/parser",
		"dijit/form/NumberTextBox",
		"dijit/form/NumberSpinner",
		"dijit/registry",
		"dijit/layout/BorderContainer",
		"dijit/layout/AccordionContainer",
		"dojox/layout/TableContainer",
		"dijit/TitlePane",
		"dijit/form/CheckBox",
		"dijit/form/HorizontalSlider",
		"dojox/form/RangeSlider",
	   	"dojox/charting/Chart",
		"dojox/charting/axis2d/Default",
		"dojox/charting/plot2d/Lines",
		"dojox/charting/plot2d/StackedLines",
		"dojox/charting/plot2d/StackedAreas",
		"dojox/charting/plot2d/Areas",
		"dojox/charting/widget/Legend",
	    "dojox/charting/themes/Claro",
		"dojox/charting/StoreSeries",
		"dojox/charting/plot2d/Grid",
		"dojo/fx/easing",
		"dojo/number",
		"dijit/ProgressBar",
		

		//"esri/request",
		"esri/layers/FeatureLayer",
		"esri/layers/ArcGISDynamicMapServiceLayer"
		], 


	function (declare,
			_, 
			//Ext,
			JSON, 
			tv4, 
			Memory, 
			Observable,
			ComboBox, 
			$, 
			ui,
			Button,
			DropDownButton,
			ComboButton,
			DropDownMenu, 
			MenuItem,
			Menu,
			ContentPane,
			TabContainer,
			Tooltip,
			TooltipDialog,
			Dialog,
			popup,
			on,
			array,
			query,
			lang,
			dom,
			domClass,
			domStyle,
			win,
			domConstruct,
			domGeom,
			RadioButton,
			parser,
			NumberTextBox,
			NumberSpinner,
			registry,
			BorderContainer,
			AccordionContainer,
			TableContainer,
			TitlePane,
			CheckBox,
			HorizontalSlider,
			RangeSlider,
			Chart,
			Default,
			Lines,
			StackedLines,
			StackedAreas,
			Areas,
			Legend,
			theme,
			StoreSeries,
			Grid,
			easing,
			number,
			ProgressBar,
			
			//ESRIRequest,
			FeatureLayer,
			ArcGISDynamicMapServiceLayer
		  ) 
		
		{

		var ecaTool = function(plugin, configFile, interfaceConfigFile){
			this._map = plugin.map;
			this._app = plugin.app;
			this._container = plugin.container;
			
			var self = this;
			this.parameters = {};
			this.pluginDirectory = plugin.pluginDirectory;
			this.utilities = {};
			this.toolUnits = {
				feet: {	
					multiplier: 3.2808,
					unitText: '(ft)',
					unitTextFull: 'Feet',
					conversionFactor: 0.3048
				},
				meters: {	
					multiplier: 1,
					unitText: '(m)',
					unitTextFull: 'Meters',
					conversionFactor: 3.2808
				}
			};
			this.parameters.windowOpen = false;
			
			this.initialize = function(){
				this._data = this.parseConfigData(configFile);
				this.parameters.regionIndex = 0;
				this.parameters.region = this._data[0].location;
				this._interface = JSON.parse(interfaceConfigFile);
				this.parameters.debug = this._interface.debug;				
				this.parameters.layersLoaded = false;
				this.gpFindProfileUrl = this._interface.gpServiceUrl.findProfile;
				this.gpRunWaveModelUrl = this._interface.gpServiceUrl.runWaveModel;
				this.loadInterface(this);
				dojo.connect(dojo.query('#' + this._container.parentNode.parentNode.id + ' .plugin-container-header')[0], 'onmousedown', function() {
					popup.close(self.chooseRegionButtonTooltip);
					popup.close(self.chooseProfileButtonTooltip);
					popup.close(self.chooseHabitatButtonTooltip);
				});
				
			}
			
			this.showIntro = function(){
				var self = this; 
					
			}; //end showIntro
			

		} ;// End cdTool
		return ecaTool;	
		
	} //end anonymous function

); //End define