module.exports = function(grunt) {
    'use strict';

    var sources = [
        'src/utils.js',
        'src/collection.js',
        'src/model.js',
        'src/mondo.js',
        'src/query.js',
        'src/querybuilder.js',
        'src/stores/abstract.js',
        'src/stores/abstractwebstorage.js',
        'src/stores/indexeddb.js',
        'src/stores/localstorage.js',
        'src/stores/nedb.js',
        'src/stores/rest.js',
        'src/stores/sessionstorage.js',
        'src/stores/websql.js',
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['dist/*'],
        jshint: {
            build: ['Gruntfile.js', 'src/**/*.js', '!src/utils.js', '!src/wrapper.banner.js', '!src/wrapper.footer.js']
        },
        concat: {
            options: {
                banner: grunt.file.read('src/wrapper.banner.js'),
                footer: grunt.file.read('src/wrapper.footer.js'),
                process: true
            },
            build: {
                src: sources,
                dest: 'dist/mondo.js'
            }
        },
        uglify: {
            options: {
                sourceMap: true
            },
            build: {
                src: 'dist/mondo.js',
                dest: 'dist/mondo.min.js',
            }
        },
        watch: {
            options: {
                interrupt: true,
                livereload: true,
                spawn: false
            },
            build: {
                files: "src/**/*.js",
                tasks: ['build']
            }
        },
        release: {
            options: {
                file: 'package.json',
                npm: false
            }
        }
    });
    // Load npm tasks
    require('load-grunt-tasks')(grunt);

    grunt.registerTask('build', ['jshint', 'clean', 'concat', 'uglify']);
    grunt.registerTask('default', ['build', 'watch']);
};