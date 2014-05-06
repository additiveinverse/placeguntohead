/*global module:false*/
module.exports = function(grunt) {
	var name 		= '<%= pkg.name %>-v<%= pkg.version%>'
	,	manifest 	= '<%= pkg.manifest %>'
	,	bowerPath 	= 'app_modules/'
	, 	winterPath	= 'contents/'
	,	pathJS 		= winterPath + 'js/'
	,	pathCSS 	= winterPath + 'css/'
	,	pathIMG 	= winterPath + 'img/'
	,	appSRC 		= 'app/'
	,	appLESS 	= appSRC + 'less/'
	,	appIMG 		= appSRC + 'images/'
	,	appJS 		= appSRC;

	grunt.initConfig(
	{
		pkg: grunt.file.readJSON('package.json')
	,	jshint:
		{
			gruntfile:
			{
				src: 'Gruntfile.js'
			}
		}
	,	less:
		{
			dev:
			{
				options:
				{
					path: appLESS
				,	cleancss: false
				}
			,	files: manifest
			}
		,	production:
			{
				options:
				{
					path: appLESS
				,	compress: true
				,	cleancss: true
				}
			,	files: manifest
			}
		}
	// ,	imagemin:
	// 	{
	// 		dynamic:
	// 		{
	// 			options:
	// 			{
	// 				optimizationLevel: 5
	// 			,	pngquant: true
	// 			}
	// 		,	files:
	// 			[{
	// 				expand: true
	// 			,	cwd: appIMG
	// 			,   src: [ '**/*.{png,jpg,gif}' ]
	// 			,	dest: pathIMG
	// 			}]
	// 		}
	// 	}
	,	csslint:
		{
			src: pathCSS + '*.css'
		,	csslintrc: '.csslintrc'
		,	options:
			{
				formatters:
				[{
					id: 'text'
				,	dest: '/CSSlint.txt'
				}]
			}
		}
	,	csscss:
		{
			options:
			{
				verbose: true
			,	outputJson: true
			}
		,	dist: { '/DEV-report.json' : pathCSS }
		}
	,	wintersmith:
		{
			build:
			{
				options:
				{
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
	,	watch:
		{
			files: [
						appLESS + '*'
					, 	appIMG + '*'
					, 	appJS + '*'
					,	appSRC + "*"
					,	"templates/*"
					]
		,	tasks: [
					'less:dev'
					]
		,	options:
			{
				reload: false
			,	livereload: true
			,	spawn: false
			,	dateFormat: function( time )
				{
					grunt.log.writeln('Hickory Dickory Dock the Mouse ran up the clock in ' + time + 'ms');
					grunt.log.writeln('MOAR changes Sucka... bring them!');
				}
			}
		}
	,	concurrent:
		{
			target:
			{
				tasks: ['wintersmith:preview', 'watch']
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