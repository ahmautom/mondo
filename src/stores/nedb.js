function NeDBStore(options) {
    if (!(this instanceof NeDBStore)) {
        return new NeDBStore(options);
    }

    AbstractStore.call(this, 'NeDB', options);
}

NeDBStore.prototype = new AbstractStore();
NeDBStore.prototype.constructor = NeDBStore;

NeDBStore.prototype.initCollection = function(collection) {
    collection._nedb = new Datastore();
};