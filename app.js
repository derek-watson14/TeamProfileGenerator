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
const generalQuestions = [
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
];

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
const generateId = () => Math.random().toString(36).substr(2, 9);

const askEmployeeInfo = async (uniqueQuestion) => {
  const questions = [...generalQuestions, uniqueQuestion];
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
    console.log("Rendering pages...");
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

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
