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