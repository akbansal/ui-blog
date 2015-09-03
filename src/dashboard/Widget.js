/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*
    SAMPLE Widget metadata
        "id": "GATEWAY_1",
        "name": "Database Status",
        "description": "This is a Database Status widget",
        "icon": "fa-database",
        "width": 2,
        "enableRefresh": true,
        "enableConfig": true,
        "templatePath": "DatabaseStatus-ScoreCard", 
        "viewModelPath": "DatabaseStatus-ScoreCardViewModal",
        "onInitCallback": "",
        "widgetConfig": {
            "templatePath": "DatabaseStatus-config",
            "viewModelPath": "",
            "onSaveCallback": "",
            "onCancelCallback": ""
        },
        "privilege": "User-View"
*/
define(['knockout'], function(ko) {
    'use strict';
    var Widget = function(widget) {
        this.id = widget.id;
        this.name = ko.observable(widget.name);
        this.description = widget.description;
        this.icon = widget.icon;
        this.width = widget.width || 2;
        this.height = widget.height || 1;
        this.enableRefresh = widget.enableRefresh || true;
        this.enableConfig = widget.enableConfig || false;
        this.colorcode = widget.colorcode || "#800080"; //Default Purple Color
        this.templatePath = widget.templatePath; 
        this.viewModelPath = widget.viewModelPath; 
        this.onInitCallback = widget.onInitCallback || null; 
        this.widgetConfig = widget.widgetConfig; 
        this.privilege = widget.privilege;
        this.service = widget.service;
        this.category = widget.category;
        this.refId = widget.refId;
        this.settings = widget.settings;
        this.widgetViewModel = ko.observable();
        this.widgetTemplate = ko.observable();
        this.x = parseInt('' + widget.xPos || 0);
        this.y = parseInt('' + widget.yPos || 0);
    };
    return Widget;
});
