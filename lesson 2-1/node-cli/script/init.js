#! /usr/bin/env node
const path = require("path");
const inquirer = require("inquirer");
const fs = require("fs");
const fse = require("fs-extra");
const ejs = require("ejs");
const chalk = require("chalk");
const ora = require("ora");
const { exec } = require("child_process");

class Project {
  init = () => {
    inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "Project name?",
          validate(input) {
            if (!input) {
              return "project name shouldn't be empty";
            }
            if (fse.existsSync(input)) {
              return `project ${input} is already there`;
            }
            return true;
          },
        },
      ])
      .then((answers) => {
        const templateDir = path.join(
          path.resolve(__dirname, ".."),
          "local_template"
        );
        const destDir = path.join(process.cwd(), answers.name);
        fs.mkdir(destDir, (err) => {
          if (err) {
            throw err;
          }
        });
        fs.readdir(templateDir, (err, files) => {
          if (err) throw err;
          files.forEach((file) => {
            ejs.renderFile(
              path.join(templateDir, file),
              answers,
              (err, result) => {
                if (err) throw err;
                fs.writeFileSync(path.join(destDir, file), result);
              }
            );
          });
        });
        process.chdir(destDir);
        // npm安装依赖
        console.log();
        const installSpinner = ora(
          `安装项目依赖 ${chalk.green.bold("npm install")}, 请稍后...`
        );
        installSpinner.start();
        exec("npm install", (error, stdout, stderr) => {
          if (error) {
            installSpinner.color = "red";
            installSpinner.fail(chalk.red("安装项目依赖失败"));
            console.log(error);
          } else {
            installSpinner.color = "green";
            installSpinner.succeed("安装依赖成功");
            console.log(`${stderr}${stdout}`);

            console.log();
            console.log(chalk.green("创建项目成功！"));
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
}
module.exports = Project;


