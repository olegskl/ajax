/**
 * @fileOverview A framework-independent ajax request handler.
 * @author Oleg Sklyanchuk
 * @version 0.2.0
 * @license MIT License
 */

// Avoid overwriting an existing ajax:
var ajax = ajax || (function () {

    // ECMAScript 5 strict mode:
    'use strict';

    /**
     * Creates and returns a cross-browser XMLHttpRequest object.
     * 
     * @private
     * @throws {Error}
     * @returns {Object} XMLHttpRequest object.
     */

    var createXHR = function() {            
        try {
            // Standards-compliant browsers:
            return new XMLHttpRequest();
        } catch (e) {
            // Internet Explorer:
            try {
                return new ActiveXObject('Msxml2.XMLHTTP');
            } catch (e) {
                // Earlier versions of IE:
                try {
                    return new ActiveXObject("Msxml2.XMLHTTP.6.0");
                } catch(e) {
                    return new ActiveXObject("Msxml2.XMLHTTP.3.0");
                }
            }
        }
    };

    return {
        
        /**
         * Defines if requests should be asynchronous by default.
         * @type {boolean}
         */

        async: true,
        
        /**
         * Initiates and issues an XMLHttpRequest with GET method.
         * @see ajax.request
         * @param {String} url The target location.
         * @param {Object} [options] Optional parameters.
         * @returns {Object} XMLHttpRequest object
         */     
        
        get: function (url, options) {
            return this.request('get', url, options);
        },
        
        /**
         * Initiates and issues an XMLHttpRequest with POST method.
         * @see ajax.request
         * @param {String} url The target location.
         * @param {Object} [options] Optional parameters.
         * @returns {Object} XMLHttpRequest object
         */    
        
        post: function (url, options) {
            return this.request('post', url, options);
        },
        
        /**
         * Initiates and issues an XMLHttpRequest.
         * 
         * To send requests synchronously set ajax.async to false prior to calling .send().
         * 
         * @param {String} method HTTP request method (GET, POST, PUT, DELETE, ...)
         * @param {String} url The target location
         * @param {Object} [options] Optional parameters
         *    @param {String} [options.body] Data to send with request. Ignored if GET method is used. Use NULL if no data to send
         *    @param {Function} [options.success] A function to execute on a successful response (2XX status code).
         *    @param {Function} [options.failure] A function to execute on an unsuccessful response (non-2XX status code).
         *    @param {Boolean} [options.async] Defines if the request should be asynchronous.
         * 
         * @example ajax.request('get', 'http://example.com/api/items', {success: function(XHR){alert(XHR.status);}});
         * @example ajax.request('post', 'http://example.com/api/items', {body: 'MyData', success: function(XHR){alert(XHR.status);}});
         * @example ajax.request('delete', 'http://example.com/api/items/3', {success: function(XHR){alert(XHR.status);}});
         * 
         * @returns {Object} XMLHttpRequest object
         */
        
        request: function (method, url, options) {
            
            // To simplify later checks the "options" argument must
            // be prevalidated and reset as an object if necessary:
            //  - Note that typeof NULL == 'object'
            if (typeof options != 'object' || options == null) {
                options = {};
            }
                
            // Create the XMLHttpRequest object:
            var xhr = createXHR();
            
            // Assign a handler for XMLHttpRequest state change events:
            xhr.onreadystatechange = function() {
                
                // Response has loaded completely (4 = DONE):
                if (xhr.readyState != 4) { return; }
                
                // Check for success (2XX status):
                if (xhr.status >= 200 && xhr.status < 300) {
                    
                    // Request is successful (2XX status),
                    // calling onSuccess function (if any):
                    if (typeof options.success == 'function') {
                        options.success(xhr.status, xhr.responseText);
                    }
                    
                } else {
                    
                    // Request failed... (non-2XX status),
                    // calling failure function (if any):
                    if (typeof options.failure == 'function') {
                        options.failure(xhr.status, xhr.responseText);
                    }
                    
                }
                
            }
            
            // Determine if the request should be asynchronous or not:
            //  - The option "options.async" overrides the global property "this.async"
            var async = (typeof options.async == 'boolean')
                ? options.async
                : this.async;
            
            // Initiate the request:
            //  - If not set, the "method" argument must default to "GET"
            //  - We rely on xhr.open method to check validity of its arguments
            xhr.open(method, url, async);
            
            // Send the request:
            //  - The "body" option will be overridden with NULL if method is "GET"
            xhr.send(options.body);
            
            // Return xhr to provide a possibility
            // to call .abort() or other methods:
            return xhr;
        }
    }

}());