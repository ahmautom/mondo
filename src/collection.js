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

Collection.prototype.filter = function(selector, fields, options, callback) {
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

    var qb = new QueryBuilder(this._mondo, this, options);
    qb.from(this.name).filter(selector);

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

    var qb = new QueryBuilder(this._mondo, this, options);
    qb.from(this.name).find(selector);

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

    var qb = new QueryBuilder(this._mondo, this, options);
    qb.from(this.name).count(selector);

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

    var qb = new QueryBuilder(this._mondo, this, options);
    qb.from(this.name).update(doc).where(selector);

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

    var qb = new QueryBuilder(this._mondo, this, options);
    qb.from(this.name).remove(selector);

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