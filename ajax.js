/**
 * @fileOverview This file contains an AJAX request handler that is independent of any framework.
 * @author <a href="mailto:sklyanchuk@gmail.com">Oleg Sklyanchuk</a>
 * @version 0.1.0
 */

var ajax = {
    
    /**
     * Defines if requests should be asynchronous by default.
     * @type {boolean}
     */
    
    isAsync: true,
    
    /**
     * Default onError function.
     * 
     * Logs error message to console (if available).
     * Suggested use is to override this function
     * with your own error handling procedure.
     * 
     * @param {String} msg A message to log
     * @returns {Void}
     */
    
    onError: function(msg) {
        
        // Log message if console is available:
        //  - IE requres a check for "window.console" instead of just "console".
        if (window.console) {
            console.log(msg);
        }
        
    },
    
    /**
     * Default onSuccess function.
     * 
     * Triggered on a server response with 2XX status.
     * Suggested use is to override this function
     * with your own onSuccess procedure.
     * 
     * @param {Object} XMLHttpRequest object
     * @returns {Void}
     */
    
    onSuccess: function(XHR) {},
    
    /**
     * Default onFailure function.
     * 
     * Triggered on a server response with non-2XX status.
     * Suggested use is to override this function
     * with your own onFailure procedure.
     * 
     * @param {Object} XMLHttpRequest object
     * @returns {Void}
     */
    
    onFailure: function(XHR) {},
    
    /**
     * Initiates and issues an XMLHttpRequest.
     * 
     * To send requests synchronously set ajax.async to false prior to calling .send().
     * For error tracking assign ajax.onerror event function prior to calling .send().
     * 
     * @param {String} method HTTP request method (GET, POST, PUT, DELETE, ...)
     * @param {String} url The target location
     * @param {Object} [params] Optional parameters
     *    @param {String} [body] Data to send with request. Ignored if GET method is used. Use NULL if no data to send
     *    @param {Function} [params.onSuccess]
     *    @param {Function} [params.onFailure] 
     *    @param {Boolean} [params.isAsync]
     * 
     * @example ajax.request('get', 'http://example.com/api/items', {onSuccess: function(XHR){alert(XHR.status);}});
     * @example ajax.request('post', 'http://example.com/api/items', {body: 'MyData', onSuccess: function(XHR){alert(XHR.status);}});
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
        
        try {
            
            // Create the XMLHttpRequest object:
            var XHR = this.createXHR();
            
            // Assign a handler for XMLHttpRequest state change events:
            XHR.onreadystatechange = function() {
                
                // Response has loaded completely (4 = DONE):
                if (XHR.readyState != 4) { return; }
                
                // Check for success (2XX status):
                if (XHR.status >= 200 && XHR.status < 300) {
                    
                    // Request is successful (2XX status),
                    // calling onSuccess function (if any):
                    if (typeof params.onSuccess == 'function') {
                        params.onSuccess(XHR);
                    } else if (typeof this.onSuccess == 'function') {
                        this.onSuccess(XHR);
                    }
                    
                } else {
                    
                    // Request failed... (non-2XX status),
                    // calling onFailure function (if any):
                    if (typeof params.onFailure == 'function') {
                        params.onFailure(XHR);
                    } else if (typeof this.onFailure == 'function') {
                        this.onFailure(XHR);
                    }
                    
                }
                
            }
            
            // Determine if the request should be asynchronous or not:
            //  - The option "params.isAsync" must override the global property "this.isAsync"
            var isAsync = (typeof params.isAsync == 'boolean')
                ? params.isAsync
                : this.isAsync;
            
            // Initiate the request:
            //  - If not set, the "method" argument must default to "GET"
            //  - We rely on XHR.open method to check validity of its arguments
            XHR.open(method || 'get', url, isAsync);
            
            // Send the request:
            //  - The "body" option will be overridden with NULL if method is "GET"
            XHR.send(params.body);
            
        } catch(e) {
            
            // An error occurred...
            // attempt to call the onError hook:
            if (typeof this.onError == 'function') {
                this.onError(e);
            }
        }
        
        // Return XHR to provide a possibility
        // of calling .abort() or other methods:
        return XHR;
        
    },
    
    /**
     *    Creates and returns a cross-browser XMLHttpRequest object
     *    
     *    @throws {Exception}
     *    @returns {Object} XMLHttpRequest object
     */
    
    createXHR: function() {
        
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