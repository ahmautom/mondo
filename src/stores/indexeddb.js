function IndexedDBStore(options) {
    if (!(this instanceof IndexedDBStore)) {
        return new IndexedDBStore(options);
    }
}

IndexedDBStore.prototype = new AbstractStore();
IndexedDBStore.prototype.constructor = IndexedDBStore;

IndexedDBStore.prototype.name = 'IndexedDB';