/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define(['knockout'], 
    function(ko) {
        'use strict';
        var Dashboard = function(dashboard, selected, widgets) {
            var self = this;
            
            self.grid = null;
            self.id = dashboard.id;
            self.name = ko.observable(dashboard.name);
            self.code = dashboard.code;
            self.selected = ko.observable(selected);
            
            self.widgets = ko.observableArray(widgets);
            self.widgetsInitialized = ko.observable(selected);
            self.url =  "DASHBOARD_" + dashboard.id;
        };
        return Dashboard;
    }
);
