function AbstractStore(name, options) {
    if (!(this instanceof AbstractStore)) {
        return new AbstractStore(name);
    }

    this.name = name;
    this.options = options || {};
}

AbstractStore.prototype.initCollection = function(collection) {};

AbstractStore.prototype.handle = function(collection, query, deferred, next) {
    var self = this;

    if ('function' === typeof this.options.beforeHandle) {
        this.options.beforeHandle(collection, query);
    }

    if ('function' === typeof this[query.command]) {
        return this[query.command](collection, query, deferred, function(err) {
            if (err && 'function' === typeof self.options.onError) {
                self.options.onError(err);
            }

            if ('function' === typeof self.options.beforeNext) {
                self.options.beforeNext(collection, query);
            }

            next(err);
        });
    }

    throw new Error('Handler for operation ' + query.command + ' not defined');
};

// Read

utils.forEach(['filter', 'find', 'count', 'mapReduce', 'distinct', 'insert', 'update', 'remove'], function(method) {
    AbstractStore.prototype[method] = function(collection, query, deferred, next) {
        throw new Error('You have not implement ' + this.name + '#' + method + '()');
    };
});