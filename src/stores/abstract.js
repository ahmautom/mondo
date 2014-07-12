function AbstractStore() {
    if (!(this instanceof AbstractStore)) {
        return new AbstractStore();
    }
}

// beforeHandle
// onError
// onSuccess
// beforeNext

AbstractStore.prototype.name = 'Abstract';

AbstractStore.prototype.handle = function(query, deferred, Model, next) {
    if ('function' === typeof this[query.op]) {
        return this[query.op](query, deferred, Model, next);
    }

    throw new Error('Handler for operation ' + query.op + ' not defined');
};

// Read

AbstractStore.prototype.find = function(query, deferred, Model, next) {
    throw new Error('You have not implement ' + this.name + '#find()');
};

AbstractStore.prototype.findOne = function(query, deferred, Model, next) {
    throw new Error('You have not implement ' + this.name + '#findOne()');
};

AbstractStore.prototype.count = function(query, deferred, Model, next) {
    throw new Error('You have not implement ' + this.name + '#count()');
};

AbstractStore.prototype.mapReduce = function(query, deferred, Model, next) {
    throw new Error('You have not implement ' + this.name + '#mapReduce()');
};

AbstractStore.prototype.distinct = function(query, deferred, Model, next) {
    throw new Error('You have not implement ' + this.name + '#distinct()');
};

// Write

AbstractStore.prototype.insert = function(query, deferred, Model, next) {
    throw new Error('You have not implement ' + this.name + '#insert()');
};

AbstractStore.prototype.update = function(query, deferred, Model, next) {
    throw new Error('You have not implement ' + this.name + '#update()');
};

AbstractStore.prototype.remove = function(query, deferred, Model, next) {
    throw new Error('You have not implement ' + this.name + '#remove()');
};