function Collection(mondo, collectionName, Model, options) {
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