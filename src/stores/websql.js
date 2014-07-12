function WebSQLStore(options) {
    if (!(this instanceof WebSQLStore)) {
        return new WebSQLStore(options);
    }
}

WebSQLStore.prototype = new AbstractStore();
WebSQLStore.prototype.constructor = WebSQLStore;

WebSQLStore.prototype.name = 'WebSQL';