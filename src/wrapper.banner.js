(function(global, factory, $, undefined) {
    'use strict';

    // Requirejs / Commonjs
    if (typeof define === 'function' && define.amd) {
        define('mondo', function(require, exports, module) {
            return factory(require('jquery'));
        });
    }
    // Node.js
    else if (typeof exports !== 'undefined') {
        exports.mondo = mondo;
        if (typeof module !== 'undefined' && module.exports) {
            module.exports = factory(require('jquery'));
        }
    }
    // Expose to global
    else {
        global.mondo = factory($);;
    }
})(this, function factory($, undefined) {
        'use strict';