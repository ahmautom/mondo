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