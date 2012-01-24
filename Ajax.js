/**
 * @fileOverview This file contains a framework-independent AJAX request handler.
 * @author <a href="mailto:sklyanchuk@gmail.com">Oleg Sklyanchuk</a>
 * @version 0.1.2
 * @license MIT License
 */

/**
 * The Ajax object.
 * @constructor
 */

var Ajax = {
    
    /**
     * Defines if requests should be asynchronous by default.
     * @type {boolean}
     */
    
    async: true,
    
    /**
     * Initiates and issues an XMLHttpRequest with GET method.
     * @see Ajax.request
     * @param {String} url The target location.
     * @param {Object} [params] Optional parameters.
     * @returns {Object} XMLHttpRequest object
     */     
    
    get: function(url, params) {
        return this.request('get', url, params);
    },
    
    /**
     * Initiates and issues an XMLHttpRequest with POST method.
     * @see Ajax.request
     * @param {String} url The target location.
     * @param {Object} [params] Optional parameters.
     * @returns {Object} XMLHttpRequest object
     */    
    
    post: function(url, params) {
        return this.request('post', url, params);
    },
    
    /**
     * Initiates and issues an XMLHttpRequest.
     * 
     * To send requests synchronously set ajax.async to false prior to calling .send().
     * For error tracking assign ajax.onerror event function prior to calling .send().
     * 
     * @param {String} method HTTP request method (GET, POST, PUT, DELETE, ...)
     * @param {String} url The target location
     * @param {Object} [params] Optional parameters
     *    @param {String} [params.body] Data to send with request. Ignored if GET method is used. Use NULL if no data to send
     *    @param {Function} [params.onSuccess] A function to execute on a successful response (2XX status code).
     *    @param {Function} [params.onFailure] A function to execute on an unsuccessful response (non-2XX status code).
     *    @param {Boolean} [params.async] Defines if the request should be asynchronous.
     * 
     * @example Ajax.request('get', 'http://example.com/api/items', {onSuccess: function(XHR){alert(XHR.status);}});
     * @example Ajax.request('post', 'http://example.com/api/items', {body: 'MyData', onSuccess: function(XHR){alert(XHR.status);}});
     * 
     * @returns {Object} XMLHttpRequest object
     */
    
    request: function(method, url, params) {
        
        // To simplify later checks the "params" argument must
        // be prevalidated and reset as an object if necessary:
        //  - Note that typeof NULL == 'object'
        if (typeof params != 'object' || params == null) {
            params = {};
        }
            
        // Create the XMLHttpRequest object:
        var XHR = this._createXHR();
        
        // Assign a handler for XMLHttpRequest state change events:
        XHR.onreadystatechange = function() {
            
            // Response has loaded completely (4 = DONE):
            if (XHR.readyState != 4) { return; }
            
            // Check for success (2XX status):
            if (XHR.status >= 200 && XHR.status < 300) {
                
                // Request is successful (2XX status),
                // calling onSuccess function (if any):
                if (typeof params.onSuccess == 'function') {
                    params.onSuccess(XHR.status, XHR.responseText);
                }
                
            } else {
                
                // Request failed... (non-2XX status),
                // calling onFailure function (if any):
                if (typeof params.onFailure == 'function') {
                    params.onFailure(XHR.status, XHR.responseText);
                }
                
            }
            
        }
        
        // Determine if the request should be asynchronous or not:
        //  - The option "params.async" overrides the global property "this.async"
        var async = (typeof params.async == 'boolean')
            ? params.async
            : this.async;
        
        // Initiate the request:
        //  - If not set, the "method" argument must default to "GET"
        //  - We rely on XHR.open method to check validity of its arguments
        XHR.open(method, url, async);
        
        // Send the request:
        //  - The "body" option will be overridden with NULL if method is "GET"
        XHR.send(params.body);
        
        // Return XHR to provide a possibility
        // to call .abort() or other methods:
        return XHR;
        
    },
    
    /**
     * Creates and returns a cross-browser XMLHttpRequest object
     * 
     * @private
     * @throws {Exception}
     * @returns {Object} XMLHttpRequest object
     */
    
    _createXHR: function() {
        
        try {
            
            // Standards-compliant browsers:
            return new XMLHttpRequest();
            
        } catch (e) {
            
            // Internet Explorer:
            try {
                
                // Microsoft.XMLHTTP points to Msxml2.XMLHTTP and is redundant
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
        
    }
    
}