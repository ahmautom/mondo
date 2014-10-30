function SessionStorageStore(options) {
    if (!(this instanceof SessionStorageStore)) {
        return new SessionStorageStore(options);
    }

    AbstractWebStorageStore.call(this, 'SessionStorage', window.sessionStorage, options);
}

SessionStorageStore.prototype = new AbstractWebStorageStore();
SessionStorageStore.prototype.constructor = SessionStorageStore;