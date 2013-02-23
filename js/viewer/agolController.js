
define([
    'esri/map',
    'esri/arcgis/utils',
    'esri/dijit/Popup',
    'esri/dijit/Geocoder',
    'esri/dijit/Attribution',
    'esri/layers/FeatureLayer',
    "esri/dijit/Legend",
    'dojo/dom',
    "dojo/dom-construct",
    'dojo/on',
    'dojo/parser',
    "dojo/_base/array",
    'dijit/layout/BorderContainer',
    'dijit/layout/ContentPane',
    "dijit/TitlePane",
    'dojo/_base/window',
    'dojo/_base/lang',
    "dojo/_base/Deferred",
    'gis/dijit/Print',
    'gis/dijit/Growler',
    'gis/dijit/GeoLocation',
    'gis/dijit/Draw',
    "dojo/text!./templates/leftContent.html",
    "dojo/text!./templates/mapOverlay.html",
    "viewer/agol_config",
    'dojo/domReady!'
    ], function(Map,esriUtils, Popup, Geocoder, Attribution, FeatureLayer, Legend, dom, domConstruct, on, parser, array, BorderContainer, ContentPane, TitlePane, win, lang, Deferred, Print, Growler, GeoLocation, Draw, leftContent, mapOverlay, config) {
    
    return {

        config: config,
        startup: function() {
            this.initConfig();
            this.initView();
            
        },
        initConfig: function() {
            esriConfig.defaults.io.proxyUrl = config.proxy.url;
            esriConfig.defaults.io.alwaysUseProxy = config.proxy.alwaysUseProxy;
        },
        initView: function() {
            outer = new BorderContainer({
                id: 'borderContainer',
                design: 'headline',
                gutters: false
            }).placeAt(win.body());

            left = new ContentPane({
                id: 'leftPane',
                region: 'left',
                content: leftContent
            }).placeAt(outer);

            new ContentPane({
                region: 'center',
                id: 'map',
                content: mapOverlay
            }).placeAt(outer);

            outer.startup();
            this.initMap();
        },
        initMap: function() {
            var that = this;

            var popup = new esri.dijit.Popup(null, domConstruct.create("div"));

            var mapDeferred = esriUtils.createMap("085648dddb0e41baa898b5e0b3afc902", "map", {
                mapOptions: {
                    /*add options*/
                }
            });
            mapDeferred.then(lang.hitch(this, function(response) {
                this.clickHandler = response.clickEventHandle;
                this.clickListener = response.clickEventListener;
                this.map = response.map;                
                this.initWidgets();
            }));
           
        },
        
        // evt doesn't appear to be used
        initWidgets: function(evt) {
            
            this.growler = new Growler({}, "growlerDijit");
            this.growler.startup();

            this.geoLocation = new GeoLocation({
                map: this.map,                
                growler: this.growler
            }, "geoLocationDijit");
            this.geoLocation.startup();

            this.geocoder = new esri.dijit.Geocoder({
                map: this.map,
                autoComplete: true
            }, "search");
            this.geocoder.startup();

            this.printWidget = new Print({
                map: this.map,
                printTaskURL: config.printTask.url,
                authorText: config.printTask.authorText,
                copyrightText: config.printTask.copyrightText
            }, 'printDijit');
            this.printWidget.startup();

            this.drawWidget = new Draw({
                map: this.map,
                clickHandler: this.clickHandler,
                clickListener: this.clickListener
            }, 'drawDijit');
            this.drawWidget.startup();

            this.legend = new esri.dijit.Legend({
                map: this.map
                // where is layerInfo defined? 
                // commented out so that the legend picks up whatever 
                // is in the map
                // layerInfos:layerInfo
            }, "legendDijit");
            this.legend.startup();
        }
    };
});