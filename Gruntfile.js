/*global module:false*/
module.exports = function(grunt) {
	var name = '<%= pkg.name %>-v<%= pkg.version%>',
			manifest = '<%= pkg.manifest %>';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		//////////////////////////////////////////////////////////////////////////////////// Constants
		app: {
			root: 'app/',
			JS: 'app/js/',
			LESS: 'app/less/',
			IMG: {
				root: 'app/images/',
				src: 'app/images/src/'
			}
		},
		winter: {
			path: 'contents/',
			css: 'contents/css/',
			img: 'contents/img/'
		},
		prod: {
			root: 'build/',
			IMG: 'build/img/',
			JS: 'build/js/',
			CSS: 'build/css/'
		},
		bower: 'app_modules/',
		reports: 'test/',	
		manifest: {
			"<%= winter.css %>layout.min.css": [
				"<%= bower %>normalize-less/normalize.less",
				"<%= app.LESS %>base-*.less"
			],
			"<%= winter.css %>global.css": "<%= app.LESS %>global.less"
		},
		jshint: {
			sitefiles: {
				src: '<%= app.JS %>*.js'
			},
			gruntfile: {
				src: 'Gruntfile.js'
			}
		},
		less: {
			dev: {
				options: {
					path: '<%= app.LESS %>',
					cleancss: false
				},
				files: '<%= manifest %>'
			},
			production: {
				options: {
					path: '<%= app.LESS %>',
					compress: true,
					cleancss: true
				},
				files: '<%= manifest %>'
			}
		},
		imagemin: {
			dynamic: {
				options: {
					optimizationLevel: 5,
					pngquant: true
				},
				files: [{
					expand: true,
					cwd: '<%= app.IMG.src %>',
					src: [ '**/*.{png,jpg,gif}' ],
					dest: '<%= prod.IMG %>'
				}]
			}
		},
		wintersmith: {
			build: {
				options: {
					action: "build",
					config: 'config-prod.json'
				}
			},
			preview: {
				options: {
					action: "preview",
					config: 'config.json'
				}
			}
		},
		copy: {
			main: {
				expand: true,
				cwd: '<%= app.JS %>',
				src: '*.js',
				dest: '<%= prod.JS %>',
				flatten: true
			},
			bowerstuff: {
				expand: true,
				cwd: '<%= bower %>',
				src: [ 'jq/dist/jquery.min.js' ],
				dest: '<%= prod.JS %>',
				flatten: true
			},
			images: {
				expand: true,
				cwd: '<%= app.IMG.src %>',
				src: [ '**/*.{png,gif,jpg}' ],
				dest: '<%= winter.img %>',
				flatten: true
			}
		},
		htmlmin: {
			dist: {
				options: {
					removeAttributeQuotes: true,
					useShortDoctype: true,
					removeComments: true,
					collapseWhitespace: true
				},
				expand: true,
				cwd: 'build',
				src: ['**/*.html'],
				dest: 'build/'
			}
		},
		open: {
			dev : {
				path: 'http://localhost:8080',
				app: 'Firefox'
			}
		},
		'sftp-deploy': {
			build: {
				auth: {
					host: 'proemland.com',
					port: 22,
					authKey: 'key1'
				},
				cache: 'sftpCache.json',
				src: 'build',
				dest: '/home/proemadmin/placeguntohead.com',
				serverSep: '/',
				concurrency: 4,
				progress: true
			}
		},
		watch: {
			files: [
				'<%= app.root %>**/*',
				"templates/*.jade",
				"Gruntfile.js"
			],
			tasks: [ 'less:dev', 'imagemin', 'copy' ],
			options: {
				reload: true,
				livereload: true,
				spawn: false,
				dateFormat: function( time ) {
					grunt.log.writeln('Hickory Dickory Dock the Mouse ran up the clock in ' + time + 'ms');
					grunt.log.writeln('MOAR changes... bring them you must!');
				}
			}
		},
		concurrent: {
			target: {
				tasks: [ 'wintersmith:preview', 'open', 'watch' ],
				options: {
					logConcurrentOutput: true
				}
			}
		}
	});

	require('matchdep').filterDev('grunt-*').forEach( grunt.loadNpmTasks );

	// Develop
	grunt.registerTask('default', [ 'concurrent' ]);

	// Deploy
	grunt.registerTask('build', [ 'less:production', 'imagemin', 'wintersmith:build', 'htmlmin' ]);

	// upload
	grunt.registerTask('deploy', [ 'build', 'sftp-deploy' ]);	
};