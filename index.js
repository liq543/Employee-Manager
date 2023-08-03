require('dotenv').config();
const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
const cTable = require('console.table');
const figlet = require('figlet');

const startApp = async () => {
    console.log(
      figlet.textSync('Employee Manager', {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      })
    );
};

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME
} = process.env;

let db;

const connectDb = async () => {
  db = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
  });
};

const addDepartment = async () => {
  const answer = await inquirer.prompt({
    name: 'name',
    type: 'input',
    message: 'What is the name of the department?'
  });

  await db.query('INSERT INTO department SET ?', { name: answer.name });
  console.log('Added new department');
  await start();
};

const start = async () => {
  const { action } = await inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'Exit'
    ],
  });

  switch (action) {
    case 'View all departments':
      await viewDepartments();
      break;
    case 'View all roles':
      await viewRoles();
      break;
    case 'View all employees':
      await viewEmployees();
      break;
    case 'Add a department':
      await addDepartment();
      break;
    case 'Add a role':
      await addRole();
      break;
    case 'Add an employee':
      await addEmployee();
      break;
    case 'Update an employee role':
      await updateEmployeeRole();
      break;
    default:
      db.end();
  }
};

startApp();

const viewDepartments = async () => {
    const [rows] = await db.query('SELECT * FROM department');
    console.table(rows);
    await start();
};

const viewRoles = async () => {
  const [rows] = await db.query(
    `SELECT role.id, role.title, role.salary, department.name AS department 
    FROM role 
    LEFT JOIN department ON role.department_id = department.id`
  );
  console.table(rows);
  await start();
};

const viewEmployees = async () => {
  const [rows] = await db.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id 
    LEFT JOIN employee manager ON manager.id = employee.manager_id`
  );
  console.table(rows);
  await start();
};

const addRole = async () => {
  const answer = await inquirer.prompt([
    {
      name: 'title',
      type: 'input',
      message: 'What is the role title?'
    },
    {
      name: 'salary',
      type: 'input',
      message: 'What is the role salary?'
    },
    {
      name: 'department_id',
      type: 'input',
      message: 'What is the department id for the role?'
    }
  ]);

  await db.query('INSERT INTO role SET ?', {
    title: answer.title,
    salary: answer.salary,
    department_id: answer.department_id
  });

  console.log('Added new role');
  await start();
};

const addEmployee = async () => {
  const answer = await inquirer.prompt([
    {
      name: 'first_name',
      type: 'input',
      message: 'What is the employee\'s first name?'
    },
    {
      name: 'last_name',
      type: 'input',
      message: 'What is the employee\'s last name?'
    },
    {
      name: 'role_id',
      type: 'input',
      message: 'What is the role id for the employee?'
    },
    {
      name: 'manager_id',
      type: 'input',
      message: 'What is the manager id for the employee?'
    }
  ]);

  await db.query('INSERT INTO employee SET ?', {
    first_name: answer.first_name,
    last_name: answer.last_name,
    role_id: answer.role_id,
    manager_id: answer.manager_id
  });

  console.log('Added new employee');
  await start();
};

const updateEmployeeRole = async () => {
  const answer = await inquirer.prompt([
    {
      name: 'employee_id',
      type: 'input',
      message: 'What is the id of the employee to update?'
    },
    {
      name: 'role_id',
      type: 'input',
      message: 'What is the new role id for the employee?'
    }
  ]);

  await db.query('UPDATE employee SET ? WHERE ?', [
    {
      role_id: answer.role_id
    },
    {
      id: answer.employee_id
    }
  ]);

  console.log('Updated employee role');
  await start();
};

connectDb()
  .then(() => {
    console.log('Database connected!');
    start();
  })
  .catch((err) => console.log(err));
