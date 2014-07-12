function Query(collectionName) {
    if (!(this instanceof Query)) {
        return new Query(collectionName);
    }

    this.collectionName = collectionName;
    this.options = {};
    this.op = undefined;
    this.selector = {};
    this.fields = undefined;
    this.doc = undefined;
    this.map = undefined;
    this.reduce = undefined;
}

// Basic operations

Query.prototype.insert = function(doc) {
    this.op = 'insert';
    this.doc = doc;
    return this;
};

Query.prototype.find = function(selector) {
    this.op = 'find';
    this.where(selector);
    return this;
};

Query.prototype.findOne = function(selector) {
    this.op = 'findOne';
    this.where(selector);
    return this;
};

Query.prototype.update = function(doc) {
    this.op = 'update';
    this.doc = doc;
    return this;
};

Query.prototype.remove = function(selector) {
    this.op = 'remove';
    this.where(selector);
    return this;
};

Query.prototype.count = function(selector) {
    this.op = 'count';
    this.where(selector);
    return this;
};

Query.prototype.mapReduce = function(map, reduce) {
    this.op = 'mapReduce';
    this.map = map;
    this.reduce = reduce;
    return this;
};

Query.prototype.distinct = function(selector) {
    this.op = 'distinct';
    this.where(selector);
    return this;
};

// More options

Query.prototype.where = function(selector) {
    if ('undefined' === typeof selector) {
        selector = {};
    }

    this.selector = selector;
    return this;
};

Query.prototype.select = function(fields) {
    this.fields = fields;
    return this;
};

Query.prototype.skip = function(skip) {
    this.options.skip = skip;
    return this;
};

Query.prototype.limit = function(limit) {
    this.options.limit = limit;
    return this;
};

Query.prototype.sort = function(sort) {
    this.options.sort = sort;
    return this;
};

Query.prototype.multi = function(multi) {
    if ('undefined' === typeof multi) {
        multi = true;
    }

    this.options.multi = multi;
    return this;
};

Query.prototype.lean = function(lean) {
    if ('undefined' === typeof lean) {
        lean = true;
    }

    this.options.lean = lean;
    return this;
};

Query.prototype.setDoc = function(doc) {
    this.doc = doc;
    return this;
};