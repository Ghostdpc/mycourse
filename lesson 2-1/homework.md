# 简答题
第一题： 工程化的意义和能解决的三个问题<br>
&ensp;工程化遵循一定的标准或者规范，提高效率降低成本的手段。前端工程化是为了更加有效率的解决前端开发过程中的问题，例如1.自动化解决各种各样重复的建立项目，发布版本的这类机械性的操作，2.通过工程化制定标准和规范，提高整体项目代码风格的统一性，提高代码质量。3.可以利于前端开发过程中模块化的开发，4.降低对后端的依赖等等。其目标是减低开发成本。工程化的不仅仅包括使用脚手架，还包括有项目管理，例如常见的项目团队职务分配，pm,测试，工程师等等这些，还有开发的思想，比如模块化的前端开发，大前端的思想，还有常见的敏捷开发的开发方式，这些都是工程化的一部分。（当然也能说是软件工程的一部分）。  
第二题： 脚手架除了创建项目还有什么意义<br>
&ensp;常见的各类的脚手架，例如`vue-cli` ,`create-react-app`等，除了建立项目，总体而言，能够极大的提高开发的效率。一个好的脚手架是可以拓展的，它可以帮助我们极大的简化项目开发过程中的一些繁琐的操作，比如说集成开发服务器，可以随时随地测试，提供代码格式检查和git检查，方便快捷的建立规范的项目或者项目中的某些模块。

编程题<br>
1。自制脚手架<br>
根据使用脚手架的经验，他们一般会有下面几个功能比如询问项目名称，项目描述等；所以，cli首先就要具备问询功能，用以获取定制化信息；<br>
问询结束后，我们的cli会获得即将创建的项目的基本信息，接下来我们就需要以一个模板项目作为模板去创建，；OK，既然有了模板项目，cli就需复制这个项目，同时将前面问询所得的定制化信息写入项目配置中，所以cli还需要有复制，写入模板功能；<br>
我们还希望脚手架可以帮忙进行git初始化以及安装依赖的功能，所以最终，还需要添加git初始化和安装依赖的功能；<br>
总结一下，实现一个cli的初始化功能我们需要有如下能力：<br>
问询 ==> 复制，写入模板 ==> git初始化 ==> 安装依赖<br>
**具体参见`node-cli`的 readme.md的新建项目部分**<br>

2.Gulp构件项目<br>
由于将gulp封装到了`node-cli`脚手架中，因此<br>
**具体参见`node-cli`的 readme.md的构建项目部分**<br>

3.Grunt构建项目<br>
**一.将所有任务都注册**<br>
将所有任务都注册为多目标任务，这些任务使用的都是不同的插件。
```js
  grunt.initConfig({
      //使用sass插件
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
    //使用babel插件
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
    },
    //使用swigtemplates插件
    swigtemplates: {
      main: {
        dest: 'dist/',
        src: ['src/*.html']
      }
    },
 //使用htmlmin插件
    htmlmin: {
      // Task
      dist: {
        // Target
        options: {
          // Target options
          removeComments: true,
          collapseWhitespace: true,
        },
        files: {
          // Dictionary of files
          "dist/index.html": "dist/src/index.html", // 'destination': 'source'
          "dist/about.html": "dist/src/about.html",
        },
      },
    },
    imagemin: {
      main: {
        files: {
          "dist/logo.png": "src/assets/images/logo.png",
        },
      },
    },
    useref: {
      html: "dist/**/*.html",
      temp: "dist",
    },
    copy: {
      main: {
        files: [
          // includes files within path
          { expand: true,cwd: 'public', src: ["**"], dest: "dist", filter: "isFile" },
          {
            expand: true,
            src: ["assets/fonts/*"],
            cwd: 'src',
            dest: "dist",
            filter: "isFile",
          },
          {
            expand: true,
            src: ["assets/images/*.svg"],
            dest: "dist",
            cwd: 'src',
            filter: "isFile",
          },
        ],
      },
    },
  });
```

**组合任务形成命令**<br>
注册三个不同的任务，分别是compile,build,compile.<br>
```js
  grunt.registerTask('default', ['sass', 'babel',`swigtemplates`])
  grunt.registerTask('compile',function(){
      grunt.task.run(['sass', 'babel','swigtemplates']);
  })
  grunt.registerTask('build',function(){
    grunt.task.run(['sass', 'babel','swigtemplates']);
    grunt.task.run(['imagemin', 'useref','copy','htmlmin']);
    del(['dist/src']);
  })
```
build任务中，我们先将sass,js,template编译。然后再对他们进行图片和html的压缩，userref的引用，同时对不需要进行拷贝。出于可读性考虑，将两段任务分开来。最后的输出会直接输出到dist目录下。






