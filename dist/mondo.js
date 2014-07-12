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
        'use strict';function Collection(mondo, collectionName, Model, options) {
    // TODO: process arguments

    this._mondo = mondo;
    this.collectionName = collectionName;
    this.Model = Model;

    // TODO: process options
}

Collection.prototype.insert = function(docs, options, callback) {
    if ('function' == typeof options) {
        callback = options;
        options = undefined;
    }

    options = options || {};

    var query = new Query(this.collectionName);
    query.insert(docs);

    var deferred = $.Deferred();
    this._mondo.handle(query, deferred, this.Model, options);
    var promise = deferred.promise();
    handleCallback(promise, callback);
    return promise;
};

Collection.prototype.find = function(selector, fields, options, callback) {
    if ('function' == typeof selector) {
        callback = selector;
        selector = {};
        fields = undefined;
        options = undefined;
    } else if ('function' == typeof fields) {
        callback = fields;
        fields = undefined;
        options = undefined;
    } else if ('function' == typeof options) {
        callback = options;
        options = undefined;
    }

    options = options || {};

    var query = new Query(this.collectionName);
    query.find().where(selector);

    if (fields) {
        query.select(fields);
    }

    utils.forEach(['sort', 'skip', 'limit', 'lean'], function(method) {
        if (options[method]) {
            query[method](options[method]);
        }
    });

    var deferred = $.Deferred();
    this._mondo.handle(query, deferred, this.Model, options);
    var promise = deferred.promise();
    handleCallback(promise, callback);
    return promise;
};

Collection.prototype.findOne = function(selector, fields, options, callback) {
    if ('function' == typeof selector) {
        callback = selector;
        selector = {};
        fields = undefined;
        options = undefined;
    } else if ('function' == typeof fields) {
        callback = fields;
        fields = undefined;
        options = undefined;
    } else if ('function' == typeof options) {
        callback = options;
        options = undefined;
    }

    options = options || {};

    var query = new Query(this.collectionName);
    query.findOne().where(selector);

    if (fields) {
        query.select(fields);
    }

    utils.forEach(['lean'], function(method) {
        if (options[method]) {
            query[method](options[method]);
        }
    });

    var deferred = $.Deferred();
    this._mondo.handle(query, deferred, this.Model, options);
    var promise = deferred.promise();
    handleCallback(promise, callback);
    return promise;
};

Collection.prototype.update = function(selector, doc, options, callback) {
    if ('function' == typeof selector) {
        callback = selector;
        selector = {};
        doc = undefined;
        options = undefined;
    } else if ('function' == typeof doc) {
        callback = doc;
        doc = undefined;
        options = undefined;
    } else if ('function' == typeof options) {
        callback = options;
        options = undefined;
    }

    options = options || {};

    var query = new Query(this.collectionName);
    query.update(doc).where(selector);

    utils.forEach(['upsert', 'multi'], function(method) {
        if (options[method]) {
            query[method](options[method]);
        }
    });

    var deferred = $.Deferred();
    this._mondo.handle(query, deferred, this.Model, options);
    var promise = deferred.promise();
    handleCallback(promise, callback);
    return promise;
};

Collection.prototype.remove = function(selector, options, callback) {
    if ('function' == typeof selector) {
        callback = selector;
        selector = {};
        options = undefined;
    } else if ('function' == typeof options) {
        callback = options;
        options = undefined;
    }

    options = options || {};

    var query = new Query(this.collectionName);
    query.remove().where(selector);

    utils.forEach(['single'], function(method) {
        if (options[method]) {
            query[method](options[method]);
        }
    });

    var deferred = $.Deferred();
    this._mondo.handle(query, deferred, this.Model, options);
    var promise = deferred.promise();
    handleCallback(promise, callback);
    return promise;
};

Collection.prototype.count = function(selector, options, callback) {
    if ('function' == typeof selector) {
        callback = selector;
        selector = {};
        options = undefined;
    } else if ('function' == typeof options) {
        callback = options;
        options = undefined;
    }

    options = options || {};

    var query = new Query(this.collectionName);
    query.count().where(selector);

    utils.forEach(['skip', 'limit'], function(method) {
        if (options[method]) {
            query[method](options[method]);
        }
    });

    var deferred = $.Deferred();
    this._mondo.handle(query, deferred, this.Model, options);
    var promise = deferred.promise();
    handleCallback(promise, callback);
    return promise;
};

Collection.prototype.distinct = function(selector, fields, options, callback) {
    if ('function' == typeof selector) {
        callback = selector;
        selector = {};
        fields = undefined;
        options = undefined;
    } else if ('function' == typeof fields) {
        callback = fields;
        fields = undefined;
        options = undefined;
    } else if ('function' == typeof options) {
        callback = options;
        options = undefined;
    }

    options = options || {};

    var query = new Query(this.collectionName);
    query.distinct().where(selector);

    if (fields) {
        query.select(fields);
    }

    utils.forEach(['lean'], function(method) {
        if (options[method]) {
            query[method](options[method]);
        }
    });

    var deferred = $.Deferred();
    this._mondo.handle(query, deferred, this.Model, options);
    var promise = deferred.promise();
    handleCallback(promise, callback);
    return promise;
};

Collection.prototype.mapReduce = function(map, reduce, options, callback) {
    if ('function' == typeof options) {
        callback = options;
        options = undefined;
    }

    var query = new Query(this.collectionName);
    query.mapReduce(map, reduce);

    utils.forEach(['query', 'sort', 'limit'], function(method) {
        if (options[method]) {
            query[method](options[method]);
        }
    });

    var deferred = $.Deferred();
    this._mondo.handle(query, deferred, this.Model, options);
    var promise = deferred.promise();
    handleCallback(promise, callback);
    return promise;
};

// Sugar

Collection.prototype.findById = function(id, fields, options, callback) {
    return this.findOne({
        _id: id
    }, fields, options, callback);
};

Collection.prototype.removeById = function(id, fields, options, callback) {
    return this.remove({
        _id: id
    }, fields, options, callback);
};

Collection.prototype.updateById = function(id, doc, options, callback) {
    return this.update({
        _id: id
    }, doc, options, callback);
};

// Helpers

function handleCallback(promise, callback) {
    if (callback) {
        promise.then(function() {
            callback.apply(null, [null].concat([].slice.call(arguments, 0)));
        }, function(err) {
            callback(err);
        });
    }

    return promise;
}
function Model(doc) {
    this.attributes = doc;
}

Model.collection = null;

Model.prototype.defaults = {};

Model.prototype.attributes = {};

Model.prototype.changedAttributes = {};

Model.prototype.idAttribute = '_id';

Model.prototype.set = function(path, val, options) {

};

Model.prototype.get = function(path) {

};

Model.prototype.markModified = function(path) {

};

Model.prototype.isModified = function(path) {

};

Model.prototype.isNew = function() {

};

Model.prototype.update = function(doc, options, callback) {
    this.set(doc);
    this.save(callback);
};

Model.prototype.save = function(callback) {
    this._collection.update({
        _id: this.get('_id')
    }, {
        upsert: true
    }, callback);
};

Model.prototype.remove = function(callback) {
    this._collection.remove({
        _id: this.get('_id')
    }, callback);
};
function Mondo(options) {
    if (!(this instanceof Mondo)) {
        return new Mondo();
    }

    options = options || {};

    this._stores = [];
    this._onError = options.onError;
}

Mondo.version = '0.0.0';
Mondo.Model = Model;
Mondo.Collection = Collection;
Mondo.Query = Query;
Mondo.stores = {
    abstract: AbstractStore,
    localStorage: LocalStorageStore,
    sessionStorage: SessionStorageStore,
    nedb: NeDBStore,
    rest: RestStore,
    webSQL: WebSQLStore
};

Mondo.prototype.addStore = function(store) {
    this._stores.push(store);
};

Mondo.prototype.collection = function(name, Model, options) {
    // process arguments
    if ('undefined' === typeof Model) {
        Model = Mondo.Model;
    }
    var collection = new Collection(this, name, Model, options);
    return collection;
};

Mondo.prototype.handle = function(query, deferred, Model, options) {
    var stores;

    options = options || {};

    if (options.stores) {
        stores = utils.filter(this._stores, function(store) {
            return options.stores.indexOf(store.name) > -1;
        });
    } else {
        stores = this._stores;
    }

    var self = this;
    var idx = 0;
    next();

    function next(err) {
        if (err && self._onError) {
            return self._onError(err);
        }

        var store = stores[idx++];

        if (!store) {
            return deferred.resolve(null);
        }

        store.handle(query, deferred, Model, next);
    }
};
function Query(collectionName) {
    if (!(this instanceof Query)) {
        return new Query(collectionName);
    }

    this.collectionName = collectionName;
    this.options = {};
    this.op = undefined;
    this.selector = {};
    this.fields = undefined;
    this.doc = undefined;
    this.map = undefined;
    this.reduce = undefined;
}

// Basic operations

Query.prototype.insert = function(doc) {
    this.op = 'insert';
    this.doc = doc;
    return this;
};

Query.prototype.find = function(selector) {
    this.op = 'find';
    this.where(selector);
    return this;
};

Query.prototype.findOne = function(selector) {
    this.op = 'findOne';
    this.where(selector);
    return this;
};

Query.prototype.update = function(doc) {
    this.op = 'update';
    this.doc = doc;
    return this;
};

Query.prototype.remove = function(selector) {
    this.op = 'remove';
    this.where(selector);
    return this;
};

Query.prototype.count = function(selector) {
    this.op = 'count';
    this.where(selector);
    return this;
};

Query.prototype.mapReduce = function(map, reduce) {
    this.op = 'mapReduce';
    this.map = map;
    this.reduce = reduce;
    return this;
};

Query.prototype.distinct = function(selector) {
    this.op = 'distinct';
    this.where(selector);
    return this;
};

// More options

Query.prototype.where = function(selector) {
    if ('undefined' === typeof selector) {
        selector = {};
    }

    this.selector = selector;
    return this;
};

Query.prototype.select = function(fields) {
    this.fields = fields;
    return this;
};

Query.prototype.skip = function(skip) {
    this.options.skip = skip;
    return this;
};

Query.prototype.limit = function(limit) {
    this.options.limit = limit;
    return this;
};

Query.prototype.sort = function(sort) {
    this.options.sort = sort;
    return this;
};

Query.prototype.multi = function(multi) {
    if ('undefined' === typeof multi) {
        multi = true;
    }

    this.options.multi = multi;
    return this;
};

Query.prototype.lean = function(lean) {
    if ('undefined' === typeof lean) {
        lean = true;
    }

    this.options.lean = lean;
    return this;
};

Query.prototype.setDoc = function(doc) {
    this.doc = doc;
    return this;
};
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
function AbstractStore() {
    if (!(this instanceof AbstractStore)) {
        return new AbstractStore();
    }
}

// beforeHandle
// onError
// onSuccess
// beforeNext

AbstractStore.prototype.name = 'Abstract';

AbstractStore.prototype.handle = function(query, deferred, Model, next) {
    if ('function' === typeof this[query.op]) {
        return this[query.op](query, deferred, Model, next);
    }

    throw new Error('Handler for operation ' + query.op + ' not defined');
};

// Read

AbstractStore.prototype.find = function(query, deferred, Model, next) {
    throw new Error('You have not implement ' + this.name + '#find()');
};

AbstractStore.prototype.findOne = function(query, deferred, Model, next) {
    throw new Error('You have not implement ' + this.name + '#findOne()');
};

AbstractStore.prototype.count = function(query, deferred, Model, next) {
    throw new Error('You have not implement ' + this.name + '#count()');
};

AbstractStore.prototype.mapReduce = function(query, deferred, Model, next) {
    throw new Error('You have not implement ' + this.name + '#mapReduce()');
};

AbstractStore.prototype.distinct = function(query, deferred, Model, next) {
    throw new Error('You have not implement ' + this.name + '#distinct()');
};

// Write

AbstractStore.prototype.insert = function(query, deferred, Model, next) {
    throw new Error('You have not implement ' + this.name + '#insert()');
};

AbstractStore.prototype.update = function(query, deferred, Model, next) {
    throw new Error('You have not implement ' + this.name + '#update()');
};

AbstractStore.prototype.remove = function(query, deferred, Model, next) {
    throw new Error('You have not implement ' + this.name + '#remove()');
};
function IndexedDBStore(options) {
    if (!(this instanceof IndexedDBStore)) {
        return new IndexedDBStore(options);
    }
}

IndexedDBStore.prototype = new AbstractStore();
IndexedDBStore.prototype.constructor = IndexedDBStore;

IndexedDBStore.prototype.name = 'IndexedDB';
function LocalStorageStore(namespace, options) {
    if (!(this instanceof LocalStorageStore)) {
        return new LocalStorageStore(options);
    }
}

LocalStorageStore.prototype = new AbstractStore();
LocalStorageStore.prototype.constructor = LocalStorageStore;

LocalStorageStore.prototype.name = 'LocalStorage';

LocalStorageStore.prototype.namespace = null;

LocalStorageStore.prototype._get = function(collectionName) {
    var array;
    try {
        array = JSON.parse(window.localStorage[collectionName]);
    } catch (e) {
        // in case of any exception when parsing, just return an empty array
        array = [];
    }
    if (!utils.isArray(array)) array = [];

    return array;
};

LocalStorageStore.prototype._save = function(collectionName, array) {
    window.localStorage[collectionName] = JSON.stringify(array);
};

// Read

LocalStorageStore.prototype.find = function(query, deferred, Model, next) {
    var array = this._get(query.collectionName);
    var docs = array;
    var models = utils.filter(docs, function(doc) {
        return new Model(doc);
    });
    deferred.resolve(models);
};

// Write

AbstractStore.prototype.insert = function(query, deferred, Model, next) {
    var array = this._get(query.collectionName);
    var docs;

    if (utils.isArray(query.doc)) {
        docs = query.doc;
    } else {
        docs = [query.doc];
    }

    array.concat(docs);
    this._save(query.collectionName, array);
    var models = utils.filter(docs, function(doc) {
        return new Model(doc);
    });
    deferred.resolve(models);

    next();
};
function NeDBStore(options) {
    if (!(this instanceof NeDBStore)) {
        return new NeDBStore(options);
    }
}

NeDBStore.prototype = new AbstractStore();
NeDBStore.prototype.constructor = NeDBStore;

NeDBStore.prototype.name = 'NeDB';

function RestStore(options) {
    if (!(this instanceof RestStore)) {
        return new RestStore(options);
    }

    if ('string' === typeof options) {
        this._url = options;
        options = undefined;
    }

    options = options || {};
}

RestStore.prototype = new AbstractStore();
RestStore.prototype.constructor = RestStore;

RestStore.prototype.name = 'Rest';

// Read

RestStore.prototype.find = function(query, deferred, Model, next) {
    var queryUri = new QueryURI(this._url);
    queryUri.collection(query.collectionName).where(query.selector);

    if (query.fields) {
        queryUri.select(query.fields);
    }

    if (query.options.sort) {
        queryUri.sort(query.options.sort);
    }

    if (query.options.skip) {
        queryUri.skip(query.options.skip);
    }

    if (query.options.limit) {
        queryUri.limit(query.options.limit);
    }

    var promise = deferred.promise();
    promise.each = function(callback) {
        callback();
    };

    $.ajax({
        type: 'GET',
        url: queryUri.toString(),
        success: function(data, textStatus, jqXHR) {
            if (query.options.lean) {
                return deferred.resolve(data);
            }
            var models = utils.map(data, function(doc) {
                return new Model(doc);
            });
            deferred.resolve(models);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            deferred.reject(errorThrown);
        }
    });
};

RestStore.prototype.findOne = function(query, deferred, Model, next) {
    var queryUri = new QueryURI(this._url);
    queryUri.collection(query.collectionName).setOp('find_one').where(query.selector);

    if (query.fields) {
        queryUri.select(query.fields);
    }

    if (query.options.sort) {
        queryUri.sort(query.options.sort);
    }

    if (query.options.skip) {
        queryUri.skip(query.options.skip);
    }

    if (query.options.limit) {
        queryUri.limit(query.options.limit);
    }

    $.ajax({
        type: 'GET',
        url: queryUri.toString(),
        success: function(data, textStatus, jqXHR) {
            if (query.options.lean) {
                return deferred.resolve(data);
            }
            var model = new Model(doc);
            deferred.resolve(model);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            deferred.reject(errorThrown);
        }
    });
};

RestStore.prototype.count = function(query, deferred, Model, next) {
    var queryUri = new QueryURI(this._url);
    queryUri.collection(query.collectionName).setOp('find_one').where(query.selector);

    if (query.options.skip) {
        queryUri.skip(query.options.skip);
    }

    if (query.options.limit) {
        queryUri.limit(query.options.limit);
    }

    $.ajax({
        type: 'GET',
        url: queryUri.toString(),
        success: function(data, textStatus, jqXHR) {
            return deferred.resolve(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            deferred.reject(errorThrown);
        }
    });
};

RestStore.prototype.mapReduce = function(query, deferred, Model, next) {
    var queryUri = new QueryURI(this._url);
    queryUri.collection(query.collectionName).setOp('map_reduce').map(query.map).reduce(query.reduce).where(query.selector);

    if (query.options.sort) {
        queryUri.sort(query.options.sort);
    }

    if (query.options.limit) {
        queryUri.limit(query.options.limit);
    }

    $.ajax({
        type: 'GET',
        url: queryUri.toString(),
        success: function(data, textStatus, jqXHR) {
            return deferred.resolve(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            deferred.reject(errorThrown);
        }
    });
};

RestStore.prototype.distinct = function(query, deferred, Model, next) {
    var queryUri = new QueryURI(this._url);
    queryUri.collection(query.collectionName).setOp('distinct').key(query.key);

    $.ajax({
        type: 'GET',
        url: queryUri.toString(),
        success: function(data, textStatus, jqXHR) {
            if (query.options.lean) {
                return deferred.resolve(data);
            }
            var model = new Model(doc);
            deferred.resolve(model);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            deferred.reject(errorThrown);
        }
    });
};

// Write

RestStore.prototype.insert = function(query, deferred, Model, next) {
    var queryUri = new QueryURI(this._url);
    queryUri.collection(query.collectionName);

    $.ajax({
        type: 'POST',
        url: queryUri.toString(),
        data: JSON.stringify(query.doc),
        success: function(data, textStatus, jqXHR) {
            if (query.options.lean) {
                return deferred.resolve(data);
            }
            var models = utils.map(data, function(doc) {
                return new Model(doc);
            });
            deferred.resolve(models);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            deferred.reject(errorThrown);
        }
    });

    // TODO: pass deferred to next layer
    next();
};

RestStore.prototype.update = function(query, deferred, Model, next) {
    var queryUri = new QueryURI(this._url);
    queryUri.collection(query.collectionName).where(query.selector);

    if (query.options.multi) {
        queryUri.multi(query.options.multi);
    }

    if (query.options.upsert) {
        queryUri.upsert(query.options.upsert);
    }

    $.ajax({
        type: 'PATCH',
        url: queryUri.toString(),
        data: JSON.stringify(query.doc),
        success: function(data, textStatus, jqXHR) {
            if (query.options.lean) {
                return deferred.resolve(data);
            }
            var models = utils.map(data, function(doc) {
                return new Model(doc);
            });
            deferred.resolve(models);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            deferred.reject(errorThrown);
        }
    });

    next();
};

RestStore.prototype.remove = function(query, deferred, Model, next) {
    var queryUri = new QueryURI(this._url);
    queryUri.collection(query.collectionName).where(query.selector);

    if (query.options.single) {
        queryUri.single(query.options.single);
    }

    $.ajax({
        type: 'DELETE',
        url: queryUri.toString(),
        success: function(data, textStatus, jqXHR) {
            if (query.options.lean) {
                return deferred.resolve(data);
            }
            var models = utils.map(data, function(doc) {
                return new Model(doc);
            });
            deferred.resolve(models);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            deferred.reject(errorThrown);
        }
    });

    next();
};

function QueryURI(rootUrl) {
    if (!(this instanceof QueryURI)) {
        return new QueryURI(rootUrl);
    }

    this._uri = new URI(rootUrl);
}

QueryURI.prototype.collection = function(collectionName) {
    return this;
};

QueryURI.prototype.setOp = function(op) {
    return this;
};

QueryURI.prototype.where = function(selector) {
    if ('undefined' !== typeof selector._id) {
        //TODO
    }
    return this;
};

QueryURI.prototype.skip = function(skip) {
    return this;
};

QueryURI.prototype.limit = function(limit) {
    return this;
};

QueryURI.prototype.sort = function(sort) {
    return this;
};

QueryURI.prototype.toString = function() {
    return this._uri.toString();
};
function SessionStorageStore(options) {
    if (!(this instanceof SessionStorageStore)) {
        return new SessionStorageStore(options);
    }
}
SessionStorageStore.prototype = new AbstractStore();
SessionStorageStore.prototype.constructor = SessionStorageStore;

SessionStorageStore.prototype.name = 'SessionStorage';

SessionStorageStore.prototype.namespace = null;

SessionStorageStore.prototype._get = function(collectionName) {
    var array;
    try {
        array = JSON.parse(window.sessionStorage[collectionName]);
    } catch (e) {
        // in case of any exception when parsing, just return an empty array
        array = [];
    }
    if (!utils.isArray(array)) array = [];

    return array;
};

SessionStorageStore.prototype._save = function(collectionName, array) {
    window.sessionStorage[collectionName] = JSON.stringify(array);
};

// Read

SessionStorageStore.prototype.find = function(query, deferred, Model, next) {
    var array = this._get(query.collectionName);
    var docs = array;
    var models = utils.filter(docs, function(doc) {
        return new Model(doc);
    });

    setTimeout(function() {
        deferred.resolve(models);
    }, 0);
};

// Write

AbstractStore.prototype.insert = function(query, deferred, Model, next) {
    var array = this._get(query.collectionName);
    var docs;

    if (utils.isArray(query.doc)) {
        docs = query.doc;
    } else {
        docs = [query.doc];
    }

    array.concat(docs);
    this._save(query.collectionName, array);
    var models = utils.filter(docs, function(doc) {
        return new Model(doc);
    });

    setTimeout(function() {
        deferred.resolve(models);
    }, 0);

    next();
};
function WebSQLStore(options) {
    if (!(this instanceof WebSQLStore)) {
        return new WebSQLStore(options);
    }
}

WebSQLStore.prototype = new AbstractStore();
WebSQLStore.prototype.constructor = WebSQLStore;

WebSQLStore.prototype.name = 'WebSQL';return Mondo;
}, jQuery);