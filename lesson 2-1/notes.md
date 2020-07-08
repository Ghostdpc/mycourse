# 模块二
## 前端工程化实战 
***
  ### 开发脚手架及封装自动化构建工作流 
  #### **前端工程化:**
  &emsp;工程化遵循一定的标准或者规范，提高效率降低成本的手段。前端工程化是为了更加有效率的解决前端开发过程中的问题，例如自动化解决各种各样重复的建立项目，发布版本的这类机械性的操作，通过工程化制定标准和规范，提高整体项目代码风格的统一性，提高代码质量。还可以利于前端开发过程中模块化的开发，以及降低对后端的依赖等等。其目标是减低开发成本，提高成品质量。常见的工程化的工具有各类的脚手架，例如`vue-cli` ,`create-react-app`等，这些脚手架能够帮助开发者完成许多繁杂的工作，比如说开发服务器，代码格式检查，方便快捷的建立规范的项目等。当然这些工具都是工程化的体现，而不是工程化的全部，工程化的全部还包括有项目管理，例如常见的项目团队职务分配，pm,测试，工程师等等这些，还有开发的思想，比如模块化的前端开发，大前端的思想，还有常见的敏捷开发的开发方式，这些都是工程化的一部分。（当然也能说是软件工程的一部分）
  #### **自动化创建项目和自动化构建工作流**
  &emsp;在创建项目的过程中我们会经常会使用到脚手架来创建一个新的项目，这些脚手架最主要的意义除了自动化的创建项目，还有就是提供了一个特定类型的项目的基本规范，这样所有的项目的风格都是统一的。本质上而言，创建项目的脚手架需要做的事情很简单，就是帮你依照某些模板，来建立起一个开发项目的基本框架。<br>
  *`Yeoman`*<br>
  &emsp;`yeoman`是一个可以用来建立脚手架的脚手架，他的基本用法其实就两个步骤: <br>
  &emsp; ***1.确定需求并选择相应generator并安装***<br>
  &emsp; ***2.利用generator作为项目脚手架来创建项目，使用的是yo命令***<br>
  ```js
  //generator例子
  const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  prompting () {
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname
      }
    ])
    .then(answers => {
      this.answers = answers
    })
  }

  writing () {
    // 把每一个文件都通过模板转换到目标路径

    const templates = [
        //下面可以写入文件
      '.browserslistrc',
      'src/components/HelloWorld.vue',
      //.......
    ]

    templates.forEach(item => {
      // item => 每个文件路径
      // 这是封装后的fs方法，这里将数据传入模板
      this.fs.copyTpl(
        this.templatePath(item),
        this.destinationPath(item),
        this.answers
      )
    })
  }
}

  ```
  &emsp; ***在脚手架利用模板创建项目的过程中经常用到的一些操作就是将创建过程中的数据自动写入创建出来的新文件中***<br>
  ```html
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="<%%= BASE_URL %>favicon.ico">
    <!-- 此处就是可以在创建过程中填入数据的部分 -->
    <title><%= name %></title>
  </head>
  <body>
    <noscript>
      <strong>We're sorry but my-vue-project doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>

  ```
  *`PLOP`*<br>
  &emsp;`PLOP`是一个小型的脚手架，可以用来方便快捷的创建小型的文件。
  ```js
  module.exports = plop => {
  plop.setGenerator('component', {
    description: 'create a component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'component name',
        default: 'MyComponent'
      }
    ],
    actions: [
      {
        type: 'add', // 代表添加文件
        path: 'src/components/{{name}}/{{name}}.js',
        templateFile: 'plop-templates/component.hbs'
      },
      {
        type: 'add', // 代表添加文件
        path: 'src/components/{{name}}/{{name}}.css',
        templateFile: 'plop-templates/component.css.hbs'
      },
      {
        type: 'add', // 代表添加文件
        path: 'src/components/{{name}}/{{name}}.test.js',
        templateFile: 'plop-templates/component.test.hbs'
      }
    ]
  })
}

  ```
***
  &emsp;在项目开发完之后，我们就进入到了发布阶段，而构建的过程，则是使用自动化构建更加的方便快捷。可以让我们不用手工的转换我们的源代码为最后交给计算机执行的代码<br>
  *`Grunt`*<br>
  `Grunt`是一款上了年头的构建工具。需要有一个`gruntfile`来配置，他的核心用法是快速的创建一系列的构建任务，并将其组合起来，形成一个完整的构建链条，而他的主要构建功能通过插件来进行,`Grunt`本身只提供了一个命令执行平台，可以使用的任务除了同步任务还有异步任务，其用例如下<br>

  ```js
  //基本任务
  // 下面的案例中，如果执行grunt foo:testing:123，将输出日志foo, testing 123。 如果执行这个任务时不传递参数，只是执行 grunt foo，那么将输出日志foo, no args。
  grunt.registerTask(taskName, [description, ] taskFunction)；
  grunt.registerTask('foo', 'A sample task that logs stuff.', function(arg1, arg2) {
    if (arguments.length === 0) {
      grunt.log.writeln(this.name + ", no args");
    } else {
      grunt.log.writeln(this.name + ", " + arg1 + " " + arg2);
    }
  });

  //任务失败则强制停止，除非--force
  grunt.registerTask('foo', 'My "foo" task.', function() {
    // Fail synchronously.
    return false;
  });

  grunt.registerTask('bar', 'My "bar" task.', function() {
    var done = this.async();
    setTimeout(function() {
      // Fail asynchronously.
      done(false);
    }, 1000);
  });

  //异步任务
  grunt.registerTask('asyncfoo', 'My "asyncfoo" task.', function() {
  // Force task into async mode and grab a handle to the "done" function.
  var done = this.async();
  // Run some sync stuff.
  grunt.log.writeln('Processing task...');
  // And some async stuff.
  setTimeout(function() {
    grunt.log.writeln('All done!');
    done();
  }, 1000);
  });

  //多目标任务
  grunt.initConfig({
    sass: {
      options: {
        sourceMap: true,
        implementation: sass,
      },
      main: {
        files: {
          "dist/assets/styles/main.css": "src/assets/styles/main.scss",
        },
      },
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ["@babel/preset-env"],
      },
      main: {
        files: {
          "dist/assets/scripts/main.js": "src/assets/scripts/main.js",
        },
      },
    }
  });
  loadGruntTasks(grunt) // 自动加载所有的 grunt 插件中的任务
  grunt.registerTask('default', ['sass', 'babel'])

  ```
  *`Gulp`*<br>
  &emsp;`Gulp`是新生代的自动化构建工具，总体思想和`grunt`差不多，但是使用上更加高效和有效，也有串行和并行的任务。例子如下
  ```js
  //gulpfile.js

  // gulp 的任务函数都是异步的
  // 可以通过调用回调函数标识任务完成
  exports.foo = done => {
    console.log('foo task working~')
    done() // 标识任务执行完成
  }

  // default 是默认任务
  // 在运行是可以省略任务名参数
  exports.default = done => {
    console.log('default task working~')
    done()
  }

  // v4.0 之前需要通过 gulp.task() 方法注册任务
  const gulp = require('gulp')

  gulp.task('bar', done => {
    console.log('bar task working~')
    done()
  })

  const { series, parallel } = require('gulp')

  //线性并行任务范例
  const task1 = done => {
    setTimeout(() => {
      console.log('task1 working~')
      done()
    }, 1000)
  }

  const task2 = done => {
    setTimeout(() => {
      console.log('task2 working~')
      done()
    }, 1000)  
  }

  const task3 = done => {
    setTimeout(() => {
      console.log('task3 working~')
      done()
    }, 1000)  
  }

  // 让多个任务按照顺序依次执行
  exports.foo = series(task1, task2, task3)

  // 让多个任务同时执行
  exports.bar = parallel(task1, task2, task3)


  ```
***
  #### **从零开始构建一个带创建和构建功能的脚手架dpc-cli**
  &emsp;通过之前的使用经验和学习，我们可以知道一个脚手架创建项目的过程中通常的功能有以下几个<br>
  &emsp;**问询=>根据模板创建=>git初始化=>安装依赖**<br>
  &emsp;构建方面，需要的功能主要有<br>
  &emsp;**生产环境的devsever，构建整个项目（包括对代码文件的压缩，编译，打包等）**<br>
  &emsp;思路清晰之后，就可以开始考虑整个项目的设计了。<br>
  &emsp;其他方面，需要考虑的地方有：**高度的可拓展性**<br>
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
    
    




