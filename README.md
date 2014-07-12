Mondo
=====

Generic storage provider for browser

Documentation and API
---------------------

[http://doc](http://doc)

Dependencies
------------

Mondo has a hard dependency of `jQuery` >= 1.5

Installation
------------

```shell
$ bower install --save mondo
```

Simple Usage
------------

```javascript
var db = mondo();
db.addStore(mondo.stores.rest('/api'));
db.addStore(mondo.stores.localStorage('myDb'));
var apples = db.collection('apples');

// Traditional
apples.find({price: 899}, function(err, models){
    // Do something with models
});

// Promise
apples.find({price: 899}).then(function(models){
    // Do something with models
}, function(err){
    // Error handling
});
```

Mondo
-----

To create a mondo object

```javascript
var db = mondo(options);
```

#### Options
- onError [Function]

### Mondo#collection(collectionName, [Model], [options])

Create a collection object which you can pass in an optional Model constructor `Model(doc)` so that you will receive the model object after query. If nothing is passed, a basic Model will be used. If you do not want any Model transformation, please use `lean` options when sending query.

#### Options
- queryDefaults

### Mondo#addStore(store)

Collection
----------

Collection provides the following methods which consume the same arguments as the MongoDB driver  
`insert, find, findOne, update, remove, count, distinct, mapReduce`

The follwing methods are also added for convenience.  
`findById, findByIdAndRemove, findByIdAndUpdate`

### Global options
- lean [Boolean] 
- stores [Array<String>]

Stores (Adapters)
-----------------

Mondo send query to storage layers one by one.

```javascript
db.addStore(store);
```

Mondo provides basic stores which can be found in `mondo.stores` namespace

### REST

Store make use of [jQuery's ajax function](//api.jquery.com/category/ajax/) for making request.

```javascript
var store = mondo.stores.rest([url], [options]);
```

#### Options
- url [String] URL of resources root

#### RESTful Resource Server

In order to fully utilize the REST store, your resource server must fullfil the following protocol

|   command  |          HTTP Request        |        Available query parameters       |
|------------|------------------------------|-----------------------------------------|
| find       | GET /collection              | selector, fields, skip, limit, sort     |
| findOne    | GET /collection?op=find_one  | selector, fields, skip, limit, sort     |
| count      | GET /collection?op=count     | selector, skip, limit                   |
| distinct   | GET /collection?op=distinct  | key                                     |
| insert     | POST /collection             | N/A                                     |
| update     | PATCH /collection            | selector, multi, upsert                 |
| remove     | DELETE /collection           | selector, single                        |
| mapReduce  | GET /collection?op=map_reduce| selector, limit, sort, map, reduce      |
| findById   | GET /collection/id           | fields                                  |
| removeById | DELETE /collection/id        | N/A                                     |
| updateById | PATCH /collection/id         | N/A                                     |

### IndexedDB

Store built on top of [IDBWrapper](//github.com/jensarps/IDBWrapper)

```javascript
var store = mondo.stores.indexedDB([options]);
```

### NeDB

Store built on top of [NeDB](//github.com/louischatriot/nedb) (An in-memory storage)

### LocalStorage

### SessionStorage

### WebSQL

Building your own store
-----------------------
To build your own store, please start by referring to `src/stores/abstract.js`. You must implement the `store#handle(query, deferred, Model, next)` method.

### Query object

`query` is a simple query builder which stores the information a query.

Schema of a Query object
```javascript
{
    collectionName: String
    op: String // operation
    criteria: Object
    fields: Object/Array
    doc: Object // applicable when op is insert, update
    map: Function // applicable when op is mapReduce
    reduce: Function // applicable when op is mapReduce
    options: {
        skip: Number
        limit: Number
        sort: Object/Array
        lean: Boolean
    }
}
```

Currently Mondo supports `insert, find, findOne, update, remove, count, mapReduce, distinct` operation

### Deferred object

`deferred` is a standard [jQuery's Deferred Object](//api.jquery.com/category/deferred-object/)

Please call `Deferred#resolve` or `Deferred#reject` whenever applicable

### Model object

`Model` is an ***optional*** constructor function which is passed directly by user, you may need to convert the result document into model object ie.`new Model(doc)` before passing it back to user.

### Next object

Call `next()` to pass to next stores or `next(err)` if you experience error.

### Future thoughts

- Schema?
- Nodejs support?
- solve collection/id/subcollection

Please tell me your thoughts!

## License 

See [License](LICENSE)