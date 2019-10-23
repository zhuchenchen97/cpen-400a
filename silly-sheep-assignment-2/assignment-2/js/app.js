function Store(initialStock) {
    this.stock = initialStock;
    this.cart = {};

}

Store.prototype.addItemToCart = function(itemName) {
    if (this.stock[itemName].quantity > 0) {
        if (this.cart.hasOwnProperty(itemName)) {
            this.cart[itemName] = this.cart[itemName] + 1;
            this.stock[itemName].quantity = this.stock[itemName].quantity - 1;

        } else {
            this.cart[itemName] = 1;
            alert("Add successfull!");
            this.stock[itemName].quantity = this.stock[itemName].quantity - 1;
        }
    } else {
        alert("Sorry! No item left in the stock!");
    }

}

Store.prototype.removeItemFromCart = function(itemName) {
    if (this.cart.hasOwnProperty(itemName)) {
        if (this.cart[itemName] > 1) {
            this.cart[itemName] = this.cart[itemName] - 1;
            alert("Remove successfull!");
            this.stock[itemName].quantity = this.stock[itemName].quantity + 1;
        } else {
            delete this.cart[itemName];
            alert("Remove successfull!");
        }
    } else {
        alert("No this product in the cart!");
    }
}

var products = {
    "Box1": {
        "label": "Box1",
        "imageUrl": "./images/Box1_$10.png",
        "price": 10,
        "quantity": 5
    },
    "Box2": {
        "label": "Box2",
        "imageUrl": "./images/Box2_$5.png",
        "price": 5,
        "quantity": 5
    },
    "Clothes1": {
        "label": "Clothes1",
        "imageUrl": "./images/Clothes1_$20.png",
        "price": 20,
        "quantity": 5
    },
    "Clothes2": {
        "label": "Clothes2",
        "imageUrl": "./images/Clothes2_$30.png",
        "price": 30,
        "quantity": 5
    },
    "Jeans": {
        "label": "Jeans",
        "imageUrl": "./images/Jeans_$50.png",
        "price": 50,
        "quantity": 5
    },
    "Keyboard": {
        "label": "Keyboard",
        "imageUrl": "./images/Keyboard_$20.png",
        "price": 20,
        "quantity": 5
    },
    "KeyboardCombo": {
        "label": "KeyboardCombo",
        "imageUrl": "./images/KeyboardCombo_$40.png",
        "price": 40,
        "quantity": 5
    },
    "Mice": {
        "label": "Mice",
        "imageUrl": "./images/Mice_$20.png",
        "price": 20,
        "quantity": 5
    },
    "PC1": {
        "label": "PC1",
        "imageUrl": "./images/PC1_$350.png",
        "price": 350,
        "quantity": 5
    },
    "PC2": {
        "label": "PC2",
        "imageUrl": "./images/PC2_$400.png",
        "price": 400,
        "quantity": 5
    },
    "PC3": {
        "label": "PC3",
        "imageUrl": "./images/PC3_$300.png",
        "price": 300,
        "quantity": 5
    },
    "Tent": {
        "label": "Tent",
        "imageUrl": "./images/Tent_$100.png",
        "price": 100,
        "quantity": 5
    }
}

var store = new Store(products);

function  showCart(cart)  {    
    var  cartshow  =  "";     
    for (var  i  in  cart) {     
        var  itemnumber = cart[i];     
        cartshow += i + " : " + itemnumber + "\n";     
    }     
    alert(cartshow); 
}

var inactiveTime = 0;
function startTimer() {
    inactiveTime = window.setTimeout(inactiveAlert, 30000);
}
function inactiveAlert() {
    alert("Hey there! Are you still planning to buy something?")
    window.clearTimeout(inactiveTime);
}
function resetTimer() {
    window.clearTimeout(inactiveTime);
    startTimer();
}
function setupTimers() {
    var btnadd = document.getElementsByClassName("btn-add");
    var btnremove = document.getElementsByClassName("btn-remove");
    for(var i=0;i<btnadd.length;i++){
        btnadd[i].addEventListener("click", resetTimer,false);
        btnremove[i].addEventListener("click", resetTimer,false);
    }
    document.getElementById("btn-show-cart").addEventListener("click", resetTimer,false);

}

setupTimers();
