var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("table");
var color = require("colors")

const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3308,

    // Your username
    user: "root",

    // Your password
    password: "docker",
    database: "bamazon_DB"
});

connection.connect(err => {
    if (err) throw err;
    store();
});

const store = () => {
    console.log(
`---------------------------------------------------        
                    Welcome
---------------------------------------------------
      Buy everything you need from Bamazon
---------------------------------------------------
        `.red);
        whatsForSale();
        whatToBuy();
    // console.log(output);
    

};

const whatsForSale = () => connection.query("select * from bamazon1", (err, res) => {
    if (err) throw err;
    const bamazonArray = [
        ["Product ID", "Product", "Price"]
    ];
    //will make array that is filled wtih bamazon table values
    for (var i = 0; i < res.length; i++) {
        bamazonArray.push(bamazonObjToArray(res[i]));
    }
    //write table to console
    const output = table.table(bamazonArray);
    console.log('\n----------------------------------------\n  check out the awesome things we have \n' + output.grey + '\n----------------------------------------\n');
});

//fuction to get values and put in an array to display in table, and tanle shoudl be dynamic
const bamazonObjToArray = obj => {
    const objArray = [];
    objArray.push(obj.item_id);
    objArray.push(obj.product_name);
    // objArray.push(obj.department_name);
    objArray.push(obj.price);
    // objArray.push(obj.stock_quantity);
    return objArray;
};

//prompts for customer
const whatToBuy = () => inquirer.prompt([{
        type: "list",
        name: "item",
        message: "What do you want to buy?",
        choices: ["12345", "23456", "34567", "45678", "56789", "67890", "78901", "89012", "90123", "1234"],
    },
    {
        type: "input",
        name: "quantity",
        message: "How many would you like?",
        validate: val => {
            return !!(isNaN(val) === false);
        }
    }
]).then(answer => {
    const whatItem = answer.item;
    const howMany = answer.quantity;
    order(whatItem, howMany);
});

//deal wtih the order
const order = (whatItem, howMany) => {
    //connect to mysql and do stuff with table
    connection.query(`Select * FROM bamazon1 WHERE item_id = ${whatItem}`, function (err, res) {
        if (err) throw (err);
        //if more than stock, can not get
        if (howMany > res[0].stock_quantity) {
            console.log(`Oh no! We don't have that many ${res[0].product_name}. We only have ${res[0].stock_quantity} in stock.`);
            //if less than stock, give price and say congrats
        } else if (howMany <= res[0].stock_quantity) {
            console.log(`Awesome! Your ${res[0].product_name} is available!`);
            const yourPrice = res[0].price * howMany;
            console.log(`The total is ${yourPrice}.`);
            //update my table
            connection.query(`UPDATE bamazon1 SET stock_quantity = stock_quantity - ${howMany} WHERE item_id = ${whatItem}`)
        }
    });
};
