const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const util = require("util");
const { connect } = require("http2");
// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "companydb",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  runStuff();
});

connection.query = util.promisify(connection.query);

async function runStuff() {
  var thing = "SELECT title FROM role";
  var result = await connection.query(thing);
  resultArray = [];
  for (var i = 0; i < result.length; i++) {
    console.log(result[i].title);
    resultArray.push(result[i].title);
  }
  inquirer.prompt([
    {
      type: "rawlist",
      name: "role",
      message:
        "What is their role? (enter the id number matching one of the titles above)",
      choices: resultArray,
    },
  ]);
}
