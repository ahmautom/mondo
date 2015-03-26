(function(root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define('mondo', ['underscore', 'jquery', 'URIjs/URI', 'nedb', 'q'], factory);
    } else if (typeof exports !== 'undefined') {
        var _ = require('underscore');
        var $ = require('jquery')(root);
        var URI = require('URIjs');
        var Datastore = require('nedb');
        var Q = require('q');
        module.exports = factory(_, $, URI, Datastore, Q);
    } else {
        root.mondo = factory(root._, root.jQuery, root.URI, root.Nedb, root.Q);
    }

})(this, function factory(_, $, URI, Datastore, Q) {
        'use strict';