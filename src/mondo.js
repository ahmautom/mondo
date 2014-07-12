function Mondo(options) {
    if (!(this instanceof Mondo)) {
        return new Mondo();
    }

    options = options || {};

    this._stores = [];
    this._onError = options.onError;
}

Mondo.version = '<%= pkg.version %>';
Mondo.Model = Model;
Mondo.Collection = Collection;
Mondo.Query = Query;
Mondo.stores = {
    abstract: AbstractStore,
    localStorage: LocalStorageStore,
    sessionStorage: SessionStorageStore,
    nedb: NeDBStore,
    rest: RestStore,
    webSQL: WebSQLStore
};

Mondo.prototype.addStore = function(store) {
    this._stores.push(store);
};

Mondo.prototype.collection = function(name, Model, options) {
    // process arguments
    if ('undefined' === typeof Model) {
        Model = Mondo.Model;
    }
    var collection = new Collection(this, name, Model, options);
    return collection;
};

Mondo.prototype.handle = function(query, deferred, Model, options) {
    var stores;

    options = options || {};

    if (options.stores) {
        stores = utils.filter(this._stores, function(store) {
            return options.stores.indexOf(store.name) > -1;
        });
    } else {
        stores = this._stores;
    }

    var self = this;
    var idx = 0;
    next();

    function next(err) {
        if (err && self._onError) {
            return self._onError(err);
        }

        var store = stores[idx++];

        if (!store) {
            return deferred.resolve(null);
        }

        store.handle(query, deferred, Model, next);
    }
};