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

Collection.prototype.op = function(op, data, options, callback) {
    if ('function' == typeof op) {
        callback = op;
        op = {};
        data = undefined;
        options = {};
    } else if ('function' == typeof data) {
        callback = data;
        data = undefined;
        options = {};
    } else if ('function' == typeof options) {
        callback = options;
        options = {};
    }

    var qb = new QueryBuilder(this._mondo, this, options);
    qb.from(this.name).setCommand(op).setDoc(data);

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

// Read operations

Collection.prototype.filter = function(query, fields, options, callback) {
    if ('function' == typeof query) {
        callback = query;
        query = {};
        fields = undefined;
        options = {};
    } else if ('function' == typeof fields) {
        callback = fields;
        fields = undefined;
        options = {};
    } else if ('function' == typeof options) {
        callback = options;
        options = {};
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
        options = {};
    } else if ('function' == typeof fields) {
        callback = fields;
        fields = undefined;
        options = {};
    } else if ('function' == typeof options) {
        callback = options;
        options = {};
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
        options = {};
    } else if ('function' == typeof options) {
        callback = options;
        options = {};
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
        options = {};
    } else if ('function' == typeof options) {
        callback = options;
        options = {};
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
        options = {};
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
        options = {};
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
        options = {};
    } else if ('function' == typeof doc) {
        callback = doc;
        doc = undefined;
        options = {};
    } else if ('function' == typeof options) {
        callback = options;
        options = {};
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
        options = {};
    } else if ('function' == typeof options) {
        callback = options;
        options = {};
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