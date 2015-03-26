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

RestStore.prototype.filter = function(collection, query, next) {
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

    return Q($.ajax(utils.extend(this.options, {
        type: 'GET',
        url: queryUri.toString()
    }))).then(function(data) {
        if (collection.options.transform && !query.options.lean) {
            data = utils.map(data, function(doc) {
                return collection.options.transform(doc, collection);
            });
        }

        return data;
    });
};

RestStore.prototype.find = function(collection, query, next) {
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

    return Q($.ajax(utils.extend(this.options, {
        type: 'GET',
        url: queryUri.toString()
    }))).then(function(data) {
        if (collection.options.transform && !query.options.lean) {
            return collection.options.transform(data, collection);
        }

        return data;
    });
};

RestStore.prototype.count = function(collection, query, next) {
    var queryUri = new QueryURI(this._rootUrl);
    queryUri.from(query.collectionName).setOp('count').where(query.query);

    if (query.options.skip) {
        queryUri.skip(query.options.skip);
    }

    if (query.options.limit) {
        queryUri.limit(query.options.limit);
    }

    return Q($.ajax(utils.extend(this.options, {
        type: 'GET',
        url: queryUri.toString()
    })));
};

RestStore.prototype.mapReduce = function(collection, query, next) {
    var queryUri = new QueryURI(this._rootUrl);
    queryUri.from(query.collectionName).setOp('map_reduce').map(query.map).reduce(query.reduce).where(query.query);

    if (query.options.sort) {
        queryUri.sort(query.options.sort);
    }

    if (query.options.limit) {
        queryUri.limit(query.options.limit);
    }

    return Q($.ajax(utils.extend(this.options, {
        type: 'GET',
        url: queryUri.toString()
    })));
};

RestStore.prototype.distinct = function(collection, query, next) {
    var queryUri = new QueryURI(this._rootUrl);
    queryUri.from(query.collectionName).setOp('distinct').key(query.key);

    return Q($.ajax(utils.extend(this.options, {
        type: 'GET',
        url: queryUri.toString()
    }))).then(function(data) {
        if (collection.options.transform && !query.options.lean) {
            return collection.options.transform(data, collection);
        }

        return data;
    });
};

// Write

RestStore.prototype.insert = function(collection, query, next) {
    var queryUri = new QueryURI(this._rootUrl);
    queryUri.from(query.collectionName);

    return Q($.ajax(utils.extend(this.options, {
        type: 'POST',
        url: queryUri.toString(),
        data: JSON.stringify(query.doc)
    }))).then(function(data) {
        if (collection.options.transform && !query.options.lean) {
            if (utils.isArray(query.doc)) {
                return utils.map(data, function(doc) {
                    return collection.options.transform(doc, collection);
                });
            } else {
                return collection.options.transform(data, collection);
            }
        }

        return data;
    });
};

RestStore.prototype.update = function(collection, query, next) {
    var queryUri = new QueryURI(this._rootUrl);
    queryUri.from(query.collectionName).where(query.query);

    if (query.options.multi) {
        queryUri.multi(query.options.multi);
    }

    if (query.options.upsert) {
        queryUri.upsert(query.options.upsert);
    }

    return Q($.ajax(utils.extend(this.options, {
        type: 'PATCH',
        url: queryUri.toString(),
        data: JSON.stringify(query.doc)
    }))).then(function(data) {
        if (collection.options.transform && !query.options.lean) {
            if (query.options.multi) {
                return utils.map(data, function(doc) {
                    return collection.options.transform(doc, collection);
                });
            } else {
                return collection.options.transform(data, collection);
            }
        }

        return data;
    });
};

RestStore.prototype.remove = function(collection, query, next) {
    var queryUri = new QueryURI(this._rootUrl);
    queryUri.from(query.collectionName).where(query.query);

    if (query.options.multi) {
        queryUri.multi(query.options.multi);
    }

    return Q($.ajax(utils.extend(this.options, {
        type: 'DELETE',
        url: queryUri.toString()
    }))).then(function(data) {
        if (collection.options.transform && !query.options.lean) {
            if (query.options.multi) {
                return utils.map(data, function(doc) {
                    return collection.options.transform(doc, collection);
                });
            } else {
                return collection.options.transform(data, collection);
            }
        }

        return data;
    });
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