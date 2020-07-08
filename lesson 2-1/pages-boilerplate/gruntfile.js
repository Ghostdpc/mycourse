const sass = require('sass')
const loadGruntTasks = require('load-grunt-tasks')
const del = require('del');
const htmlmin = require('gulp-htmlmin');

module.exports = grunt => {
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
    },
    swigtemplates: {
      main: {
        dest: 'dist/',
        src: ['src/*.html']
      }
    },
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

  // grunt.loadNpmTasks('grunt-sass')
  loadGruntTasks(grunt) // 自动加载所有的 grunt 插件中的任务

  grunt.registerTask('default', ['sass', 'babel',`swigtemplates`])
  grunt.registerTask('compile',function(){
      grunt.task.run(['sass', 'babel','swigtemplates']);
  })
  grunt.registerTask('build',function(){
    grunt.task.run(['sass', 'babel','swigtemplates']);
    grunt.task.run(['imagemin', 'useref','copy','htmlmin']);
    del(['dist/src']);
  })
}
