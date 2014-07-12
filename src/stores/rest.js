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