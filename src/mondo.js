function Mondo(options) {
    if (!(this instanceof Mondo)) {
        return new Mondo(options);
    }


    this._stores = [];
    this.options = options || {};
}

Mondo.version = '<%= pkg.version %>';
Mondo.Model = Model;
Mondo.Collection = Collection;
Mondo.QueryBuilder = QueryBuilder;
Mondo.stores = {
    _abstract: AbstractStore,
    localStorage: LocalStorageStore,
    sessionStorage: SessionStorageStore,
    nedb: NeDBStore,
    rest: RestStore,
    webSQL: WebSQLStore
};

Mondo.prototype.use = function(store) {
    this._stores.push(store);
};

Mondo.prototype.unuse = function(storeName) {
    for (var i = 0, l = this._stores.length; i < l; i++) {
        if (this._stores[i].name === storeName) {
            this._stores.splice(i, 1);
            return true;
        }
    }

    return false;
};

Mondo.prototype.collection = function(name, options) {
    // process arguments
    if ('string' !== typeof name) {
        options = name;
    }
    var collection = new Collection(this, name, options);
    utils.forEach(this._stores, function(store) {
        store.initCollection(collection);
    });
    return collection;
};

Mondo.prototype.handle = function(collection, query, deferred, options) {
    var stores;

    options = options || {};

    // Select stores
    if (options.stores) {
        stores = utils.filter(this._stores, function(store) {
            return utils.indexOf(options.stores, store.name) > -1;
        });
    } else {
        stores = this._stores;
    }

    var self = this;
    var idx = 0;

    return next();

    function next(err) {
        if (err && self.options.onError) {
            return self.options.onError(err);
        }

        var store = stores[idx++];

        if (!store) {
            return deferred.resolve(null).promise();
        }

        return store.handle(collection, query, deferred, next);
    }
};