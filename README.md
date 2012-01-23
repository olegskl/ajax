Ajax
----

A framework-agnostic AJAX request handler.

Usage
-----

Request a list of items by issuing a GET request

    Ajax.request('get', 'http://example.com/api/items', {onSuccess: successFunc});

Create a new item by issuing a POST request

    Ajax.request('post', 'http://example.com/api/items', {body: 'myData', onSuccess: successFunc});