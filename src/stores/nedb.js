function NeDBStore(options) {
    if (!(this instanceof NeDBStore)) {
        return new NeDBStore(options);
    }
}

NeDBStore.prototype = new AbstractStore();
NeDBStore.prototype.constructor = NeDBStore;

NeDBStore.prototype.name = 'NeDB';
