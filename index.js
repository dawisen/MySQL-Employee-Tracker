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
  runQuestions();
});

connection.query = util.promisify(connection.query);

function runQuestions() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Departments",
        "View All Roles",
        "Add Employee",
        "Add a Department",
        "Add a Role",
        "Update Employee Role",
        "Exit",
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View All Employees":
          employeeList();
          runQs();
          break;

        case "View All Departments":
          showDepartmentNames();
          runQs();
          break;
        case "View All Roles":
          viewRoles();
          runQs();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Add a Department":
          addDepartment();
          break;
        case "Add a Role":
          addRole();
          break;
        case "Update Employee Role":
          // updateRole();
          break;
        case "Exit":
          console.log("Exiting program");
          connection.end();
          break;
      }
    });
}

function employeeList() {
  var query =
    "SELECT employee.id, first_name, last_name, title, salary, department_name FROM employee INNER JOIN role, department ";
  query +=
    "WHERE (employee.role_id = role.id) && (role.department_id = department.id)";
  connection.query(query, function (err, res) {
    return console.table(res);
  });
}

function showDepartmentNames() {
  var query = "SELECT department_name FROM department";
  connection.query(query, function (err, res) {
    return console.table(res);
  });
}

function viewRoles() {
  var query = "SELECT title FROM role";
  connection.query(query, function (err, res) {
    return console.table(res);
  });
}

function runQs() {
  setTimeout(runQuestions, 400);
}

function addEmployee() {
  var query = "SELECT title, id FROM role";

  connection.query(query).then((roles) => {
    console.table(roles);
    inquirer
      .prompt([
        {
          type: "input",
          name: "role",
          message:
            "What is their role? (enter the id number matching one of the titles above)",
        },
        {
          type: "input",
          name: "firstName",
          message: "What is their first name?",
        },
        {
          type: "input",
          name: "lastName",
          message: "What is their last name?",
        },
      ])
      .then((res) => {
        // console.log("response retrieved", response);
        var query = `INSERT INTO employee (first_name, last_name, role_id) VALUES ('${res.firstName}', '${res.lastName}', ${res.role})`;
        connection
          .query(query)
          .catch((err) => {
            console.log("ERROR", err);
          })
          .then(() => {
            console.log("Successfully created new employee!");
            runQs();
          });
      });
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "deptName",
        message: "Please enter new department name",
      },
    ])
    .then((res) => {
      var query = `INSERT INTO department (department_name) VALUES ('${res.deptName}')`;
      connection
        .query(query)
        .catch((err) => {
          console.log("ERROR", err);
        })
        .then(() => {
          console.log("Successfully added new department!");
          runQs();
        });
    });
}

function addRole() {
  var query = "SELECT * FROM department";
  connection.query(query).then((departments) => {
    console.table(departments);
    inquirer
      .prompt([
        {
          type: "input",
          name: "departmentID",
          message:
            "What department is this role in? (enter the id number matching one of the titles above)",
        },
        {
          type: "input",
          name: "roleName",
          message: "Please enter new role name",
        },
        {
          type: "input",
          name: "salary",
          message: "Please enter the salary (without commas)",
        },
      ])
      .then((res) => {
        var query = `INSERT INTO role (title, salary, department_id) VALUES ('${res.roleName}', '${res.salary}', ${res.departmentID})`;
        connection
          .query(query)
          .catch((err) => {
            console.log("ERROR", err);
          })
          .then(() => {
            console.log("Successfully added new role!");
            runQs();
          });
      });
  });
}

function getEmployees() {
  var query =
    "SELECT first_name, last_name, title, salary, department_name FROM employee INNER JOIN role, department ";
  query +=
    "WHERE (employee.role_id = role.id) && (role.department_id = department.id)";
  return connection.query(query);
}

function updateRole() {
  getEmployees()
    .then((employees) => {
      console.log(employees);
      employee_choices = [];
      for (employee in employees) {
        console.log("this is the employee:", employee);
        employee_choices.push(employee.title);
      }
      inquirer.prompt([
        {
          type: "rawlist",
          name: "employee",
          message:
            "Please select the employee you want to update",
          choices: employee_choices,
        },
      ]);
    })
    .then((selectedEmployee) => {
      console.log("this is the response from employee choice", selectedEmployee);
      var query = "SELECT title, id FROM role";
      connection.query(query).then((roles) => {
        role_choices = [];
        for (index in roles) {
          role_choices.push(index.title);
          console.log("this is the roles array", role_choices);
        }
        inquirer.prompt([
          {
            type: "rawlist",
            name: "role",
            message:
              "What is their new role?",
            choices: role_choices,
          },
        ]).then((selectedRole) => {
          console.log("this is the response from selected role", selectedRole);
          var query = "UPDATE employee SET role_id=? WHERE last_name=?";
          connection.query(query)
            .catch((err) => {
              console.log("ERROR", err)
                .then((roles) => {
                  console.log("Employee updated!")
        
                });
            })

        });
    })
  })
}
