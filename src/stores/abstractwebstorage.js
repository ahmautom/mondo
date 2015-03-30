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

AbstractWebStorageStore.prototype.filter = function(collection, query, next) {
    var docs = this._get(query.collectionName);
    return Q.Promise(function(resolve, reject, notify) {
        if (options.transform && !query.options.lean) {
            resolve(utils.map(docs, options.transform));
        }

        resolve(docs);
    });
};

// Write

AbstractWebStorageStore.prototype.insert = function(collection, query, next) {
    var array = this._get(query.collectionName);
    var promise = Q.Promise(function(resolve, reject, notify) {
        var docs = utils.isArray(query.doc) ? query.doc : [query.doc];
        array = array.concat(docs);
        this._save(query.collectionName, array);
        var models = utils.map(docs, function(doc) {
            return new Model(doc);
        });
        resolve(models);
    });
    return Q.all([promise, next()]);
};