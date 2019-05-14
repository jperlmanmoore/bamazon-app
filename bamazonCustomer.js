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
    buyStuff();
});

const buyStuff = () => {
    console.log("--------Welcome! Buy everything you need from Bamazon!--------".red);
    whatsForSale();
    // itemIdQuant();
};

const whatsForSale = () => connection.query("select * from bamazon1", (err, res) => {
    if (err) throw err;
    const bamazonArray = [];
    //will make array that is filled wtih bamazon table values
    for (var i = 0; i < res.length; i++) {
        bamazonArray.push(bamazonObjToArray(res[i]));
    }
    //write table to console
    const output = table.table(bamazonArray);
    console.log("   ID   ||   Product   ||  Price")
    console.log(output.gray);

    // for (var i = 0; i < res.length; i++) {
    //     console.log(`item_id: ${res[i].item_id}, product_name: ${res[i].product_name}, department_name: ${res[i].department_name}, price: ${res[i].price}, stock_quantity ${res[i].stock_quantity}`)
    // }
});



//fuction to get values and put in an array to display in table, and tanle shoudl be dynamic
const bamazonObjToArray = (obj) => {
    const objArray = [];
    objArray.push(obj.item_id);
    objArray.push(obj.product_name);
    // objArray.push(obj.department_name);
    objArray.push(obj.price);
    // objArray.push(obj.stock_quantity);
    return objArray;
};

//prompt for 1) what do they 
var whatWant = () => {
    prompt([{
        type: "list",
        name: "choices",
        message: "What do you want to buy?",
        choices: ["12345", "23456", "34567"],
    }]).then(answer => {
        // console.log(answer.choices);

        // switchCases(answer.choices);
        // appendFile("log.txt", answer.choices, function(err) {
        //     if (err) {
        //         console.log(err)
            // }
        })
    // });
};


//2) how many

//subtract from inventory

//if none in inventory let them know

//some in inventory tell them congrats!