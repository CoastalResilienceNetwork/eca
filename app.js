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
		"dijit/form/HorizontalRuleLabels",
		"dojox/form/RangeSlider",
	   	"dojox/charting/Chart",
		"dojox/charting/axis2d/Default",
		"dojox/charting/plot2d/Lines",
		"dojox/charting/plot2d/Columns",
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
		"esri/request",
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
			HorizontalRuleLabels,
			RangeSlider,
			Chart,
			Default,
			Lines,
			Columns,
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
			ESRIRequest,
			FeatureLayer,
			DynamicMapServiceLayer
		  ) 
		
		{

		var ecaTool = function(plugin){
			this._map = plugin.map;
			this._app = plugin.app;
			this._container = plugin.container;
			
			var self = this;
			this.parameters = {};
			this.chartData = [];
			this.chart = null
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
				//this._data = this.parseConfigData(configFile);
				this.parameters.regionIndex = 0;
				//this.parameters.region = this._data[0].location;
				//this._interface = JSON.parse(interfaceConfigFile);
				//this.parameters.debug = this._interface.debug;				
				this.parameters.layersLoaded = false;
				this.loadInterface(this);
				
			}

			this.showTool = function(){
				this.initializeMap();
				on(this.mapLayer, 'load', function(){ self.getInputValues();});

			} //end this.showTool

			this.hideTool = function(){
				this._map.removeLayer(this.mapLayer);

			} //end this.hideTool
			
			this.showIntro = function(){
				var self = this; 
					
			}; //end showIntro

			this.loadInterface = function() {
				var self = this;
				domStyle.set(this._container, "overflow", "hidden");				
				this.tc = new TabContainer({
						isLayoutContainer: true,
						style: "height: 100%; width: 100%;",
						resize: function(){
					},
						useMenu: false,
						useSlider: false,
				    }, "tc1-prog");
					domClass.add(this.tc.domNode, "claro");
				this.tc.startup();
				this.tc.resize();

				//HELP PANE
				this.tabHelp = new ContentPane({
			         title: "Overview",
					 style: "position:relative;width:625px;height:553px;overflow:hidden;",
					 isLayoutContainer: true,
					 onShow: function() {
						popup.close(self.chooseRegionButtonTooltip);
						popup.close(self.chooseProfileButtonTooltip);
						popup.close(self.chooseHabitatButtonTooltip);
					 }
			    });
				this.tabHelp.startup();
				//append help tab to main tabContainer
			    this.tc.addChild(this.tabHelp);
				
				this.cpOverview = new ContentPane({
					style: "position:relative; width:100%; height:100%;",
					content: ""
					//content: self._interface.overview
			    });
			    this.cpOverview.startup();
			    this.tabHelp.addChild(this.cpOverview);
				//request the overview.html template and populate the pane's content
				this.cpOverview.set("href", self.pluginDirectory + "/overview.html");
				
				//THE EXPOSURE PANEL
			    this.tabExposure = new ContentPane({
			         title: "Exposure",
					 style: "position:relative;width:625px;height:553px;overflow:hidden;",
			         isLayoutContainer: true,
					 onShow: function() {
						//self.resizeProfileChart();
						//placeholder function, performs a couple checks in CD
					 }
			    });
			    this.tabExposure.startup();
				//add inputs tab to main tabContainer
			    this.tc.addChild(this.tabExposure);
				
				//THE DAMAGES PANEL
			    this.tabDamages = new ContentPane({
			         title: "Damages",
					 style: "position:relative;width:625px;height:553px;overflow:hidden;",
					 isLayoutContainer: true,
					 onShow: function() {
						self.resizeChart(self.chart1);
						//placeholder function, performs a couple checks in CD
					 }
			    });
				this.tabDamages.startup();
				//append results tab to main tabContainer
			    this.tc.addChild(this.tabDamages);

			    //THE MEASURES PANEL
			    this.tabMeasures = new ContentPane({
			         title: "Measures",
					 style: "position:relative;width:625px;height:553px;overflow:hidden;",
					 isLayoutContainer: true,
					 onShow: function() {
						//self.resizeProfileChart();
						//placeholder function, performs a couple checks in CD
					 }
			    });
				this.tabMeasures.startup();
				//append results tab to main tabContainer
			    this.tc.addChild(this.tabMeasures);
				
				//THE WAVE MODEL DEBUG PANEL
				if (this.parameters.debug) {
					this.tabDebug = new ContentPane({
						 title: "Server Messages",
						 style: "position:relative;width:625px;height:553px;",
						 isLayoutContainer: true,
						 onShow: function() {
							popup.close(self.chooseRegionButtonTooltip);
							popup.close(self.chooseProfileButtonTooltip);
							popup.close(self.chooseHabitatButtonTooltip);
						 }
					});
					this.tabDebug.startup();
					//append results tab to main tabContainer
					this.tc.addChild(this.tabDebug);
					
					this.debugServerMessagePane = new ContentPane({
						id: 'debugServerMessageContent'
					});
					this.debugServerMessagePane.startup();
					this.tabDebug.addChild(this.debugServerMessagePane);
				}

			    //empty layout containers
			    this.cpTop = new ContentPane({
					title: 'eca-top-pane'
			    });
			    this.cpTop.startup();
				
				this.cpBottom = new ContentPane({
					title: 'eca-bottom-pane'
			    });
			    this.cpBottom.startup();
				
				//add elements as children of inputs tab
			    this.tabDamages.addChild(this.cpTop);
				//this.tabExposure.addChild(this.cpBottom);

			    this.cpLeading = new ContentPane({
			    	title: "eca-leading-pane"
			    });
				this.cpLeading.startup();

			    this.cpMain = new ContentPane({
			    	title: 'eca-main-pane'
			    });
			    this.cpMain.startup();
				
				//add elements as children of bottom pane
			    this.cpBottom.addChild(this.cpLeading);
			    this.cpBottom.addChild(this.cpMain);

			    //add container to DOM
			    dom.byId(this._container).appendChild(this.tc.domNode);

			    this.createDamagesInputs();
			    this.createCharts();
				
				domStyle.set(this.tc, "width", "100%");
			}
			
			this.createDamagesInputs = function(){
				this.damageInputsPane = new TitlePane({
			    	title: 'Parameters',
			    	style: 'overflow:visible; margin: 10px;',
			    	toggleable: false,
			    });

			    this.cpTop.domNode.appendChild(this.damageInputsPane.domNode);
			    domStyle.set(this.damageInputsPane.containerNode, {"border": "1px dotted #ccc", "padding-bottom": "25px"});

				//dropdown labels
				damageTypeContainer = domConstruct.create("div", {style: 'width: 150px; display: inline-block;', innerHTML: "<b>Damage Type:</b>"});
				this.damageInputsPane.containerNode.appendChild(damageTypeContainer);

				growthContainer = domConstruct.create("div", {style: 'width: 150px; display: inline-block;', innerHTML: "<b>Economic Growth:</b>"});
				this.damageInputsPane.containerNode.appendChild(growthContainer);

				defenseContainer = domConstruct.create("div", {style: 'width: 150px; display: inline-block;', innerHTML: "<b>Defense:</b>"});
				this.damageInputsPane.containerNode.appendChild(defenseContainer);

				//damage type dropdown
				var typeDropdown = new DropDownMenu({ style: "display: none;"});
				domClass.add(typeDropdown.domNode, "claro");
				
				var typeMenuItem1 = new MenuItem({
					label: 'Flood',
					onClick: function(){
						self.comboButtonType.set("label", this.label);
						self.getInputValues();
					}
				});

				var typeMenuItem2 = new MenuItem({
					label: 'Wind',
					onClick: function(){
						self.comboButtonType.set("label", this.label);
						self.getInputValues();
					}
				});

				typeDropdown.addChild(typeMenuItem1);
				typeDropdown.addChild(typeMenuItem2);

				this.comboButtonType = new ComboButton({
					label: "Flood",
					name: "growth",
					style: "width: 150px; display: inline-block;",
					dropDown: typeDropdown
				});

				this.damageInputsPane.containerNode.appendChild(this.comboButtonType.domNode);				

				
				//growth scenario dropdown
				var growthDropdown = new DropDownMenu({ style: "display: none;"});
				domClass.add(growthDropdown.domNode, "claro");
				
				var menuItem2 = new MenuItem({
					label: 'Low',
					onClick: function(){
						self.comboButtonEconomy.set("label", this.label);
						self.getInputValues();
					}
				});

				var menuItem1 = new MenuItem({
					label: 'High',
					onClick: function(){
						self.comboButtonEconomy.set("label", this.label);
						self.getInputValues();
					}
				});

				growthDropdown.addChild(menuItem1);
				growthDropdown.addChild(menuItem2);

				this.comboButtonEconomy = new ComboButton({
					label: "Low",
					name: "growth",
					style: "width: 150px; display: inline-block;",
					dropDown: growthDropdown
				});
			
				this.damageInputsPane.containerNode.appendChild(this.comboButtonEconomy.domNode);
				//this.cpTop.addChild(growthDropdown);


				//defense scenario dropdown
				var defenseDropdown = new DropDownMenu({ style: "display: none;"});
				domClass.add(defenseDropdown.domNode, "claro");
				
				var defenseMenuItem1 = new MenuItem({
					label: 'None',
					onClick: function(){
						self.comboButtonDefense.set("label", this.label);
						self.getInputValues();
					}
				});

				var defenseMenuItem2 = new MenuItem({
					label: 'High',
					onClick: function(){
						self.comboButtonDefense.set("label", this.label);
						self.getInputValues();
					}
				});

				var defenseMenuItem3 = new MenuItem({
					label: 'Low',
					onClick: function(){
						self.comboButtonDefense.set("label", this.label);
						self.getInputValues();
					}
				});

				defenseDropdown.addChild(defenseMenuItem1);
				defenseDropdown.addChild(defenseMenuItem2);
    			defenseDropdown.addChild(defenseMenuItem3);

				this.comboButtonDefense = new ComboButton({
					label: "None",
					name: "defense",
					style: "width: 150px; display: inline-block;",
					dropDown: defenseDropdown
				});
			
				this.damageInputsPane.containerNode.appendChild(this.comboButtonDefense.domNode);
				//this.cpTop.addChild(defenseDropdown);

				//asset year slider
				assetYearSliderLabel = domConstruct.create("div", {innerHTML: "<br><br><b>Choose a year for asset values</b>", style:"margin-bottom:10px;"});
				this.damageInputsPane.containerNode.appendChild(assetYearSliderLabel);
				this.assetYearSlider = new HorizontalSlider({
			        name: "assetYearSlider",
			        value: 2010,
			        minimum: 2010,
			        maximum: 2050,
			        discreteValues: 3,
			        showButtons: false,
			        style: "width:500px;",
			        onChange: function(value){
			           //this.value = value;
			           self.getInputValues();
			           
			           /*console.log(this.value);
			           var chartData = [];
			           var visibleLayers = [];

			       
			          //self.updateChart();
       				  console.log(self.chart1);
			          self.updateChart(chartData);*/

			          
			        }
			    });
			    this.damageInputsPane.containerNode.appendChild(this.assetYearSlider.domNode);

			    var assetYearSliderLabels = new HorizontalRuleLabels({
			    	container: 'bottomDecoration',
			    	count: 3,
			    	labels: ['2010', '2030', '2050'],
			    	style: "margin-top: 5px;"
			    });
			    this.assetYearSlider.addChild(assetYearSliderLabels);

			    //climate year slider
			    climateYearSliderLabel = domConstruct.create("div", {innerHTML: "<br><br><b>Choose a year for climate data</b>", style:"margin-bottom:10px;"});
				this.damageInputsPane.containerNode.appendChild(climateYearSliderLabel);
				this.climateYearSlider = new HorizontalSlider({
			        name: "climateYearSlider",
			        value: 2010,
			        minimum: 2010,
			        maximum: 2050,
			        discreteValues: 3,
			        showButtons: false,
			        style: "width:500px;",
			        onChange: function(value){
			          /* this.value = value;
			           //log the value for debugging purposes
			           console.log(this.value);
			           var chartData = [];
			           var visibleLayers = [];
*/
			           //replace with api call
			           self.getInputValues();
			        }
			    });
			    this.damageInputsPane.containerNode.appendChild(this.climateYearSlider.domNode);

			    var climateYearSliderLabels = new HorizontalRuleLabels({
			    	container: 'bottomDecoration',
			    	count: 3,
			    	labels: ['2010', '2030', '2050'],
			    	style: "margin-top: 5px;"
			    });
			    this.climateYearSlider.addChild(climateYearSliderLabels);

			    this.errorMessage = domConstruct.create("div", {innerHTML: "<br><b>No data for selected inputs</b>", style:"color: red; margin-top:10px; float: right; display: none"});
				this.damageInputsPane.containerNode.appendChild(this.errorMessage);

			}

			this.createCharts = function(){
				this.damageChartPane = new TitlePane({
			    	title: 'Results/Data',
			    	style: 'overflow:visible; margin: 10px;',
			    	toggleable: false,
			    });

				this.cpTop.domNode.appendChild(this.damageChartPane.domNode);
				domStyle.set(this.damageChartPane.containerNode, {"border": "1px dotted #ccc", "padding-bottom": "25px"});
				this.chartNode1 = domConstruct.create("div");
				this.chartNode2 = domConstruct.create("div");
				this.damageChartPane.containerNode.appendChild(this.chartNode1);
				this.damageChartPane.containerNode.appendChild(this.chartNode2);
				// Define the data
			    this.chartData1 = [{x:1, y:13887},{x:2, y:14200},{x:3, y:12222},{x:4, y:12000},{x:5, y:10009},{x:6, y:11288},{x:7, y:12099}, {x:8, y:25000}];
			 
			    // Create the chart within it's "holding" node
			    this.chart1 = new Chart(this.chartNode1);
			   
			 
			    // Add the only/default plot
			    this.chart1.addPlot("growth", {
			        type: "Columns",
			        markers: true,
			        gap: 5,
			        animate: {duration: 1000}
			    });
			 
			    // Add axes
			    this.chart1.addAxis("x", {htmlLabels: false});
			    this.chart1.addAxis("y", { vertical: true, fixLower: "major", fixUpper: "major", htmlLabels: false });
			 
			    // Add the series of data
			    this.chart1.addSeries("Economic Growth Scenarios", this.chartData1, {
			    	plot: "growth",
			    	stroke: { color: "#1C4A85", width: 5, cap: "round", join: "round"  }
			    });
			 
			    // Render the chart
			    this.chart1.render();
			}

			this.initializeMap = function(){
				//initialize an empty dynamic map service layer
			    var mapUrl = 'http://dev.services2.coastalresilience.org:6080/arcgis/rest/services/Cost_Benefit/Cost_Benefit/MapServer';
	          	this.mapLayer = new DynamicMapServiceLayer(mapUrl);
	          	this._map.addLayer(this.mapLayer);
	          	this.mapLayer.setVisibleLayers([-1]);
	          	this.mapLayer.hide();
			}

			this.updateChart = function(chartData){
				//console.log(self.chart1.series[0].data);
				//console.log(self.chart1);
				self.chart1.updateSeries("Economic Growth Scenarios", chartData);
				//console.log(self.chart1.series[0].data);
    			self.chart1.render();
			}

			this.resizeChart = function(chart){
				var width = chart.dim.width;
				console.log(width);
				if (width != 500) {
					chart.resize(500,300);
				}
			}
			

			this.getInputValues = function(){
				var growth = this.comboButtonEconomy.get("label");
				var defense = this.comboButtonDefense.get("label");
				var asset = this.assetYearSlider.get("value");
				var climate = this.climateYearSlider.get("value");
				var type = this.comboButtonType.get("label");
				console.log(type);
				var visibleLayers = [];
				var floodInputString = growth + "-" + defense + "-" + asset + "-" + climate;
				var floodInputString = floodInputString.toLowerCase();
				var windInputString = growth + "-" + asset + "-" + climate;
				var windInputString = windInputString.toLowerCase();
				console.log(floodInputString);
				
				//hide the error message if it's visible
				if(this.errorMessage.style.display == 'inline-block'){
					domStyle.set(this.damageInputsPane.containerNode, {"padding-bottom": "25px"});
					domStyle.set(this.errorMessage, {"display": "none"});
				}

				//huge switch/case statement to set proper layer for given inputs for flood scenarios
				if(type == 'Flood'){
					switch(floodInputString){
						case 'high-high-2010-2010':
							visibleLayers = [14];
							break;
						case 'high-high-2010-2030':
							visibleLayers = [15];
							break;
						case 'high-high-2010-2050':
							visibleLayers = [16];
							break;
						case 'high-high-2030-2010':
							visibleLayers = [17];
							break;
						case 'high-high-2030-2030':
							visibleLayers = [18];
							break;
						case 'high-high-2050-2010':
							visibleLayers = [19];
							break;
						case 'high-high-2050-2050':
							visibleLayers = [20];
							break;
						case 'high-low-2010-2010':
							visibleLayers = [21];
							break;
						case 'high-low-2010-2030':
							visibleLayers = [22];
							break;
						case 'high-low-2010-2050':
							visibleLayers = [23];
							break;
						case 'high-low-2030-2010':
							visibleLayers = [24];
							break;
						case 'high-low-2030-2030':
							visibleLayers = [25];
							break;
						case 'high-low-2050-2010':
							visibleLayers = [26];
							break;
						case 'high-low-2050-2050':
							visibleLayers = [27];
							break;
						case 'high-none-2010-2010':
							visibleLayers = [28];
							break;		
						case 'high-none-2010-2030':
							visibleLayers = [29];
							break;
						case 'high-none-2010-2050':
							visibleLayers = [30];
							break;
						case 'high-none-2030-2010':
							visibleLayers = [31];
							break;
						case 'high-none-2030-2030':
							visibleLayers = [32];
							break;
						case 'high-none-2050-2010':
							visibleLayers = [33];
							break;
						case 'high-none-2050-2050':
							visibleLayers = [34];
							break;
						case 'low-high-2010-2010':
							visibleLayers = [35];
							break;
						case 'low-high-2010-2030':
							visibleLayers = [36];
							break;
						case 'low-high-2010-2050':
							visibleLayers = [37];
							break;
						case 'low-high-2030-2010':
							visibleLayers = [38];
							break;
						case 'low-high-2030-2030':
							visibleLayers = [39];
							break;
						case 'low-high-2050-2010':
							visibleLayers = [40];
							break;
						case 'low-high-2050-2050':
							visibleLayers = [41];
							break;
						case 'low-low-2010-2010':
							visibleLayers = [42];
							break;
						case 'low-low-2010-2030':
							visibleLayers = [43];
							break;
						case 'low-low-2010-2050':
							visibleLayers = [44];
							break;
						case 'low-low-2030-2010':
							visibleLayers = [45];
							break;
						case 'low-low-2030-2030':
							visibleLayers = [46];
							break;
						case 'low-low-2050-2010':
							visibleLayers = [47];
							break;
						case 'low-low-2050-2050':
							visibleLayers = [48];
							break;
						case 'low-none-2010-2010':
							visibleLayers = [49];
							break;		
						case 'low-none-2010-2030':
							visibleLayers = [50];
							break;
						case 'low-none-2010-2050':
							visibleLayers = [51];
							break;
						case 'low-none-2030-2010':
							visibleLayers = [52];
							break;
						case 'low-none-2030-2030':
							visibleLayers = [53];
							break;
						case 'low-none-2050-2010':
							visibleLayers = [54];
							break;
						case 'low-none-2050-2050':
							visibleLayers = [55];
							break;		
						default:
							console.log('missing case or layer data');
							visibleLayers = [-1];
							domStyle.set(this.damageInputsPane.containerNode, {"padding-bottom": "50px"});
							domStyle.set(this.errorMessage, {"display": "inline-block"});
							break; 
					}
				}
				if(type == 'Wind'){
					switch(windInputString){
						case 'high-2010-2010':
							visibleLayers = [57];
							break;
						case 'high-2010-2030':
							visibleLayers = [58];
							break;
						case 'high-2010-2050':
							visibleLayers = [59];
							break;
						case 'high-2030-2010':
							visibleLayers = [60];
							break;
						case 'high-2030-2030':
							visibleLayers = [61];
							break;
						case 'high-2050-2010':
							visibleLayers = [62];
							break;
						case 'high-2050-2050':
							visibleLayers = [63];
							break;
						case 'low-2010-2010':
							visibleLayers = [64];
							break;
						case 'low-2010-2030':
							visibleLayers = [65];
							break;
						case 'low-2010-2050':
							visibleLayers = [66];
							break;
						case 'low-2030-2010':
							visibleLayers = [67];
							break;
						case 'low-2030-2030':
							visibleLayers = [68];
							break;
						case 'low-2050-2010':
							visibleLayers = [69];
							break;
						case 'low-2050-2050':
							visibleLayers = [70];
							break;
						default:
							console.log('missing case or layer data');
							visibleLayers = [-1];
							break; 
					}
				}		

				this.updateLayer(visibleLayers);

			}

			this.updateLayer = function(visibleLayers){
				this.mapLayer.setVisibleLayers(visibleLayers);
	            console.log(this.mapLayer);
	            this.mapLayer.show();
			}


		};// End cdTool

		
		return ecaTool;	
		
	} //end anonymous function

); //End define