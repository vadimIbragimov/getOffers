#!/usr/bin/env node
const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const { yellow, green, red } = require('chalk');
const moment = require('moment');

const imageExtensions = require('image-extensions');

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const tsCompiler = require('gulp-typescript');
const gulpEslint = require('gulp-eslint');

const postcss = require('gulp-postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const postcssScss = require('postcss-scss');
const postcssLess = require('postcss-less');

const argv = yargs(hideBin(process.argv)).argv
const outDirName = argv.outDirName || 'dist';
const { series, src, dest, parallel, watch } = gulp;

const pathOfCallPointFolder = fs.realpathSync(process.cwd()); //Папка из которой запускается скрипт
const stylePattern = '/**/*.+(css|scss|less)';
const sourcePattern = '/**/*.+(js|jsx|ts|tsx)';
const dateFormat = "HH:mm ss:ms";

gulp.on('start', (data) => {
  if (!(data.name.startsWith('<'))) {
    console.log(
      `[${yellow(moment(data.time).format(dateFormat))}]`,
      `Task ${yellow(data.name)} started`,
    );
  }
});

gulp.on('stop', (data) => {
  if (!(data.name.startsWith('<'))) {
    console.log(
      `[${yellow(moment(data.time).format(dateFormat))}]`,
      `Task ${yellow(data.name)} ${green('finished')}`,
    );
  }
});

gulp.on('error', (data) => {
  console.log(
    `[${yellow(moment(data.time).format(dateFormat))}]`,
    `Task ${yellow(data.name)} ${red('finished')} with`,
    `${red(data.error)}`
  );
  // if (!process.argv.includes('--watch')) {
  //   process.exit(1);
  // }
});

const getStyleParser = (extname) => {
  switch (extname) {
    case '.less':
      return postcssLess;
    case '.scss':
      return postcssScss;
    default:
      return undefined;
  }
};

const esLint = () => src(`${pathOfCallPointFolder}/src${sourcePattern}`)
  .pipe(gulpEslint({ configFile: path.resolve(pathOfCallPointFolder, '.eslintrc.json') }))
  .pipe(gulpEslint.format())
  .pipe(gulpEslint.failAfterError());

const images = () => src(imageExtensions.map((extension) => `${pathOfCallPointFolder}/src/**/*.${extension}`))
  .pipe(dest(`${pathOfCallPointFolder}/${outDirName}`));


const typescript = () => src(`${pathOfCallPointFolder}/src/**/*.ts{,x}`)
  .pipe(tsCompiler(require(`${pathOfCallPointFolder}/tsconfig.json`).compilerOptions))
  .pipe(dest(`${pathOfCallPointFolder}/${outDirName}`));

const styles = () => src(`${pathOfCallPointFolder}/src${stylePattern}`)
  .pipe(postcss(file => ({
    plugins: [tailwindcss(), autoprefixer()],
    parser: getStyleParser(file.extname),
  })))
  .pipe(dest(`${pathOfCallPointFolder}/${outDirName}`));

const build = () => series(
  esLint,
  parallel(
    images,
    typescript,
    styles,
  )
);

const watchTask = () => {
  const watchFunc = watch(`${pathOfCallPointFolder}/src`, { events: 'all' }, build());
  watchFunc.on('all', (event, path) => console.log('[watchTask]: ', event, path));
  return watchFunc
};

if (argv.watch) {
  series(watchTask)()
} else {
  build()();
}
