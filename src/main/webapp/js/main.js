/**
 * Application require Loading javascript file.
 * This file loads all the Library module required pre application startup. 
 */

requirejs.config({
    baseUrl: '', 
    // Path mappings for the logical module names
    paths: {
        'knockout': 'js/lib/knockout/knockout-3.3.0',
        'bootstrap':  'js/lib/bootstrap/bootstrap.min',
        'text':  'js/lib/require/text',
        'jquery':  'js/lib/jquery/jquery-1.11.3.min',
        //This koext library is used for Alll templates used in knockout.
        'koext':  'js/lib/koexternaltemplateengine/koExternalTemplateEngine_all',
        'app': 'js/blog',
        'ComponentRegistration': 'js/component/ComponentRegistration',
        'RestUtil': 'js/helper/Rest-Util',
        'Modal': 'js/helper/Modal-Util'
    },
    // Shim configurations for modules that do not expose AMD
    shim: {
        'koext': {
            deps: ['jquery', 'knockout']
        },
        'jquery': {
            exports: ['jQuery', '$']	    
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'RestUtil':{
            deps: ['jquery']
        }
    },
    wrapShim: true
});

/**
 * A top-level require call executed by the Application.
 */
require(['jquery','knockout', 'bootstrap', 'app','koext','ComponentRegistration','RestUtil'],
    // this callback gets executed when all required modules are loaded
    function($, ko, bootstrap, app) {
        // Below configuration is required to tell koext library - 
        // what would be be template suffix, url etc.

        infuser.defaults.templateUrl = "";
        infuser.defaults.templateSuffix = ".tmpl.html";
        infuser.defaults.loadingTemplate.content = '<div class="infuser-loading"><i class="fa fa-spinner fa-spin"/> Loading...</div>';

        $(document).ready(function() {
            // Once Document is ready, we are binding the entire page with
            // Application javascript view Model.
            ko.applyBindings(app, document.getElementById('body'));
        });
    }
);