// 实现这个项目的构建任务
const { src, dest, parallel, series, watch } = require('gulp')

const del = require('del')
const browserSync = require('browser-sync')

const loadPlugins = require('gulp-load-plugins')

const plugins = loadPlugins()
const bs = browserSync.create()


const data = {
  menus: [
  ],
  pkg: require('./package.json'),
  date: new Date()
}

const clean = () => {
  return del(['dist', 'temp'])
}

const style = ()=>{
    return src("src/assets/styles/*.scss",{base:"src"})
    .pipe(plugins.sass({outputstyle: "expanded"}))
    .pipe(dest("temp"))
    .pipe(bs.reload({ stream: true }))
}

const script = () =>{
    return src("src/assets/scripts/*.js",{base:"src"})
    .pipe(plugins.babel({presets:["@babel/preset-env"]}))
    .pipe(dest("temp"))
    .pipe(bs.reload({ stream: true }))
}

const page = () =>{
    return src("src/*.html",{base:'src'})
    .pipe(plugins.swig({data,defaults:{cache:false}}))
    .pipe(dest("temp"))
    .pipe(bs.reload({ stream: true }))
}

const imagemin = () =>{
    return src("src/assets/images/**",{base:'src'})
    .pipe(plugins.imagemin())
    .pipe(dest("dist"))
}

const fonts = () =>{
    return src("src/assets/fonts/**",{base:'src'})
    .pipe(plugins.imagemin())
    .pipe(dest("dist"))
}

const public = () => {
  return src('public/**', { base: 'public' })
    .pipe(dest('dist'))
}
const useref = ()=>{
    return src('temp/*.html', { base: 'temp' })
    .pipe(plugins.useref({ searchPath: ['temp', '.'] }))
    // html js css
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true
    })))
    .pipe(dest('dist'))
}
const compile = parallel(style, script, page);

const serve = () => {
  watch('src/assets/styles/*.scss', style)
  watch('src/assets/scripts/*.js', script)
  watch('src/*.html', page)
  // watch('src/assets/images/**', image)
  // watch('src/assets/fonts/**', font)
  // watch('public/**', extra)
  watch([
    'src/assets/images/**',
    'src/assets/fonts/**',
    'public/**'
  ], bs.reload)

  bs.init({
    notify: false,
    port: 3080,
    // open: false,
    // files: 'dist/**',
    server: {
      baseDir: ['temp', 'src', 'public'],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  })
}

// 上线之前执行的任务
const build =  series(
  clean,
  parallel(
    series(compile, useref),
    imagemin,
    fonts,
    public
  )
)

const develop = series(compile, serve)

module.exports = {
 compile,
 build,
 develop
}
