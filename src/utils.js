function utils(obj) {
    if (obj instanceof utils) {
        return obj;
    }
    if (!(this instanceof utils)) {
        return new utils(obj);
    }
    this._wrapped = obj;
}

utils.extend = function(obj) {
    for (var i = 1, l = arguments.length; i < l; i++) {
        var source = arguments[i];
        if (source) {
            for (var prop in source) {
                obj[prop] = source[prop];
            }
        }
    }
    return obj;
};

utils.forEach = function(obj, iterator, context) {
    var breaker = {};

    if (obj == null) return obj;
    if ([].forEach && obj.forEach === [].forEach) {
        obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
        for (var i = 0, length = obj.length; i < length; i++) {
            if (iterator.call(context, obj[i], i, obj) === breaker) return;
        }
    } else {
        var keys = _.keys(obj);
        for (var i = 0, length = keys.length; i < length; i++) {
            if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
        }
    }
    return obj;
};

utils.map = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if ([].map && obj.map === [].map) return obj.map(iterator, context);
    utils.forEach(obj, function(value, index, list) {
        results.push(iterator.call(context, value, index, list));
    });
    return results;
};

utils.filter = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    if ([].filter && obj.filter === [].filter) return obj.filter(predicate, context);
    each(obj, function(value, index, list) {
        if (predicate.call(context, value, index, list)) results.push(value);
    });
    return results;
};

utils.isArray = Array.isArray || function(obj) {
    return toString.call(obj) == '[object Array]';
};

utils.mixin = function(target, obj) {
    for (var name in obj) {
        if (typeof obj[name] === 'function') {
            var func = target[name] = obj[name];
            target.prototype[name] = function() {
                var args = [this._wrapped];
                [].push.apply(args, arguments);
                return func.apply(this, args);
            };
        }
    }
};

utils.mixin(utils, utils);