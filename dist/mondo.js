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
        'use strict';function utils(obj) {
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
    if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
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

utils.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (Object.keys) return Object.keys(obj);
    var keys = [];
    for (var key in obj) {
        if (_.has(obj, key)) {
            keys.push(key);
        }
    }
    return keys;
};

utils.map = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (Array.prototype.map && obj.map === Array.prototype.map) return obj.map(iterator, context);
    utils.forEach(obj, function(value, index, list) {
        results.push(iterator.call(context, value, index, list));
    });
    return results;
};

utils.filter = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    if (Array.prototype.filter && obj.filter === Array.prototype.filter) return obj.filter(predicate, context);
    each(obj, function(value, index, list) {
        if (predicate.call(context, value, index, list)) results.push(value);
    });
    return results;
};

utils.isArray = Array.isArray || function(obj) {
    return toString.call(obj) == '[object Array]';
};

utils.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0,
        length = array.length;
    if (isSorted) {
        if (typeof isSorted == 'number') {
            i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
        } else {
            i = _.sortedIndex(array, item);
            return array[i] === item ? i : -1;
        }
    }
    if (Array.prototype.indexOf && array.indexOf === Array.prototype.indexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++)
        if (array[i] === item) return i;
    return -1;
};

utils.isEmpty = function(obj) {
    if (obj === null) {
        return true;
    }

    for (var key in obj) {
        if (_.has(obj, key)) {
            return false;
        }
    }

    return true;
};

utils.mixin = function(target, obj) {
    for (var name in obj) {
        if (typeof obj[name] === 'function') {
            var func = target[name] = obj[name];
            target.prototype[name] = function() {
                var args = [this._wrapped];
                Array.prototype.push.apply(args, arguments);
                return func.apply(this, args);
            };
        }
    }
};

utils.mixin(utils, utils);
function Collection(mondo, name, options) {
    if (!(this instanceof Collection)) {
        return new Collection(mondo, name, options);
    }
    // TODO: process arguments

    this._mondo = mondo;
    this.name = name;
    this.options = options || {};

    // TODO: process options
}

// Read operations

Collection.prototype.filter = function(query, fields, options, callback) {
    if ('function' == typeof query) {
        callback = query;
        query = {};
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

    var qb = new QueryBuilder(this._mondo, this, options);
    qb.from(this.name).filter(query);

    if (fields) {
        qb.select(fields);
    }

    utils.forEach(['sort', 'skip', 'limit', 'lean'], function(method) {
        if (options[method]) {
            qb[method](options[method]);
        }
    });

    if (callback) {
        qb.exec(callback);
    }

    return qb;
};

Collection.prototype.find = function(query, fields, options, callback) {
    if ('function' == typeof query) {
        callback = query;
        query = {};
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

    var qb = new QueryBuilder(this._mondo, this, options);
    qb.from(this.name).find(query);

    if (fields) {
        qb.select(fields);
    }

    utils.forEach(['lean'], function(method) {
        if (options[method]) {
            qb[method](options[method]);
        }
    });

    if (callback) {
        qb.exec(callback);
    }

    return qb;
};

Collection.prototype.count = function(query, options, callback) {
    if ('function' == typeof query) {
        callback = query;
        query = {};
        options = undefined;
    } else if ('function' == typeof options) {
        callback = options;
        options = undefined;
    }

    options = options || {};

    var qb = new QueryBuilder(this._mondo, this, options);
    qb.from(this.name).count(query);

    utils.forEach(['skip', 'limit'], function(method) {
        if (options[method]) {
            qb[method](options[method]);
        }
    });

    if (callback) {
        qb.exec(callback);
    }

    return qb;
};

Collection.prototype.distinct = function(key, fields, options, callback) {
    if ('function' == typeof fields) {
        callback = fields;
        fields = undefined;
        options = undefined;
    } else if ('function' == typeof options) {
        callback = options;
        options = undefined;
    }

    options = options || {};

    var qb = new QueryBuilder(this._mondo, this, options);
    qb.from(this.name).distinct(key);

    if (fields) {
        qb.select(fields);
    }

    utils.forEach(['lean'], function(method) {
        if (options[method]) {
            qb[method](options[method]);
        }
    });

    if (callback) {
        qb.exec(callback);
    }

    return qb;
};

Collection.prototype.mapReduce = function(map, reduce, options, callback) {
    if ('function' == typeof options) {
        callback = options;
        options = undefined;
    }

    var qb = new QueryBuilder(this._mondo, this, options);
    qb.from(this.name).mapReduce(map, reduce);

    utils.forEach(['qb', 'sort', 'limit'], function(method) {
        if (options[method]) {
            qb[method](options[method]);
        }
    });

    if (callback) {
        qb.exec(callback);
    }

    return qb;
};

// Write operations

Collection.prototype.insert = function(docs, options, callback) {
    if ('function' == typeof options) {
        callback = options;
        options = undefined;
    }

    options = options || {};

    var qb = new QueryBuilder(this._mondo, this, options);
    qb.from(this.name).insert(docs);

    if (callback) {
        qb.exec(callback);
    }

    return qb;
};

Collection.prototype.update = function(query, doc, options, callback) {
    if ('function' == typeof query) {
        callback = query;
        query = {};
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

    var qb = new QueryBuilder(this._mondo, this, options);
    qb.from(this.name).update(doc).where(query);

    utils.forEach(['upsert', 'multi'], function(method) {
        if (options[method]) {
            qb[method](options[method]);
        }
    });

    if (callback) {
        qb.exec(callback);
    }

    return qb;
};

Collection.prototype.remove = function(query, options, callback) {
    if ('function' == typeof query) {
        callback = query;
        query = {};
        options = undefined;
    } else if ('function' == typeof options) {
        callback = options;
        options = undefined;
    }

    options = options || {};

    var qb = new QueryBuilder(this._mondo, this, options);
    qb.from(this.name).remove(query);

    utils.forEach(['single'], function(method) {
        if (options[method]) {
            qb[method](options[method]);
        }
    });

    if (callback) {
        qb.exec(callback);
    }

    return qb;
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
        return new Mondo(options);
    }


    this._stores = [];
    this.options = options || {};
}

Mondo.version = '0.0.0';
Mondo.Model = Model;
Mondo.Collection = Collection;
Mondo.QueryBuilder = QueryBuilder;
Mondo.stores = {
    _abstract: AbstractStore,
    localStorage: LocalStorageStore,
    sessionStorage: SessionStorageStore,
    nedb: NeDBStore,
    rest: RestStore,
    webSQL: WebSQLStore
};

Mondo.prototype.use = function(store) {
    this._stores.push(store);
};

Mondo.prototype.unuse = function(storeName) {
    for (var i = 0, l = this._stores.length; i < l; i++) {
        if (this._stores[i].name === storeName) {
            this._stores.splice(i, 1);
            return true;
        }
    }

    return false;
};

Mondo.prototype.collection = function(name, options) {
    // process arguments
    if ('string' !== typeof name) {
        options = name;
    }
    var collection = new Collection(this, name, options);
    utils.forEach(this._stores, function(store) {
        store.initCollection(collection);
    });
    return collection;
};

Mondo.prototype.handle = function(collection, query, deferred, options) {
    var stores;

    options = options || {};

    // Select stores
    if (options.stores) {
        stores = utils.filter(this._stores, function(store) {
            return utils.indexOf(options.stores, store.name) > -1;
        });
    } else {
        stores = this._stores;
    }

    var self = this;
    var idx = 0;

    return next();

    function next(err) {
        if (err && self.options.onError) {
            return self.options.onError(err);
        }

        var store = stores[idx++];

        if (!store) {
            return deferred.resolve(null).promise();
        }

        return store.handle(collection, query, deferred, next);
    }
};
function QueryBuilder(mondo, collection, options) {
    if (!(this instanceof QueryBuilder)) {
        return new QueryBuilder(mondo, collection, options);
    }

    this._mondo = mondo;
    this._collection = collection;
    this._options = options;
    this._query = {
        options: {}
    };
}

var methodToProperty = {
    from: 'collectionName',
    setCommand: 'command',
    select: 'fields',
    skip: 'skip',
    limit: 'limit',
    sort: 'sort',
    multi: 'multi',
    setDoc: 'doc'
};

utils.forEach(Object.keys(methodToProperty), function(key) {
    QueryBuilder.prototype[key] = function(value) {
        this._query[methodToProperty[key]] = value;
        return this;
    };
});

QueryBuilder.prototype.where = function(query) {
    if ('undefined' === typeof query) {
        query = {};
    }

    this._query.query = query;
    return this;
};

QueryBuilder.prototype.lean = function(lean) {
    if ('undefined' === typeof lean) {
        lean = true;
    }

    this._query.options.lean = lean;
    return this;
};

QueryBuilder.prototype.toQuery = function() {
    return this._query;
};

QueryBuilder.prototype.exec = function(callback) {
    var deferred = $.Deferred();
    var promise = this._mondo.handle(this._collection, this._query, deferred, this._options);
    if (callback) {
        promise.then(function() {
            callback.apply(null, [null].concat([].slice.call(arguments, 0)));
        }, function(err) {
            callback(err);
        });
    }
    return promise;
};

// Shorthand commands

QueryBuilder.prototype.insert = function(doc) {
    this.setCommand('insert');
    this.setDoc(doc);
    return this;
};

QueryBuilder.prototype.filter = function(query) {
    this.setCommand('filter');
    this.where(query);
    return this;
};

QueryBuilder.prototype.find = function(query) {
    this.setCommand('find');
    this.where(query);
    return this;
};

QueryBuilder.prototype.update = function(doc) {
    this.setCommand('update');
    this.setDoc(doc);
    return this;
};

QueryBuilder.prototype.remove = function(query) {
    this.setCommand('remove');
    this.where(query);
    return this;
};

QueryBuilder.prototype.count = function(query) {
    this.setCommand('count');
    this.where(query);
    return this;
};

QueryBuilder.prototype.mapReduce = function(map, reduce) {
    this.setCommand('mapReduce');
    this._map = map;
    this._reduce = reduce;
    return this;
};

QueryBuilder.prototype.distinct = function(query) {
    this.setCommand('distinct');
    this.where(query);
    return this;
};
function AbstractStore(name, options) {
    if (!(this instanceof AbstractStore)) {
        return new AbstractStore(name);
    }

    this.name = name;
    this.options = options || {};
}

AbstractStore.prototype.initCollection = function(collection) {};

AbstractStore.prototype.handle = function(collection, query, deferred, next) {
    var self = this;

    if ('function' === typeof this.options.beforeHandle) {
        this.options.beforeHandle(collection, query);
    }

    if ('function' === typeof this[query.command]) {
        return this[query.command](collection, query, deferred, function(err) {
            if (err && 'function' === typeof self.options.onError) {
                self.options.onError(err);
            }

            if ('function' === typeof self.options.beforeNext) {
                self.options.beforeNext(collection, query);
            }

            next(err);
        });
    }

    throw new Error('Handler for operation ' + query.command + ' not defined');
};

// Read

utils.forEach(['filter', 'find', 'count', 'mapReduce', 'distinct', 'insert', 'update', 'remove'], function(method) {
    AbstractStore.prototype[method] = function(collection, query, deferred, next) {
        throw new Error('You have not implement ' + this.name + '#' + method + '()');
    };
});
function AbstractWebStorageStore(name, storage, options) {
    if (!(this instanceof AbstractWebStorageStore)) {
        return new AbstractWebStorageStore(name, storage, options);
    }

    AbstractStore.call(this, name, options);
    this._storage = storage;
}

AbstractWebStorageStore.prototype = new AbstractStore();
AbstractWebStorageStore.prototype.constructor = AbstractWebStorageStore;

AbstractWebStorageStore.prototype._get = function(collectionName) {
    var array;

    try {
        array = JSON.parse(this._storage[collectionName]);
    } catch (e) {
        // in case of any exception when parsing, just return an empty array
        array = [];
    }

    if (!utils.isArray(array)) {
        array = [];
    }

    return array;
};

AbstractWebStorageStore.prototype._save = function(collectionName, array) {
    this._storage[collectionName] = JSON.stringify(array);
};

// Read

AbstractWebStorageStore.prototype.filter = function(collection, query, deferred, next) {
    var array = this._get(query.collectionName);
    var docs = array;

    if (options.transform && !query.options.lean) {
        var models = utils.map(docs, options.transform);
    }

    setTimeout(function() {
        deferred.resolve(models);
    }, 0);

    return deferred.promise();
};

// Write

AbstractWebStorageStore.prototype.insert = function(collection, query, deferred, next) {
    var array = this._get(query.collectionName);
    var docs;

    if (utils.isArray(query.doc)) {
        docs = query.doc;
    } else {
        docs = [query.doc];
    }

    array = array.concat(docs);
    this._save(query.collectionName, array);
    var models = utils.map(docs, function(doc) {
        return new Model(doc);
    });
    setTimeout(function() {
        deferred.resolve(models);
    }, 0);

    return next();
};
function IndexedDBStore(options) {
    if (!(this instanceof IndexedDBStore)) {
        return new IndexedDBStore(options);
    }

    AbstractStore.call(this, 'IndexedDB', options);
}

IndexedDBStore.prototype = new AbstractStore();
IndexedDBStore.prototype.constructor = IndexedDBStore;
function LocalStorageStore(options) {
    if (!(this instanceof LocalStorageStore)) {
        return new LocalStorageStore(options);
    }

    AbstractWebStorageStore.call(this, 'LocalStorage', window.localStorage, options);
}

LocalStorageStore.prototype = new AbstractWebStorageStore();
LocalStorageStore.prototype.constructor = LocalStorageStore;
function NeDBStore(options) {
    if (!(this instanceof NeDBStore)) {
        return new NeDBStore(options);
    }

    AbstractStore.call(this, 'NeDB', options);
}

NeDBStore.prototype = new AbstractStore();
NeDBStore.prototype.constructor = NeDBStore;

NeDBStore.prototype.initCollection = function(collection) {
    collection._nedb = new Datastore();
};
function RestStore(url, options) {
    if (!(this instanceof RestStore)) {
        return new RestStore(url, options);
    }

    if ('string' !== typeof url) {
        options = url;
        url = undefined;
    }

    AbstractStore.call(this, 'Rest', options);
    this._rootUrl = url || this.options.url;

    if ('undefined' === typeof this._rootUrl) {
        throw new TypeError('url must not be undefined');
    }
}

RestStore.prototype = new AbstractStore();
RestStore.prototype.constructor = RestStore;

// Read

RestStore.prototype.filter = function(collection, query, deferred, next) {
    var queryUri = new QueryURI(this._rootUrl);
    queryUri.from(query.collectionName).where(query.query);

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

    $.ajax(utils.extend(this.options, {
        type: 'GET',
        url: queryUri.toString(),
        success: function(data, textStatus, jqXHR) {
            if (collection.options.transform && !query.options.lean) {
                data = utils.map(data, function(doc) {
                    return collection.options.transform(doc, collection);
                });
            }

            deferred.resolve(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            deferred.reject(errorThrown);
        }
    }));

    return promise;
};

RestStore.prototype.find = function(collection, query, deferred, next) {
    var queryUri = new QueryURI(this._rootUrl);
    queryUri.from(query.collectionName).setOp('find').where(query.query);

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

    $.ajax(utils.extend(this.options, {
        type: 'GET',
        url: queryUri.toString(),
        success: function(data, textStatus, jqXHR) {
            if (collection.options.transform && !query.options.lean) {
                data = collection.options.transform(data, collection);
            }

            deferred.resolve(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            deferred.reject(errorThrown);
        }
    }));

    return deferred.promise();
};

RestStore.prototype.count = function(collection, query, deferred, next) {
    var queryUri = new QueryURI(this._rootUrl);
    queryUri.from(query.collectionName).setOp('count').where(query.query);

    if (query.options.skip) {
        queryUri.skip(query.options.skip);
    }

    if (query.options.limit) {
        queryUri.limit(query.options.limit);
    }

    $.ajax(utils.extend(this.options, {
        type: 'GET',
        url: queryUri.toString(),
        success: function(data, textStatus, jqXHR) {
            return deferred.resolve(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            deferred.reject(errorThrown);
        }
    }));

    return deferred.promise();
};

RestStore.prototype.mapReduce = function(collection, query, deferred, next) {
    var queryUri = new QueryURI(this._rootUrl);
    queryUri.from(query.collectionName).setOp('map_reduce').map(query.map).reduce(query.reduce).where(query.query);

    if (query.options.sort) {
        queryUri.sort(query.options.sort);
    }

    if (query.options.limit) {
        queryUri.limit(query.options.limit);
    }

    $.ajax(utils.extend(this.options, {
        type: 'GET',
        url: queryUri.toString(),
        success: function(data, textStatus, jqXHR) {
            return deferred.resolve(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            deferred.reject(errorThrown);
        }
    }));

    return deferred.promise();
};

RestStore.prototype.distinct = function(collection, query, deferred, next) {
    var queryUri = new QueryURI(this._rootUrl);
    queryUri.from(query.collectionName).setOp('distinct').key(query.key);

    $.ajax(utils.extend(this.options, {
        type: 'GET',
        url: queryUri.toString(),
        success: function(data, textStatus, jqXHR) {
            if (collection.options.transform && !query.options.lean) {
                data = collection.options.transform(data, collection);
            }

            deferred.resolve(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            deferred.reject(errorThrown);
        }
    }));

    return deferred.promise();
};

// Write

RestStore.prototype.insert = function(collection, query, deferred, next) {
    var queryUri = new QueryURI(this._rootUrl);
    queryUri.from(query.collectionName);

    $.ajax(utils.extend(this.options, {
        type: 'POST',
        url: queryUri.toString(),
        data: JSON.stringify(query.doc),
        success: function(data, textStatus, jqXHR) {
            if (collection.options.transform && !query.options.lean) {
                if (utils.isArray(query.doc)) {
                    data = utils.map(data, function(doc) {
                        return collection.options.transform(doc, collection);
                    });
                } else {
                    data = collection.options.transform(data, collection);
                }
            }

            deferred.resolve(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            deferred.reject(errorThrown);
        }
    }));

    // TODO: pass deferred to next layer
    return next();
};

RestStore.prototype.update = function(collection, query, deferred, next) {
    var queryUri = new QueryURI(this._rootUrl);
    queryUri.from(query.collectionName).where(query.query);

    if (query.options.multi) {
        queryUri.multi(query.options.multi);
    }

    if (query.options.upsert) {
        queryUri.upsert(query.options.upsert);
    }

    $.ajax(utils.extend(this.options, {
        type: 'PATCH',
        url: queryUri.toString(),
        data: JSON.stringify(query.doc),
        success: function(data, textStatus, jqXHR) {
            if (collection.options.transform && !query.options.lean) {
                if (query.options.multi) {
                    data = utils.map(data, function(doc) {
                        return collection.options.transform(doc, collection);
                    });
                } else {
                    data = collection.options.transform(data, collection);
                }
            }

            deferred.resolve(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            deferred.reject(errorThrown);
        }
    }));

    return next();
};

RestStore.prototype.remove = function(collection, query, deferred, next) {
    var queryUri = new QueryURI(this._rootUrl);
    queryUri.from(query.collectionName).where(query.query);

    if (query.options.multi) {
        queryUri.multi(query.options.multi);
    }

    $.ajax(utils.extend(this.options, {
        type: 'DELETE',
        url: queryUri.toString(),
        success: function(data, textStatus, jqXHR) {
            if (collection.options.transform && !query.options.lean) {
                if (query.options.multi) {
                    data = utils.map(data, function(doc) {
                        return collection.options.transform(doc, collection);
                    });
                } else {
                    data = collection.options.transform(data, collection);
                }
            }

            deferred.resolve(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            deferred.reject(errorThrown);
        }
    }));

    return next();
};

function QueryURI(rootUrl) {
    if (!(this instanceof QueryURI)) {
        return new QueryURI(rootUrl);
    }

    this._uri = new URI(rootUrl);
}

QueryURI.prototype.from = function(collectionName) {
    this._uri.filename(collectionName);
    return this;
};

QueryURI.prototype.setOp = function(op) {
    if (op !== 'find') {
        this._uri.addSearch('op', op);
    }
    return this;
};

QueryURI.prototype.where = function(query) {
    if (!utils.isEmpty(query)) {
        this._uri.addSearch('query', JSON.stringify(query));
    }
    return this;
};

QueryURI.prototype.skip = function(skip) {
    this._uri.addSearch('skip', skip);
    return this;
};

QueryURI.prototype.limit = function(limit) {
    this._uri.addSearch('limit', limit);
    return this;
};

QueryURI.prototype.sort = function(sort) {
    this._uri.addSearch('sort', JSON.stringify(sort));
    return this;
};

QueryURI.prototype.toString = function() {
    return this._uri.toString();
};
function SessionStorageStore(options) {
    if (!(this instanceof SessionStorageStore)) {
        return new SessionStorageStore(options);
    }

    AbstractWebStorageStore.call(this, 'SessionStorage', window.sessionStorage, options);
}

SessionStorageStore.prototype = new AbstractWebStorageStore();
SessionStorageStore.prototype.constructor = SessionStorageStore;
function WebSQLStore(options) {
    if (!(this instanceof WebSQLStore)) {
        return new WebSQLStore(options);
    }

    AbstractStore.call(this, 'WebSQL', options);
}

WebSQLStore.prototype = new AbstractStore();
WebSQLStore.prototype.constructor = WebSQLStore;return Mondo;
});