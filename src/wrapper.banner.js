(function(root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['underscore', 'jquery', 'URIjs/URI', 'nedb'], function(_, $, URI, Datastore) {
            return factory(_, $, URI, Datastore);
        });
    } else if (typeof exports !== 'undefined') {
        var _ = require('underscore');
        var $ = require('jquery')(root);
        var URI = require('URIjs');
        var Datastore = require('nedb');
        module.exports = factory(_, $, URI, Datastore);
    } else {
        root.mondo = factory(root._, root.jQuery, root.URI, root.Nedb);
    }

})(this, function factory(_, $, URI, Datastore) {
        'use strict';