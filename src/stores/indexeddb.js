function IndexedDBStore(options) {
    if (!(this instanceof IndexedDBStore)) {
        return new IndexedDBStore(options);
    }

    AbstractStore.call(this, 'IndexedDB', options);
}

IndexedDBStore.prototype = new AbstractStore();
IndexedDBStore.prototype.constructor = IndexedDBStore;