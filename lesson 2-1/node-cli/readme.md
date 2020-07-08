### dpc-cli
* **Usage**<br>
  `dpc init`创建项目<br>
  `dpc gulp compile/develop/build` 构建项目<br>
* **Todo**<br>
  解决构建过程中某些文件没能生成出来的BUG<br>
  完善创建项目，加入下载模板和正规模板<br>
* **项目的整体结构**<br>
├── bin                   
|   ├── cli.js
|   ├── cli-init 
|   ├── cli-gulp
|   ├── cli-xxxxx
├── script                   
|   ├── gulp.js     
|   ├── init.js         
|   └── xxxxxxx.js              
├── .gitignore                   
├── .npmrc
├── README.md
└── package.json 
* **解析命令**<br>
&emsp;在项目的`package.json`中声明`"bin": {"dpc": "bin/cli.js"},`来指定cli的入口。<br>
&emsp;使用`#! /usr/bin/env node`这个语句来确定为cli代码，如果在linux要给予额外的权限<br>
&emsp;在cli.js中引入commander，并且声明init命令，commander会在同级目录中寻找cli-init文件
  ```js
    const program = require("commander");//commander负责创建命令
    //增加新的command可以添加额外的功能
    program
      .usage('<command> [options]')
      .command('init', 'init a project')
      .command('gulp', 'run gulp order')
      .parse(process.argv);
  ```
* **新建项目部分**
    1.  **问询**<br>
    有了第一步的解析后，我们可以在cli-xxx文件中编写命令的调用，这里，我们再抽象逻辑文件到script目录底下，以便更好地分离职责，bin中文件只负责解析命令
    ```js
    const inquirer = require('inquirer');   // inquirer负责问询
    const fse = require('fs-extra');   // fs-extra负责文件的复制
    const memFs = require('mem-fs');
    const { exec } = require('child_process');   // child_process负责执行命令行

    const chalk = require('chalk');   // 改变命令行输出样式
    const ora = require('ora');   // 一个优雅地命令行交互spinner
    //询问基本的项目信息
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
    ```
    1.  **根据模板创建项目**<br>
   模板写入时遵循ejs规范
    ```js
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
    ```
    3.  **进行项目的初始化**<br>
   运行初始化命令
   ```js
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
   ```
* **项目构建部分**
    1. **项目构建流程**
    项目的构建中，我们要考虑到几个点，项目的构建分了几个阶段，一个是开发过程中的，我们经常需要编译项目然后让他在开发环境中运行，然后是发布过程中的，发布过程中除了要编译原有的代码，还需要编译和压缩引用代码，同时还有资源文件文件需要拷贝，因此我们将这个过程分为了几个部分。<br>
    **一。js文件，css文件，html文件的编译**<br>
    ```js
    //分别使用三种不同的插件编译这些代码，同时将他们输入到temp文件夹中，这是因为平常要经常编译这些代码
      const style = () => {
        return src(config.build.paths.styles, {
          base: config.build.src,
          cwd: config.build.src,
        })
          .pipe(plugins.sass({ outputstyle: "expanded" }))
          .pipe(dest(config.build.temp))
          .pipe(bs.reload({ stream: true }));
      };

      const script = () => {
        return src(config.build.paths.scripts, {
          base: config.build.src,
          cwd: config.build.src,
        })
          .pipe(plugins.babel({ presets: ["@babel/preset-env"] }))
          .pipe(dest(config.build.temp))
          .pipe(bs.reload({ stream: true }));
      };

      const page = () => {
        return src(config.build.paths.pages, {
          base: config.build.src,
          cwd: config.build.src,
        })
          .pipe(plugins.swig({data, defaults: { cache: false } }))
          .pipe(dest(config.build.temp))
          .pipe(bs.reload({ stream: true }));
      };
    ```
    **二。图片，资源等文件的拷贝的和压缩**<br>
    ```js
    //分别使用两种不同的插件来拷贝和压缩图片字体和其他公共属性，由于它们不需要经常编译，因此可以放到dist目录作为发布版本使用
      const imagemin = () => {
        return src(config.build.paths.images, {
          base: config.build.src,
          cwd: config.build.src,
        })
          .pipe(plugins.imagemin())
          .pipe(dest(config.build.dist));
      };

      const fonts = () => {
        return src(config.build.paths.fonts, {
          base: config.build.src,
          cwd: config.build.src,
        })
          .pipe(plugins.imagemin())
          .pipe(dest(config.build.dist));
      };

      const public = () => {
        return src("**", {
          base: config.build.public,
          cwd: config.build.public,
        }).pipe(dest(config.build.dist));
      };
    ```
    **三。用户引用的编译的压缩**<br>
    ```js
    //使用userref插件来处理用户引用，同时使用CSS,JS,HTML压缩插件压缩它们，从而获得压缩后的vender.js
      const useref = () => {
      return (
          src(config.build.paths.pages, {
            base: config.build.temp,
            cwd: config.build.temp,
          })
            .pipe(plugins.useref({ searchPath: [config.build.temp, "."] }))
            // html js css
            .pipe(plugins.if(/\.js$/, plugins.uglify()))
            .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
            .pipe(
              plugins.if(
                /\.html$/,
                plugins.htmlmin({
                  collapseWhitespace: true,
                  minifyCSS: true,
                  minifyJS: true,
                })
              )
            )
            .pipe(dest(config.build.dist))
      );
    ```
    **四。组合任务形成命令，添加dev server**<br>
    ```js
    //使用serve来建立一个devserver，其中他会监视文件变化来进行热更新
    const serve = () => {
      watch(config.build.paths.styles, { cwd: config.build.src }, style);
      watch(config.build.paths.scripts, { cwd: config.build.src }, script);
      watch(config.build.paths.pages, { cwd: config.build.src }, page);

      // watch('src/assets/images/**', image)
      // watch('src/assets/fonts/**', font)
      // watch('public/**', extra)
      watch(
        [config.build.paths.images, config.build.paths.fonts],
        { cwd: config.build.src },
        bs.reload
      );

      watch("**", { cwd: config.build.public }, bs.reload);

      bs.init({
        notify: false,
        port: 3080,
        // open: false,
        // files: 'dist/**',
        server: {
          baseDir: [config.build.temp, config.build.dist, config.build.public],
          routes: {
            "/node_modules": "node_modules",
          },
        },
      });
    };
    //组合命令
    const compile = parallel(style, script, page);
    const build = series(
      clean,
      parallel(series(compile, useref), imagemin, fonts, public)
    );
    const develop = series(compile, serve);

    ```
    **五。用户自定义设置**<br>
    ```js
    let config = {
  // default config
    build: {
        src: "src",
        dist: "dist",
        temp: "temp",
        public: "public",
        paths: {
          styles: "assets/styles/*.scss",
          scripts: "assets/scripts/*.js",
          pages: "*.html",
          images: "assets/images/**",
          fonts: "assets/fonts/**",
        }
      },
      data: {
        menus: [],
        pkg: {},
        date: new Date()
      }
    };

    try {
      const loadConfig = require(`${cwd}/pages.config.js`);
      config = Object.assign({}, config, loadConfig);
    } catch (e) {}
    ```
    2. **包装为命令**<br>
    在`cli-gulp.js`中，通过直接传入`gulp.js`的路径和直接调用`glup`命令封封装
    ```js
        process.argv.push('--cwd')
        process.argv.push(process.cwd())
        process.argv.push('--gulpfile')
        process.argv.push(require.resolve("../script/gulp"))
        require('gulp/bin/gulp')
    ```
    ```