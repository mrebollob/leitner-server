// Generated on 2019-03-12 using generator-angular-fullstack 5.0.0-rc.4
import _ from 'lodash';
import del from 'del';
import gulp from 'gulp';
import grunt from 'grunt';
import path from 'path';
import through2 from 'through2';
import gulpLoadPlugins from 'gulp-load-plugins';
import http from 'http';
import lazypipe from 'lazypipe';
import nodemon from 'nodemon';
import runSequence from 'run-sequence';
import {
    Instrumenter
} from 'isparta';

var plugins = gulpLoadPlugins();
var config;

const serverPath = 'server';
const paths = {
    server: {
        scripts: [
            `${serverPath}/**/!(*.spec|*.integration).js`,
            `!${serverPath}/config/local.env.sample.js`
        ],
        json: [`${serverPath}/**/*.json`],
        test: {
            integration: [`${serverPath}/**/*.integration.js`, 'mocha.global.js'],
            unit: [`${serverPath}/**/*.spec.js`, 'mocha.global.js']
        }
    },
    karma: 'karma.conf.js',
    dist: 'dist'
};

/********************
 * Helper functions
 ********************/

function onServerLog(log) {
    console.log(plugins.util.colors.white('[') +
        plugins.util.colors.yellow('nodemon') +
        plugins.util.colors.white('] ') +
        log.message);
}

/********************
 * Reusable pipelines
 ********************/

let lintServerScripts = lazypipe()
    .pipe(plugins.eslint, `${serverPath}/.eslintrc`)
    .pipe(plugins.eslint.format);

let lintServerTestScripts = lazypipe()
    .pipe(plugins.eslint, {
        configFile: `${serverPath}/.eslintrc`,
        envs: [
            'node',
            'es6',
            'mocha'
        ]
    })
    .pipe(plugins.eslint.format);

let transpileServer = lazypipe()
    .pipe(plugins.sourcemaps.init)
    .pipe(plugins.babel, {
        plugins: [
            'transform-class-properties',
            'transform-runtime'
        ]
    })
    .pipe(plugins.sourcemaps.write, '.');

let mocha = lazypipe()
    .pipe(plugins.mocha, {
        reporter: 'spec',
        timeout: 5000,
        require: [
            './mocha.conf'
        ]
    });

let istanbul = lazypipe()
    .pipe(plugins.istanbul.writeReports)
    .pipe(plugins.istanbulEnforcer, {
        thresholds: {
            global: {
                lines: 80,
                statements: 80,
                branches: 80,
                functions: 80
            }
        },
        coverageDirectory: './coverage',
        rootDirectory: ''
    });

/********************
 * Env
 ********************/

gulp.task('env:all', () => {
    let localConfig;
    try {
        localConfig = require(`./${serverPath}/config/local.env`);
    } catch (e) {
        localConfig = {};
    }
    plugins.env({
        vars: localConfig
    });
});
gulp.task('env:test', () => {
    plugins.env({
        vars: {
            NODE_ENV: 'test'
        }
    });
});
gulp.task('env:prod', () => {
    plugins.env({
        vars: {
            NODE_ENV: 'production'
        }
    });
});

/********************
 * Tasks
 ********************/

gulp.task('transpile:server', () => {
    return gulp.src(_.union(paths.server.scripts, paths.server.json))
        .pipe(transpileServer())
        .pipe(gulp.dest(`${paths.dist}/${serverPath}`));
});

gulp.task('lint:scripts', cb => runSequence(['lint:scripts:server'], cb));

gulp.task('lint:scripts:server', () => {
    return gulp.src(_.union(paths.server.scripts, _.map(paths.server.test, blob => '!' + blob)))
        .pipe(lintServerScripts());
});

gulp.task('lint:scripts:serverTest', () => {
    return gulp.src(paths.server.test)
        .pipe(lintServerTestScripts());
});

gulp.task('clean:tmp', () => del(['.tmp/**/*'], {
    dot: true
}));

gulp.task('start:server', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    config = require(`./${serverPath}/config/environment`);
    nodemon(`-w ${serverPath} ${serverPath}`)
        .on('log', onServerLog);
});

gulp.task('start:server:prod', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'production';
    config = require(`./${paths.dist}/${serverPath}/config/environment`);
    nodemon(`-w ${paths.dist}/${serverPath} ${paths.dist}/${serverPath}`)
        .on('log', onServerLog);
});

gulp.task('start:server:debug', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    config = require(`./${serverPath}/config/environment`);
    // nodemon(`-w ${serverPath} --debug=5858 --debug-brk ${serverPath}`)
    nodemon(`-w ${serverPath} --inspect --debug-brk ${serverPath}`)
        .on('log', onServerLog);
});

gulp.task('serve', cb => {
    runSequence(
        [
            'clean:tmp',
            'lint:scripts',
            'env:all'
        ],
        ['start:server'],
        cb
    );
});

gulp.task('serve:debug', cb => {
    runSequence(
        [
            'clean:tmp',
            'lint:scripts',
            'env:all'
        ],
        'webpack:dev',
        ['start:server:debug'],
        cb
    );
});

gulp.task('serve:dist', cb => {
    runSequence(
        'build',
        'env:all',
        'env:prod',
        ['start:server:prod'],
        cb);
});

gulp.task('test', cb => {
    return runSequence('test:server', cb);
});

gulp.task('test:server', cb => {
    runSequence(
        'env:all',
        'env:test',
        'mocha:unit',
        'mocha:integration',
        cb);
});

gulp.task('mocha:unit', () => {
    return gulp.src(paths.server.test.unit)
        .pipe(mocha());
});

gulp.task('mocha:integration', () => {
    return gulp.src(paths.server.test.integration)
        .pipe(mocha());
});

gulp.task('test:server:coverage', cb => {
    runSequence('coverage:pre',
        'env:all',
        'env:test',
        'coverage:unit',
        'coverage:integration',
        cb);
});

gulp.task('coverage:pre', () => {
    return gulp.src(paths.server.scripts)
        // Covering files
        .pipe(plugins.istanbul({
            instrumenter: Instrumenter, // Use the isparta instrumenter (code coverage for ES6)
            includeUntested: true
        }))
        // Force `require` to return covered files
        .pipe(plugins.istanbul.hookRequire());
});

gulp.task('coverage:unit', () => {
    return gulp.src(paths.server.test.unit)
        .pipe(mocha())
        .pipe(istanbul())
    // Creating the reports after tests ran
});

gulp.task('coverage:integration', () => {
    return gulp.src(paths.server.test.integration)
        .pipe(mocha())
        .pipe(istanbul())
    // Creating the reports after tests ran
});

/********************
 * Build
 ********************/

gulp.task('build', cb => {
    runSequence(
        [
            'clean:dist',
            'clean:tmp'
        ],
        'transpile:server',
        [
            'copy:server',
        ],
        cb);
});

gulp.task('clean:dist', () => del([`${paths.dist}/!(.git*|.openshift|Procfile)**`], {
    dot: true
}));

gulp.task('copy:server', () => {
    return gulp.src([
            'package.json'
        ], {
            cwdbase: true
        })
        .pipe(gulp.dest(paths.dist));
});

/********************
 * Grunt ported tasks
 ********************/

grunt.initConfig({
    buildcontrol: {
        options: {
            dir: paths.dist,
            commit: true,
            push: true,
            connectCommits: false,
            message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
        },
        heroku: {
            options: {
                remote: 'heroku',
                branch: 'master'
            }
        },
        openshift: {
            options: {
                remote: 'openshift',
                branch: 'master'
            }
        }
    }
});

grunt.loadNpmTasks('grunt-build-control');

gulp.task('buildcontrol:heroku', function (done) {
    grunt.tasks(
        ['buildcontrol:heroku'], //you can add more grunt tasks in this array
        {
            gruntfile: false
        }, //don't look for a Gruntfile - there is none. :-)
        function () {
            done();
        }
    );
});
gulp.task('buildcontrol:openshift', function (done) {
    grunt.tasks(
        ['buildcontrol:openshift'], //you can add more grunt tasks in this array
        {
            gruntfile: false
        }, //don't look for a Gruntfile - there is none. :-)
        function () {
            done();
        }
    );
});