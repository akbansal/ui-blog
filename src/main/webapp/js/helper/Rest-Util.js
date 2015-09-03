 /**
 *
 * @Rest Service Urility.
  * Created this rest Util to invoke Rest service URL. 
 * This util has GET, POST and DELETE methods and used jquery $.ajax method to invoke asynchronously.
 *
 * @author amit.k.bansal@gmail.com
 */

'use strict';

var RestResource = function(options) {
    this._config = {
        idAttribute: 'id'
    };
    this._config = $.extend(this._config, options);
    this._config.fullUrl = this._config.url;
};
RestResource.prototype.ajax = $.ajax;

RestResource.prototype.get = function() {
     // Request settings
    var url = this._config.fullUrl;
    var settings = {
        'type': 'GET',
        'url': url,
    };
    return this.ajax(settings);
};

RestResource.prototype.add = function(params, object) {
    var url = this._config.fullUrl;

    if (url && object && 'id' in object) {
        url += "/" + object['id'];
    }
    var settings = {
        'type': 'POST',
        'url': url,
        'data': params,
        'dataType': "html"
    };
    return this.ajax(settings);
};


RestResource.prototype.remove = function(object) {
    var url = this._config.fullUrl;

    if (url && object && 'id' in object) {
        url += "/" + object['id'];
    } 

    var settings = {
        'type': 'DELETE',
        'url': url,
    };

    return this.ajax(settings);
};

// expose via CommonJS, AMD or as a global object 
// In our case this RestResource will exposed via AMD.
if (typeof module === 'object' && module.exports) {
    module.exports = RestResource;
} else if (typeof define === 'function' && define.amd) {
    define(function() {
        return RestResource;
    });
} else {
    window.RestResource = RestResource;
}