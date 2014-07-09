/*global module:false*/
module.exports = function(grunt) {
	var name 		= '<%= pkg.name %>-v<%= pkg.version%>'
	,	manifest 	= '<%= pkg.manifest %>'
	,	bowerPath 	= 'app_modules/'
	, 	winterPath	= 'contents/'
	,	pathJS 		= winterPath + 'js/'
	,	pathCSS 	= winterPath + 'css/'
	,	pathIMG 	= winterPath + 'im/'
	,	appSRC 		= 'app/'
	,	appLESS 	= appSRC + 'less/'
	,	appIMG 		= appSRC + 'images/src'
	,	appJS 		= appSRC + 'js/';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')
	,	jshint: {
			sitefiles: {
				src: appJS + '*.js'
			}
		,	gruntfile: {
				src: 'Gruntfile.js'
			}
		}
	,	less: {
			dev: {
				options: {
					path: appLESS
				,	cleancss: false
				}
			,	files: manifest
			}
		,	production: {
				options: {
					path: appLESS
				,	compress: true
				,	cleancss: true
				}
			,	files: manifest
			}
		}
	,	imagemin: {
			dynamic: {
				options: {
					optimizationLevel: 5
				,	pngquant: true
				}
			,	files: [{
					expand: true
				,	cwd: appIMG
				,   src: [ '**/*.{png,jpg,gif}' ]
				,	dest: pathIMG
				}]
			}
		}
	,	csslint: {
			src: pathCSS + '*.css'
		,	csslintrc: '.csslintrc'
		,	options: {
				formatters: [{
					id: 'text'
				,	dest: 'CSSlint.txt'
				}]
			}
		}
	,	csscss: {
			options: {
				verbose: true
			,	outputJson: true
			}
		,	dist: { 'DEV-report.json' : pathCSS }
		}
	,	wintersmith: {
			build: {
				options: {
					action: "build"
				,	config: 'config.json'
				}
			}
		,	preview: {
				options: {
					action: "preview"
				,	config: 'config.json'
				}
			}
		}
	, 	copy: {
			main: {
				expand: true
			,	cwd: appJS
			,	src: '*.js'
			,	dest: pathJS
			, 	flatten: true
			}
		,	bowerstuff: {
				expand: true
			,	cwd: bowerPath
			,	src: [ 'jq/dist/jquery.min.js' ]
			,	dest: pathJS
			, 	flatten: true
			}
		}
	, 	open: {
			dev : {
				path: 'http://localhost:8080'
			,	app: 'Firefox'
			}
		}
	,	watch: {
			files: [
				appLESS + '*'
			, 	appIMG + '*'
			, 	appJS + '*'
			,	appSRC + "*"
			,	"templates/*.jade"
			, 	"Gruntfile.js"
			]
		,	tasks: [ 'less:dev', 'copy' ]
		,	options: {
				reload: true
			,	livereload: true
			,	spawn: false
			,	dateFormat: function( time )
				{
					grunt.log.writeln('Hickory Dickory Dock the Mouse ran up the clock in ' + time + 'ms');
					grunt.log.writeln('MOAR changes... bring them you must!');
				}
			}
		}
	,	concurrent: {
			target: {
				tasks: [ 'wintersmith:preview', 'watch', 'open' ]
			,	options:
				{
					logConcurrentOutput: true
				}
			}
		}
	});

	require('matchdep').filterDev('grunt-*').forEach( grunt.loadNpmTasks );

	// Develop
	grunt.registerTask('default', [ 'concurrent' ]);

	// Test
	grunt.registerTask('test', [ 'less:dev', 'csscss', 'csslint', 'wintersmith:build' ]);

	// Deploy
	grunt.registerTask('deploy', [ 'less:production', 'imagemin', 'concat', 'wintersmith:build' ]);
}