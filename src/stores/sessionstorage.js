function SessionStorageStore(options) {
    if (!(this instanceof SessionStorageStore)) {
        return new SessionStorageStore(options);
    }
}
SessionStorageStore.prototype = new AbstractStore();
SessionStorageStore.prototype.constructor = SessionStorageStore;

SessionStorageStore.prototype.name = 'SessionStorage';

SessionStorageStore.prototype.namespace = null;

SessionStorageStore.prototype._get = function(collectionName) {
    var array;
    try {
        array = JSON.parse(window.sessionStorage[collectionName]);
    } catch (e) {
        // in case of any exception when parsing, just return an empty array
        array = [];
    }
    if (!utils.isArray(array)) array = [];

    return array;
};

SessionStorageStore.prototype._save = function(collectionName, array) {
    window.sessionStorage[collectionName] = JSON.stringify(array);
};

// Read

SessionStorageStore.prototype.find = function(query, deferred, Model, next) {
    var array = this._get(query.collectionName);
    var docs = array;
    var models = utils.filter(docs, function(doc) {
        return new Model(doc);
    });

    setTimeout(function() {
        deferred.resolve(models);
    }, 0);
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

    setTimeout(function() {
        deferred.resolve(models);
    }, 0);

    next();
};