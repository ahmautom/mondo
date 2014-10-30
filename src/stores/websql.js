function WebSQLStore(options) {
    if (!(this instanceof WebSQLStore)) {
        return new WebSQLStore(options);
    }

    AbstractStore.call(this, 'WebSQL', options);
}

WebSQLStore.prototype = new AbstractStore();
WebSQLStore.prototype.constructor = WebSQLStore;