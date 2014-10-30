function LocalStorageStore(options) {
    if (!(this instanceof LocalStorageStore)) {
        return new LocalStorageStore(options);
    }

    AbstractWebStorageStore.call(this, 'LocalStorage', window.localStorage, options);
}

LocalStorageStore.prototype = new AbstractWebStorageStore();
LocalStorageStore.prototype.constructor = LocalStorageStore;