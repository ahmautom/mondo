function Model(doc) {
    this.attributes = doc;
}

Model.collection = null;

Model.prototype.defaults = {};

Model.prototype.attributes = {};

Model.prototype.changedAttributes = {};

Model.prototype.idAttribute = '_id';

Model.prototype.set = function(path, val, options) {

};

Model.prototype.get = function(path) {

};

Model.prototype.markModified = function(path) {

};

Model.prototype.isModified = function(path) {

};

Model.prototype.isNew = function() {

};

Model.prototype.update = function(doc, options, callback) {
    this.set(doc);
    this.save(callback);
};

Model.prototype.save = function(callback) {
    this._collection.update({
        _id: this.get('_id')
    }, {
        upsert: true
    }, callback);
};

Model.prototype.remove = function(callback) {
    this._collection.remove({
        _id: this.get('_id')
    }, callback);
};