function Store(initialStock) {
    this.stock = initialStock;
    this.cart = {};
    this.onUpdate = null;

}
Store.prototype.addItemToCart = function(itemName) {
    if (this.stock[itemName].quantity > 0) {
        if (this.cart.hasOwnProperty(itemName)) {
            this.cart[itemName] = this.cart[itemName] + 1;
            this.stock[itemName].quantity = this.stock[itemName].quantity - 1;

        } else {
            this.cart[itemName] = 1;
            this.stock[itemName].quantity = this.stock[itemName].quantity - 1;
        }
    } else {
        alert("Sorry! No item left in the stock!");
    }
    this.onUpdate(itemName);

}

Store.prototype.removeItemFromCart = function(itemName) {
    if (this.cart.hasOwnProperty(itemName)) {
        if (this.cart[itemName] > 1) {
            this.cart[itemName] = this.cart[itemName] - 1;
            this.stock[itemName].quantity = this.stock[itemName].quantity + 1;
        } else {
            delete this.cart[itemName];
        }
    } else {
        alert("No this product in the cart!");
    }
    this.onUpdate(itemName);
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

store.onUpdate = function(itemName) {

    var productId = document.getElementById('product-' + itemName);
    renderProduct(productId, store, itemName);


    renderCart(document.getElementById("modal-content"), store);


}

function  showCart(cart)  {    
    var modal = document.getElementById('modal');
    modal.style.display = 'block';
    renderCart(document.getElementById('modal-content'), store);

}

function hideCart(cart) {
    var modal = document.getElementById('modal');
    modal.style.display = 'none';
}

var inactiveTime = 0;

function startTimer() {
    inactiveTime = window.setTimeout(inactiveAlert, 300000);
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
    for (var i = 0; i < btnadd.length; i++) {
        btnadd[i].addEventListener("click", resetTimer, false);
        btnremove[i].addEventListener("click", resetTimer, false);
    }
    document.getElementById("btn-show-cart").addEventListener("click", resetTimer, false);

}


setupTimers();


function renderProduct(container, storeInstance, itemName) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    var img = document.createElement('img');
    img.src = storeInstance.stock[itemName].imageUrl;
    img.alt = storeInstance.stock[itemName].label;
    container.appendChild(img);

    var div = document.createElement('div');
    div.className = 'price';
    div.textContent = '$' + storeInstance.stock[itemName].price;
    container.appendChild(div);



    if (storeInstance.stock[itemName].quantity > 0) {
        var addBtn = document.createElement('button');
        addBtn.className = 'btn-add';
        addBtn.setAttribute('onclick', 'store.addItemToCart(\"' + itemName + '\")');
        addBtn.textContent = 'Add';
        container.appendChild(addBtn);
    }
    if (storeInstance.cart[itemName] > 0) {
        var removeBtn = document.createElement('button');
        removeBtn.className = 'btn-remove';
        removeBtn.setAttribute('onclick', 'store.removeItemFromCart(\"' + itemName + '\")');
        removeBtn.textContent = 'Remove';
        container.appendChild(removeBtn);
    }



    var span = document.createElement('span');
    span.textContent = itemName;
    container.appendChild(span);

    return container;

}

function renderProductList(container, storeInstance) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    var ul = document.createElement('ul');
    ul.id = 'productList';
    for (itemName in storeInstance.stock) {
        var li = document.createElement('li');
        li.className = 'product';
        li.id = 'product-' + itemName;
        renderProduct(li, storeInstance, itemName);
        ul.appendChild(li);
    }

    container.appendChild(ul);
}



renderProductList(document.getElementById("productView"), store);


function renderCart(container, storeInstance) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    var cartTable = document.createElement('table');
    cartTable.id = 'cartTable';
    var firstRow = document.createElement('tr');
    var column1 = document.createElement('td');
    var column2 = document.createElement('td');
    var column3 = document.createElement('td');
    var column4 = document.createElement('td');
    column1.textContent = 'Item';
    column2.textContent = 'Amount';
    column3.textContent = 'Price';
    firstRow.appendChild(column1);
    firstRow.appendChild(column2);
    firstRow.appendChild(column3);
    firstRow.appendChild(column4);
    cartTable.appendChild(firstRow);

    var totalPrice = 0;
    for (itemName in storeInstance.cart) {
        var itemRow = document.createElement('tr');
        var itemNameshow = document.createElement('td');
        itemNameshow.textContent = storeInstance.stock[itemName].label;
        var amount = document.createElement('td');
        amount.textContent = storeInstance.cart[itemName];
        var price = document.createElement('td');
        price.textContent = '$' + storeInstance.cart[itemName] * storeInstance.stock[itemName].price;
        var incBtn = document.createElement('button');
        incBtn.className = 'btn-inc';
        incBtn.setAttribute('onclick', 'store.addItemToCart(\"' + itemName + '\")');
        incBtn.textContent = '+';

        var decBtn = document.createElement('button');
        decBtn.className = 'btn-dec';
        decBtn.setAttribute('onclick', 'store.removeItemFromCart(\"' + itemName + '\")');
        decBtn.textContent = '-';

        itemRow.appendChild(itemNameshow);
        itemRow.appendChild(amount);
        itemRow.appendChild(price);
        itemRow.appendChild(incBtn);
        itemRow.appendChild(decBtn);
        cartTable.appendChild(itemRow);

        totalPrice += storeInstance.cart[itemName] * storeInstance.stock[itemName].price;

    }

    var totalPriceRow = document.createElement('tr');
    var totalPriceshow = document.createElement('td');
    totalPriceshow.textContent = "Total Price: $" + totalPrice;
    totalPriceshow.setAttribute('colspan', '4');
    totalPriceRow.appendChild(totalPriceshow);
    cartTable.appendChild(totalPriceRow);
    container.appendChild(cartTable);

}

document.onkeydown = function(event) {
    if (event.keyCode == 27) {
        hideCart();
    }
}