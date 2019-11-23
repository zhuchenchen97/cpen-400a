var spawn = require("child_process").spawn;
var http = require("http");
var urlParse = require("url").parse;
var StoreDB = require("./StoreDB.js");
if (process.argv.length < 3) {
    console.log("You need to specify the task - e.g: node test-5.js 3a");
    console.log("You can run all tasks via - node test-5.js all");
    process.exit()
}
var testKey = process.argv[2].toUpperCase();
var PRODUCTS = ["Box1", "Box2", "Clothes1", "Clothes2", "Jeans", "KeyboardCombo", "Keyboard", "Mice", "PC1", "PC2", "PC3", "Tent"].sort();
var TESTS = {
    "3A": {
        max: 3,
        test: () => {
            var marks = 0;
            var comments = [];
            var subtests = [];
            var db = new StoreDB("mongodb://localhost", "cpen400a-bookstore");
            subtests.push(new Promise((resolve, reject) => {
                db.getProducts({}).then(data => {
                    if (data instanceof Array) comments.push('returns an Array - should return a "Products" object');
                    else if (typeof data === "object") {
                        marks += .5;
                        var keys = Object.keys(data).sort();
                        if (isEquivalent(keys, PRODUCTS)) marks += .5;
                        else comments.push("not returning the full product list")
                    } else comments.push('returns a "' + typeof data + '" object - should return a "Products" object');
                    resolve()
                })
            }));
            subtests.push(new Promise((resolve, reject) => {
                db.getProducts({
                    category: "Office"
                }).then(data => {
                    if (typeof data === "object" && !(data instanceof Array)) {
                        var keys = Object.keys(data).sort();
                        if (isEquivalent(keys, ["Box1", "Box2"])) marks += .5;
                        else comments.push("category: Office - returned data is not correctly filtered")
                    } else comments.push('category: Office - returns a "' + typeof data + '" object - should return a "Products" object');
                    resolve()
                })
            }));
            subtests.push(new Promise((resolve, reject) => {
                db.getProducts({
                    minPrice: 200
                }).then(data => {
                    if (typeof data === "object" && !(data instanceof Array)) {
                        var keys = Object.keys(data).sort();
                        if (isEquivalent(keys, ["PC1", "PC2", "PC3"])) marks += .5;
                        else comments.push("minPrice: 200 - returned data is not correctly filtered")
                    } else comments.push('minPrice: 200 - returns a "' + typeof data + '" object - should return a "Products" object');
                    resolve()
                })
            }));
            subtests.push(new Promise((resolve, reject) => {
                db.getProducts({
                    maxPrice: 100
                }).then(data => {
                    if (typeof data === "object" && !(data instanceof Array)) {
                        var keys = Object.keys(data).sort();
                        if (isEquivalent(keys, ["Box1", "Box2", "Clothes1", "Clothes2", "Jeans", "Keyboard", "KeyboardCombo", "Mice", "Tent"].sort())) marks += .5;
                        else comments.push("maxPrice: 100 - returned data is not correctly filtered")
                    } else comments.push('maxPrice: 100 - returns a "' + typeof data + '" object - should return a "Products" object');
                    resolve()
                })
            }));
            subtests.push(new Promise((resolve, reject) => {
                db.getProducts({
                    minPrice: 40,
                    maxPrice: 100,
                    category: "Clothing"
                }).then(data => {
                    if (typeof data === "object" && !(data instanceof Array)) {
                        var keys = Object.keys(data).sort();
                        if (isEquivalent(keys, ["Jeans"])) marks += .5;
                        else comments.push("minPrice: 40, maxPrice: 100, category: Clothing - returned data is not correctly filtered")
                    } else comments.push('minPrice: 40, maxPrice: 100, category: Clothing - returns a "' + typeof data + '" object - should return a "Products" object');
                    resolve()
                })
            }));
            return Promise.all(subtests).then(() => {
                return {
                    marks: marks,
                    comments: comments
                }
            })
        }
    },
    4: {
        max: 2,
        test: () => {
            var marks = 0;
            var comments = [];
            var subtests = [];
            var app = spawn("node", ["index.js"]);
            app.stdout.on("close", code => {});
            var ready = new Promise((resolve, reject) => {
                app.stdout.on("data", chunk => {
                    if (/Node app is running/.test(chunk.toString()) || /server started/.test(chunk.toString())) resolve()
                })
            });
            process.on("exit", code => {
                app.kill()
            });
            subtests.push(ready.then(() => {
                return httpGet("http://localhost:3000/products").then(data => {
                    if (typeof data === "object" && !(data instanceof Array)) {
                        var keys = Object.keys(data).sort();
                        if (isEquivalent(keys, PRODUCTS)) marks += .5;
                        else comments.push("not returning the full product list")
                    } else comments.push('returns a "' + typeof data + '" object - should return a "Products" object');
                    return
                }).catch(error => {
                    comments.push("Error during get request - " + error.message);
                    return
                })
            }));
            subtests.push(ready.then(() => {
                return httpGet("http://localhost:3000/products?category=Technology").then(data => {
                    if (typeof data === "object" && !(data instanceof Array)) {
                        var keys = Object.keys(data).sort();
                        if (isEquivalent(keys, ["Keyboard", "KeyboardCombo", "Mice", "PC1", "PC2", "PC3"].sort())) marks += .5;
                        else comments.push("category: Technology - returned data is not correctly filtered")
                    } else comments.push('category: Technology - returns a "' + typeof data + '" object - should return a "Products" object');
                    return
                }).catch(error => {
                    comments.push("Error during get request - " + error.message);
                    return
                })
            }));
            subtests.push(ready.then(() => {
                return httpGet("http://localhost:3000/products?minPrice=350").then(data => {
                    if (typeof data === "object" && !(data instanceof Array)) {
                        var keys = Object.keys(data).sort();
                        if (isEquivalent(keys, ["PC1", "PC2"])) marks += .5;
                        else comments.push("minPrice: 350 - returned data is not correctly filtered")
                    } else comments.push('minPrice: 350 - returns a "' + typeof data + '" object - should return a "Products" object');
                    return
                }).catch(error => {
                    comments.push("Error during get request - " + error.message);
                    return
                })
            }));
            subtests.push(ready.then(() => {
                return httpGet("http://localhost:3000/products?maxPrice=50").then(data => {
                    if (typeof data === "object" && !(data instanceof Array)) {
                        var keys = Object.keys(data).sort();
                        if (isEquivalent(keys, ["Box1", "Box2", "Clothes1", "Clothes2", "Jeans", "Keyboard", "KeyboardCombo", "Mice"].sort())) marks += .5;
                        else comments.push("maxPrice: 50 - returned data is not correctly filtered")
                    } else comments.push('maxPrice: 50 - returns a "' + typeof data + '" object - should return a "Products" object');
                    return
                }).catch(error => {
                    comments.push("Error during get request - " + error.message);
                    return
                })
            }));
            return Promise.all(subtests).then(() => {
                app.kill();
                return {
                    marks: marks,
                    comments: comments
                }
            })
        }
    },
    7: {
        max: 2,
        test: () => {
            var marks = 0;
            var comments = [];
            var subtests = [];
            var store = new StoreDB("mongodb://localhost", "cpen400a-bookstore");
            subtests.push(new Promise((resolve, reject) => {
                var check_id = String(Math.floor(1e7 * Math.random()));
                store.addOrder({
                    client_id: check_id,
                    cart: {
                        Box1: 0,
                        Box2: 0,
                        Clothes1: 0
                    },
                    total: 100
                }).then(data => {
                    marks += .5;
                    store.connected.then(db => {
                        db.collection("orders").findOne({
                            client_id: check_id
                        }).then(found => {
                            if (found && found.client_id === check_id) marks += .5;
                            else comments.push("Order not inserted into the database");
                            resolve()
                        })
                    })
                }, error => {
                    comments.push("Error during addOrder - " + error.message);
                    resolve()
                })
            }));
            subtests.push(new Promise((resolve, reject) => {
                var check_id = String(Math.floor(1e7 * Math.random()));
                store.addOrder({
                    client_id: check_id,
                    tot: 100
                }).then(data => {
                    comments.push("should validate the order argument");
                    resolve()
                }, error => {
                    marks += .5;
                    resolve()
                })
            }));
            subtests.push(new Promise((resolve, reject) => {
                store.connected.then(db => {
                    var collection = db.collection("products");
                    collection.find({
                        quantity: {
                            $gte: 1
                        }
                    }).toArray().then(found => {
                        if (found.length > 0) {
                            var product = Object.assign({}, found[0]);
                            var cart = {};
                            cart[product._id] = 1;
                            store.addOrder({
                                client_id: String(Math.floor(1e7 * Math.random())),
                                cart: cart,
                                total: product.price
                            }).then(data => {
                                collection.findOne({
                                    _id: product._id
                                }).then(found => {
                                    if (found && found.quantity === product.quantity - 1) marks += .5;
                                    else comments.push("Product quantity should be decremented");
                                    resolve()
                                })
                            }, error => {
                                comments.push("Error during addOrder - " + error.message);
                                resolve()
                            })
                        } else {
                            reject("Cannot proceed with this test because there is no product with quantity >= 1. Please reset the DB")
                        }
                    })
                })
            }));
            return Promise.all(subtests).then(() => {
                return {
                    marks: marks,
                    comments: comments
                }
            })
        }
    },
    8: {
        max: 2,
        test: () => {
            var marks = 0;
            var comments = [];
            var subtests = [];
            var app = spawn("node", ["index.js"]);
            app.stdout.on("close", code => {});
            var ready = new Promise((resolve, reject) => {
                app.stdout.on("data", chunk => {
                    if (/Node app is running/.test(chunk.toString()) || /server started/.test(chunk.toString())) resolve()
                })
            });
            process.on("exit", code => {
                app.kill()
            });
            subtests.push(ready.then(() => {
                var check_id = String(Math.floor(1e7 * Math.random()));
                return httpPost("http://localhost:3000/checkout", {
                    client_id: check_id,
                    cart: {
                        Box1: 0,
                        Box2: 0,
                        Clothes1: 0
                    },
                    total: 0
                }).then(data => {
                    marks += 1;
                    return
                }, error => {
                    comments.push("Server endpoint rejected the request. Server message: " + error.message);
                    return
                })
            }));
            subtests.push(ready.then(() => {
                var check_id = String(Math.floor(1e7 * Math.random()));
                return httpPost("http://localhost:3000/checkout", {
                    cid: check_id,
                    tot: 10
                }).then(data => {
                    comments.push("should validate the POST request payload and respond with status 500 if payload is invalid");
                    return
                }, error => {
                    marks += .5;
                    if (error.statusCode === 500) marks += .5;
                    else comments.push("POST request failed as expected, but with incorrect status code " + error.statusCode);
                    return
                })
            }));
            return Promise.all(subtests).then(() => {
                app.kill();
                return {
                    marks: marks,
                    comments: comments
                }
            })
        }
    }
};
if (testKey === "ALL") {
    runTests(["3A", "4", "7", "8"]).then(suite => {
        var msg = Object.keys(suite).sort().map(key => {
            return key + ": " + suite[key].marks.toFixed(1) + "/" + TESTS[key].max + "\n" + suite[key].comments.map(txt => {
                return "    " + txt
            }).join("\n")
        }).join("\n");
        console.log(msg)
    }, error => {
        console.log(error)
    }).then(() => {
        process.exit()
    })
} else {
    try {
        TESTS[testKey].test().then(result => {
            console.log("Task " + testKey + ": " + result.marks.toFixed(1) + "/" + TESTS[testKey].max + "\n" + result.comments.join("\n"));
            process.exit()
        }).catch(function(error) {
            console.log(error.message)
        })
    } catch (error) {
        if (error.name === "TypeError") {
            console.log("Test " + testKey + " does not exist")
        } else {
            console.log("Task " + testKey + " encountered an Error");
            console.error(error)
        }
    }
}

function isEquivalent(list1, list2) {
    return list1.length === list2.length && list1.reduce((pass, item, index) => {
        return pass && item === list2[index]
    }, true)
}

function runTests(keys, suite) {
    if (!suite) suite = {};
    if (keys.length > 0) {
        var testKey = keys[0];
        try {
            return TESTS[testKey].test().then(result => {
                suite[testKey] = result;
                return runTests(keys.slice(1), suite)
            }).catch(function(error) {
                console.log(error.message)
            })
        } catch (error) {
            console.log("Task " + testKey + " encountered an Error");
            console.error(error);
            return Promise.resolve(suite)
        }
    } else return Promise.resolve(suite)
}

function httpGet(url) {
    return new Promise((resolve, reject) => {
        http.get(url, res => {
            let error;
            if (res.statusCode !== 200) {
                error = new Error(`Status Code: ${res.statusCode}`);
                error.statusCode = res.statusCode
            }
            if (error) {
                reject(error);
                res.resume();
                return
            }
            res.setEncoding("utf8");
            let rawData = "";
            res.on("data", chunk => {
                rawData += chunk
            });
            res.on("end", () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    resolve(parsedData)
                } catch (e) {
                    resolve(rawData)
                }
            })
        }).on("error", e => {
            reject(e)
        })
    })
}

function httpPost(url, data) {
    return new Promise((resolve, reject) => {
        var parsed = urlParse(url);
        const postData = JSON.stringify(data);
        const options = {
            hostname: parsed.hostname,
            port: parseInt(parsed.port),
            path: parsed.path,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(postData)
            }
        };
        const req = http.request(options, res => {
            let error;
            if (res.statusCode !== 200) {
                error = new Error(`Error ${res.statusCode} - ${res.statusMessage}`);
                error.statusCode = res.statusCode
            }
            if (error) {
                reject(error);
                res.resume();
                return
            }
            res.setEncoding("utf8");
            let rawData = "";
            res.on("data", chunk => {
                rawData += chunk
            });
            res.on("end", () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    resolve(parsedData)
                } catch (e) {
                    resolve(rawData)
                }
            })
        });
        req.on("error", e => {
            reject(e)
        });
        req.write(postData);
        req.end()
    })
}