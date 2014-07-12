function LocalStorageStore(namespace, options) {
    if (!(this instanceof LocalStorageStore)) {
        return new LocalStorageStore(options);
    }
}

LocalStorageStore.prototype = new AbstractStore();
LocalStorageStore.prototype.constructor = LocalStorageStore;

LocalStorageStore.prototype.name = 'LocalStorage';

LocalStorageStore.prototype.namespace = null;

LocalStorageStore.prototype._get = function(collectionName) {
    var array;
    try {
        array = JSON.parse(window.localStorage[collectionName]);
    } catch (e) {
        // in case of any exception when parsing, just return an empty array
        array = [];
    }
    if (!utils.isArray(array)) array = [];

    return array;
};

LocalStorageStore.prototype._save = function(collectionName, array) {
    window.localStorage[collectionName] = JSON.stringify(array);
};

// Read

LocalStorageStore.prototype.find = function(query, deferred, Model, next) {
    var array = this._get(query.collectionName);
    var docs = array;
    var models = utils.filter(docs, function(doc) {
        return new Model(doc);
    });
    deferred.resolve(models);
};

// Write

AbstractStore.prototype.insert = function(query, deferred, Model, next) {
    var array = this._get(query.collectionName);
    var docs;

    if (utils.isArray(query.doc)) {
        docs = query.doc;
    } else {
        docs = [query.doc];
    }

    array.concat(docs);
    this._save(query.collectionName, array);
    var models = utils.filter(docs, function(doc) {
        return new Model(doc);
    });
    deferred.resolve(models);

    next();
};