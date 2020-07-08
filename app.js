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
    },
    uniqueQuestion,
  ];
  const info = await inquirer.prompt(questions);
  info.id = generateId();
  return info;
};

const addManager = async () => {
  const managerQ = {
    type: "number",
    message: "Office Number:",
    name: "officeNumber",
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
    type: "number",
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
      choices: ["Add Manager", "Add Engineer", "Add Intern", "Done"],
    },
  ]);

  if (menu.choice === "Done") {
    console.log("Rendering HTML...");
    const html = render(employees);
    makeHtmlFile(html);
  } else if (menu.choice === "Add Manager") {
    await addManager();
    mainMenu();
  } else if (menu.choice === "Add Engineer") {
    await addEngineer();
    mainMenu();
  } else if (menu.choice === "Add Intern") {
    await addIntern();
    mainMenu();
  }
};

mainMenu();
