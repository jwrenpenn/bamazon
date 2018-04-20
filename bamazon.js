var mysql = require('mysql');
var inquirer = require('inquirer');
var clear = require('clear');
var tab = require('table-master');

var connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "",
    database: "bamazondb"
})

//Connect To Bamazon database
function dbConnect() {
    connection.connect(function(error) {
        if (error) throw error;
        // clear();
        console.log(connection.threadId);
        customer = connection.threadId;
        productList();
    })  
}

//Build a table of products for sale
function productList() {
    clear();
    console.log('Serving customer ' + customer + '\n'); 
    connection.query('SELECT * FROM products', function(error, result) {
        var choiceArray = [];
        for (var i = 0; i < result.length; i++) {
            choiceArray.push(result[i]);
        }
        console.log('Bamazon Product Catalog\n')
        console.table(choiceArray, "lllrr");
        placeOrder();
    })

}

//Ask for item to order
function placeOrder() {
    inquirer.prompt({
        name: "itemid",
        type: "input",
        message: "\n What item would you like to purchase?"
    }).then(function(item) {
        var query = 'SELECT itemid, productname, price, stockquantity FROM products WHERE ?'
        var itemid = item.itemid;
        connection.query(query, { itemid: itemid }, function(error, result) {
            if (result.length == 0) {
                console.log("\n Unable to find product " + itemid + ". Please check your product and reenter.");
                placeOrder();
            } else {
                var productName = result[0].productname;
                var price = result[0].price;
                var stockQuantity = parseInt(result[0].stockquantity);
                purchaseQuantity(itemid, productName, price, stockQuantity);
            }
        })
    })
};

//Ask for quantity to purchase
function purchaseQuantity(itemid, productName, price, stockQuantity) {
    inquirer.prompt({
        name: "quantity",
        type: "input",
        message: "\n How many would you like to purchase?"        
    }).then(function(quantity) {
        var purchaseQuantity = parseInt(quantity.quantity);
        if (purchaseQuantity > 0) {
            inventoryCheck(itemid, productName, price, stockQuantity, purchaseQuantity);
        } else {
            console.log("\n Please check the quantity to purchase.");
            placeOrder();
        }
    })
}

//Check inventory to see if order can be filled
function inventoryCheck(itemid, productName, price, stockQuantity, purchaseQuantity) {
    if (purchaseQuantity <= stockQuantity) {
        updateInventory(itemid, productName, price, stockQuantity, purchaseQuantity);
    } else {
        console.log("\n We are unable to fill your order for " + productName + ". There's only " + stockQuantity + " available. Please update quantity.");
        placeOrder();
    }
}

//Update inventory after sale
function updateInventory(itemid, productName, price, stockQuantity, purchaseQuantity) {
    stockQuantity -= purchaseQuantity;
    var query = 'UPDATE products SET stockquantity = ? WHERE itemid = ?';
    connection.query(query, [stockQuantity, itemid], function(error, result) {
        if (error) throw error;
        completeOrder(itemid, productName, price, stockQuantity, purchaseQuantity);
    });
}

//Sale summary
function completeOrder(itemid, productName, price, stockQuantity, purchaseQuantity) {
    console.log('\nThank you Customer ' + customer + ' for your order.');
    // console.log(purchaseQuantity);
    console.log( "You are purchasing " + purchaseQuantity + ' ' + productName + " at $" + price.toFixed(2) + ' each.');
    console.log( "Your total is $"  + (price * purchaseQuantity).toFixed(2)); 
    continueShopping();
}

function continueShopping() {
    inquirer.prompt({
        name: "answer",
        type: "input",
        message: "\n Do you need anything else yes (y) or no (n)?"

    }).then(function(answer) {
        var answer = answer.answer.toLowerCase();
        if (answer == 'y') {
            console.log("\n");
            productList();
        } else {
            console.log("\nHave a Great Day.");
            connection.end();
        }
    })  
}




dbConnect();