const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const employees = [];

const generateId = () => Math.random().toString(36).substr(2, 9);

const validateEmail = async (input) => {
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input)) {
    return "Invalid email address";
  } else {
    return true;
  }
};

const validateNumber = async (input) => {
  if (isNaN(parseInt(input))) {
    return "Not a number";
  } else {
    return true;
  }
};

const askEmployeeInfo = async (uniqueQuestion) => {
  const questions = [
    {
      type: "input",
      message: "Name:",
      name: "name",
    },
    {
      type: "input",
      message: "Email:",
      name: "email",
      validate: validateEmail,
    },
    uniqueQuestion,
  ];
  const info = await inquirer.prompt(questions);
  info.id = generateId();
  return info;
};

const addManager = async () => {
  const managerQ = {
    type: "input",
    message: "Office Number:",
    name: "officeNumber",
    validate: validateNumber,
  };
  const { name, id, email, officeNumber } = await askEmployeeInfo(managerQ);
  employees.push(new Manager(name, id, email, officeNumber));
};

const addEngineer = async () => {
  const engineerQ = {
    type: "input",
    message: "Github Username:",
    name: "github",
  };
  const { name, id, email, github } = await askEmployeeInfo(engineerQ);
  employees.push(new Engineer(name, id, email, github));
};

const addIntern = async () => {
  const internQ = {
    type: "input",
    message: "School:",
    name: "school",
  };
  const { name, id, email, school } = await askEmployeeInfo(internQ);
  employees.push(new Intern(name, id, email, school));
};

const makeHtmlFile = (html) => {
  fs.mkdir(OUTPUT_DIR, { recursive: true }, (err) => {
    if (err) throw err;
  });
  fs.writeFile(outputPath, html, (err) => {
    if (err) throw err;
  });
};

const mainMenu = async () => {
  const menu = await inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      name: "choice",
      choices: ["Add Manager", "Add Engineer", "Add Intern", "Render HTML"],
    },
  ]);

  switch (menu.choice) {
    case "Add Manager":
      await addManager();
      mainMenu();
      break;
    case "Add Engineer":
      await addEngineer();
      mainMenu();
      break;
    case "Add Intern":
      await addIntern();
      mainMenu();
      break;
    case "Render HTML":
      console.log("Rendering HTML...");
      const html = render(employees);
      makeHtmlFile(html);
      break;
  }
};

mainMenu();
