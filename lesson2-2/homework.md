# 简答题
第一题： Webpack 的构建流程主要有哪些环节？<br>
&ensp;Webpack的构建需要做的事情大致上分为了三件，一个是编译转换代码，一个是一些文件资源的操作，还有就是一些关于代码的优化。使用webpack进行构建的过程中，会通过入口文件的代码，解析每个导入文件的依赖模块，随后形成一个依赖树，然后通过递归遍历整个依赖树，通过配置的规则，使用不同的loader对不同的模块进行加载，在这些加载的过程中，也会穿插着一些代码的优化操作，比如说在编译JS的代码的之前，我们可以进行eslint对代码质量进行检查，根据规则对无用的代码进行忽略，然后再使用babel对js代码进行编译。在这个过程中，插件会根据他们所使用的钩子的顺序不同，也会按照时序穿插执行。最后这些经过loader处理完成的源代码会输出为一个个输出文件，浏览器可以直接使用<br>
第二题： Loader 和 Plugin 有哪些不同？<br>
&ensp;Loader的工作形式可以说是类似于管道化的工作形式，他会接受一个输入数据，然后处理后输出一个处理完的数据，但是这个管道的结果的要求是要最终输出一定要是一段JS代码。而且他只在加载模块时工作，而插件则是为了增强Webpack整体的自动化工作的能力，在webpack工作的各个时候都可以运行的。它通过webpack在各个环节埋下的钩子来构建，每个插件被要求是一个函数或者包含apply方法。开发Loader时，我们首先应该考虑我们的输入和输出，来决定是一次性输出规范的JavaScript代码还是和其他loader组合使用，确定之后就可以利用现成的库或者自己写一个新的方法处理数据，然后将处理后的结果返回即可，使用时则根据具体的情况组合或者直接使用这个loader。而plugin开发则是首先要确定在哪个阶段使用这个插件，然后选择好正确的钩子并获取到我们想要处理的对象，处理完我们想要处理的数据之后，返回应该返回的size函数和覆盖掉原来的数据即可。

编程题<br>

* **Usage**<br>
`yarn serve` 运行项目<br>
`yarn build` 构建项目<br>
`yarn lint`  ESLINT检查项目<br>

* **构建项目部分**<br>
    **共通的Webpack操作**<br>
    不管是开发过程中还是项目的发布过程中，我们总是要包括编译代码这部分的操作，因此这部分是构件项目的主体逻辑<br>
    1.  **基本的操作入口**<br>
    ```js
    module.exports = {
    //确定打包的入口
        entry: "./src/main.js",
        //确定打包的出口
        output: { filename: "bundle.js" },
        //对于模块的具体操作
        module: {
            //...
        },
        //插件额外操作
        plugins: [
            //...
        ]
        //模式名
        mode: "none",
    };
    ```
    2.  **配置module和loader**<br>
   根据项目中的代码具体需要哪些loader
    ```js
    module: {
        rules: [
        //编译js代码锁需要的babel-loader
        {
            test: /\.m?js$/,
            //排除nodemodules中的部分
            exclude: /(node_modules|bower_components)/,
            use: {
            loader: "babel-loader",
            options: {
              //配置babel
                presets: ["@babel/preset-env"],
            },
            },
        },
        {
            //使用eslint进行代码检查
            test: [/\.m?js$/,/\.vue$/],
            exclude: /(node_modules|bower_components)/,
            use: {
            loader: "eslint-loader",
            },
            //强制先执行
            enforce: 'pre'
        },
        {
            //读取CSS并且作为style插入到代码中
            test: /\.css$/,
            use: ["style-loader", "css-loader"],
        },
        {
            //读取less
            test: /\.less$/,
            use: ["style-loader", "css-loader", "less-loader"],
        },
        {
            //使用文件读取图片
            test: /\.(png|jpe?g|gif)$/i,
            loader: "file-loader",
            options: {
            outputPath: "assets",
            name: "[name].[ext]",
            esModule: false,
            },
        },
        { 
            //因为VUE，所以单独使用loader
            test: /\.vue$/,
            use: {
            loader: "vue-loader",
            },
        },
        ],
  },
    ```
    3.  **配置插件**<br>
   配置使用打包后的代码的html文件，配置html模板文件里面的数据
   ```js
    plugins: [
      //第一个插件是配合vueloader的插件
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: "1111",
      template: "./public/index.html",
    }),
    new webpack.DefinePlugin({
      BASE_URL: "/public/",
    }),
  ],
   ```
   **开发过程中的构建**<br>
  开发过程中主要的需要做的就是一点，一个开发服务器<br>
  ```js
  const webpack = require("webpack");
  const { merge } = require("webpack-merge");
  const common = require("./webpack.common");
  //使用wepackMerge模块来合并配置项
  module.exports = merge(common, {
    //设置模式
    mode: "development",
    //设置developtool
    devtool: "cheap-eval-module-source-map",
    //配置devserver和热更新
    devServer: {
      hot: true,
      contentBase: "public",
      open: true,
    },
    //插件也是热更新插件
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
    ],
  });
  ```
  **发布时的构建**<br>
  发布过程中主要的需要做的就是清理文件夹<br>
  ```js
  const { merge } = require('webpack-merge');
  const { CleanWebpackPlugin } = require('clean-webpack-plugin')
  const CopyWebpackPlugin = require('copy-webpack-plugin')
  const common = require('./webpack.common')
  //和dev一样的merge
  module.exports = merge(common, {
    mode: 'production',
    //复制静态资源的插件和删除文件的插件
    plugins: [
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
          patterns: [
            { from: 'public', to: 'public' }
          ]
        })
    ]
  })
  ```
   
  
* **esLint和项目质量**<br>
  **Eslint的设置和配置**<br>
  通过Eslint --init命令进行配置
  ```js
  module.exports = {
    //debug环境
    "env": {
        "browser": true,
        "es2020": true
    },
    //使用的规则
    "extends": [
        "plugin:vue/essential",
        "google"
    ],
    //额外的设置
    "parserOptions": {
        "ecmaVersion": 11,
        "sourceType": "module"
    },
    //安装的插件
    "plugins": [
        "vue"
    ],
    //自定义规则
    "rules": {
    }};
  ```
  **Eslint使用和命令**<br>
  使用`eslint --ext .js src --ext .vue src`来主动对代码质量进行扫描
  ```js
  {
    //构建时先使用eslint检查
    //使用eslint进行代码检查
    test: [/\.m?js$/,/\.vue$/],
    xclude: /(node_modules|bower_components)/,
    use: {
    loader: "eslint-loader",
    },
    //强制先执行
    enforce: 'pre'
  }
  ```
    