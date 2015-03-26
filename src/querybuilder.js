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
    var promise = this._mondo.handle(this._collection, this._query, this._options);
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