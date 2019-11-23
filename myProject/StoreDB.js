var MongoClient = require('mongodb').MongoClient;	// require the mongodb driver

/**
 * Uses mongodb v3.1.9 - [API Documentation](http://mongodb.github.io/node-mongodb-native/3.1/api/)
 * StoreDB wraps a mongoDB connection to provide a higher-level abstraction layer
 * for manipulating the objects in our bookstore app.
 */
function StoreDB(mongoUrl, dbName){
	if (!(this instanceof StoreDB)) return new StoreDB(mongoUrl, dbName);
	this.connected = new Promise(function(resolve, reject){
		MongoClient.connect(
			mongoUrl,
			{
				useNewUrlParser: true
			},
			function(err, client){
				if (err) reject(err);
				else {
					console.log('[MongoClient] Connected to '+mongoUrl+'/'+dbName);
					resolve(client.db(dbName));
				}
			}
		)
	});
}

StoreDB.prototype.getProducts = function(queryParams){
// 	return this.connected.then(function(db){
// 		// TODO: Implement functionality
// 		var condition = {};
		
// 		if(queryParams.minPrice && !queryParams.maxPrice){
// 			condition["price"] = {$gte: parseInt(queryParams.minPrice)};
// 		}
// 		if(queryParams.maxPrice && !queryParams.minPrice){
// 			condition["price"] = {$lte: parseInt(queryParams.maxPrice)};
// 		}
// 		if(queryParams.minPrice && queryParams.maxPrice){
// 			condition["price"] = {$gte: parseInt(queryParams.minPrice),$lte: parseInt(queryParams.maxPrice)};
// 		}
// 		if(queryParams.category){
// 			condition["catagory"] = queryParams.catagory;
// 		}


// 		return new Promise(function(resolve,reject){
// 		  db.collection('products').find(condition).toArray(function(error,products){
// 		   if(error){
// 		   	reject(error);
// 		   }
// 		   var productList = {};
// 		   if(products.length!=0){
// 			for(var product in products){
//                productList[product._id] = {
//                		"lable" : product.lable,
// 					"price" : product.price,
// 					"quantity" : product.quantity,
// 					"imageUrl" : product.imageUrl,
// 					"category" :product.category
//                 }
// 			  }
// 		   }
// 			resolve(productList);
//         });
// 	});
// }).catch(function(error){
// 	console.log("error read productList:" +error);
// 	return new Promise(function(resolve,reject){
// 		reject(error);
// 	 });
//    });
var query = {};
    return this.connected.then(function(db) {
        return new Promise(function(resolve, reject) {
            if (queryParams.minPrice != undefined && queryParams.maxPrice != undefined) {
                query.price = {
                    "$gte": parseInt(queryParams.minPrice),
                    "$lte": parseInt(queryParams.maxPrice)
                };

            } else if (queryParams.minPrice != undefined) {
                query.price = {
                    "$gte": parseInt(queryParams.minPrice)
                };
            } else if (queryParams.maxPrice != undefined) {
                query.price = {
                    "$lte": parseInt(queryParams.maxPrice)
                };
            }

            if (queryParams.category != undefined) {
                query.category = { "$eq": queryParams.category };
            }

            db.collection("products").find(query).toArray(function(err, result) {
                if (err) reject(err);
                else {
                    var newResult = {};
                    for (var i = 0; i < result.length; i++) {
                        var id = result[i]["_id"];
                        newResult[id] = result[i];
                        delete newResult[id]["_id"];
                    }
                }
                resolve(newResult);

            });

        })
    })
}

StoreDB.prototype.addOrder = function(order){
	return this.connected.then(function(db){
		// TODO: Implement functionality
		return new Promise(function(resolve,reject){
			var c = order.cart;
	    if(order.client_id==null ||order.client_id==undefined ||typeof(order.client_id) !== "string"){
		  reject("err client_id!");
	    }
	    if(order.cart == null || order.cart == undefined){
		  reject("err cart!");
		  console.log("error")
	    }
	    if(order.total == null|| order.total ==undefined ||typeof(order.total) !== "number"){
		  reject("err total!");
	    }

		   var e = false;
		for(item in c){
				var p = db.collection("products").find({_id:item});
				if(c[item]>p["quantity"]){
					reject("err order quantity!");
					console.log("err order quantity!")
					e = true;
				}
			}
        
         if(!e){
        db.collection("orders").insertOne(order,function(err,res){
			if(err) reject(err);
			else{
				resolve(res);
			}
		});

		for(var id in order.cart){
			var decrement = order.cart[id];
			var whereStr = {"_id":id};
			var updateStr = {$inc: { quantity : -decrement }};

		db.collection("products").updateOne(whereStr, updateStr, function(err, res) {
        if (err) reject(err);
        //db.close();
        });
		}
        }

		}
		
	  )
	})
}

module.exports = StoreDB;