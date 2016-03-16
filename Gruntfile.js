/*global module:false*/
module.exports = function ( grunt ) {
  var name = "<%= pkg.name %>-v<%= pkg.version%>"

  grunt.initConfig( {
    pkg: grunt.file.readJSON( "package.json" ),
    config: {
      app: {
        root: "app/",
        js: "app/js/",
        less: "app/less/",
        img: "app/images/",
        font: "app/font/",
        bower: "app_modules/",
      },

      winter: {
        path: "contents/",
        css: "contents/css/",
        img: "contents/img/",
        font: "contents/font/",
        js: "contents/js",
      },

      prod: {
        root: "build/",
        img: "build/img/",
        js: "build/js/",
        css: "build/css/",
        font: "build/font/"
      },

      reports: "test/"
    },

    manifest: {
      "<%= config.winter.css %>layout.min.css": [
        "<%= config.app.less %>normalize.less",
        "<%= config.app.less %>base-*.less"
      ],
      "<%= config.winter.css %>global.css": "<%= config.app.less %>global.less"
    },

//////////////////////////////////////////////////////////////////////////////////// SCAFFOLD
    copy: {
      js_deps: {
        expand: true,
        cwd: "<%= config.app.bower %>",
        src: [ "jq/dist/jquery.min.js" ],
        dest: "<%= config.prod.js %>",
        flatten: true
      },

      main: {
        expand: true,
        cwd: "<%= config.app.js %>",
        src: "*.js",
        dest: "<%= config.winter.js %>",
        flatten: true
      },

      css_deps: {
        expand: true,
        cwd: "<%= config.app.bower %>",
        src: [ "lesshat/build/lesshat.less",
               "normalize-less/normalize.less" ],
        dest: "<%= config.app.less %>",
        flatten: true
      },

      images: {
        expand: true,
        cwd: "<%= config.app.img %>",
        src: [ "**/*.{png,gif,jpg}", "icons.sprite-*.svg", "logo_*.svg"],
        dest: "<%= config.winter.img %>",
        flatten: true
      },

      font: {
        expand: true,
        cwd: "<%= config.app.bower %>",
        src: [ "typicons/src/*.{eot,svg,ttf,woff}" ],
        dest: "<%= config.app.font %>",
        flatten: true
      },

      prod_font: {
        expand: true,
        cwd: "<%= config.app.font %>",
        src: [ "*.{eot,svg,ttf,woff}" ],
        dest: "<%= config.prod.font %>",
        flatten: true
      }
    },

//////////////////////////////////////////////////////////////////////////////////// COMPILE
    less: {
      dev: {
        options: {
          path: "<%= config.app.less %>",
          cleancss: false,
          compress: false,
        },
        files: "<%= manifest %>"
      },
      production: {
        options: {
          path: "<%= config.app.less %>",
          compress: true,
          cleancss: true
        },
        files: "<%= manifest %>"
      }
    },

    svg_sprite: {
      icons: {
        expand: true,
        cwd: "<%= config.app.img %>icons/",
        src: [ "*.svg" ],
        dest: "<%= config.app.img %>",
        options: {
          shape: {
            dimension: {
              maxWidth: 200,
              maxHeight: 200,
              precision: 1
            }
          },
          svg: {
            padding: 20,
            dimensionAttributes: true
          },
          mode: {
            view: {
              prefix: "@ico-%s",
              bust: true,
              sprite: "icons.sprite.svg",
              dest: "../images",
              common: "sprite",
              dimensions: true,
              mixin: "svg-sprite",
              render: {
                less: {
                  template: "<%= config.app.img %>icons/sprite.mustache",
                  dest: "/<%= config.app.less %>_sprite.less"
                }
              }
            }
          }
        }
      },
    },

    realFavicon: {
      favicons: {
        src: "<%= config.app.img %>favicon/logo_flat_2016.svg",
        dest: "<%= config.winter.path %>favicon/",
        options: {
          iconsPath: '/',
          html: [ "<%= config.winter.path %>index.jade" ],
          design: {
            ios: {
              pictureAspect: 'backgroundAndMargin',
              backgroundColor: '#ffc40d',
              margin: '14%'
            },
            desktopBrowser: {},
            windows: {
              pictureAspect: 'noChange',
              backgroundColor: '#ffc40d',
              onConflict: 'override'
            },
            androidChrome: {
              pictureAspect: 'noChange',
              themeColor: '#ffc40d',
              manifest: {
                name: 'placeguntohead',
                display: 'browser',
                orientation: 'notSet',
                onConflict: 'override',
                declared: true
              }
            },
            safariPinnedTab: {
              pictureAspect: 'blackAndWhite',
              threshold: 58.75,
              themeColor: '#5bbad5'
            }
          },
          settings: {
            compression: 4,
            scalingAlgorithm: 'Mitchell',
            errorOnImageTooSmall: false
          },
          versioning: {
            paramName: 'v8',
            paramValue: 'favicon'
          }
        }
      }
    },

    wintersmith: {
      build: {
        options: {
          action: "build",
          config: "config-prod.json"
        }
      },
      preview: {
        options: {
          action: "preview",
          config: "config.json"
        }
      }
    },

//////////////////////////////////////////////////////////////////////////////////// COMPRESS
    imagemin: {
      dynamic: {
        options: {
          optimizationLevel: 5,
          pngquant: true
        },
        files: [ {
          expand: true,
          cwd: "<%= config.app.img %>",
          src: [ "**/*.{png,jpg,gif,svg}" ],
          dest: "<%= config.prod.img %>"
        } ]
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
        cwd: "build",
        src: [ "**/*.html" ],
        dest: "build/"
      }
    },

    cacheBust: {
      options: {
        encoding: "utf8",
        algorithm: "md5",
        length: 16,
        deleteOriginals: true
      },
      assets: {
        files: [ {
          expand: true,
          cwd: "<%= config.prod.root %>",
          baseDir: "<%= config.prod.root %>",
          src: [ "**/*.*" ]
        }, ]
      }
    },

    combine_mq: {
      default_options: {
        expand: true,
        cwd: "<%= config.winter.css %>",
        src: "global.css",
        dest: "<%= config.winter.css %>"
      }
    },

//////////////////////////////////////////////////////////////////////////////////// DEPLOY
    "sftp-deploy": {
      build: {
        auth: {
          host: "proemland.com",
          port: 22,
          authKey: "key1"
        },
        cache: "sftpCache.json",
        src: "build",
        dest: "/home/proemadmin/placeguntohead.com",
        serverSep: "/",
        concurrency: 4,
        progress: true
      }
    },

    open: {
      dev: {
        path: "http://localhost:8080",
        app: "Chrome"
      }
    },

    watch: {
      files: [
        "<%= config.app.root %>**/*",
        "templates/*.jade",
        "Gruntfile.js"
      ],
      tasks: [ "less:dev", "newer:copy:images" ],
      options: {
        reload: true,
        livereload: true,
        spawn: false,
        dateFormat: function ( time ) {
          grunt.log.writeln( "Hickory Dickory Dock the Mouse ran up the clock in " + time + "ms" );
        }
      }
    },
    concurrent: {
      target: {
        tasks: [ "wintersmith:preview", "watch" ],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  } );

  require( "matchdep" ).filterDev( "grunt-*" ).forEach( grunt.loadNpmTasks );

  // Develop
  grunt.registerTask( "default", [ "concurrent" ] );

  grunt.registerTask( "init", [ "copy", "less:dev", "imagemin" ] );

  // build it
  grunt.registerTask( "build", [ "copy", "less:production", "wintersmith:build", "combine_mq", "htmlmin", "imagemin",  ] );

  // upload
  grunt.registerTask( "production", [ "build", "htmlmin", "imagemin", "sftp-deploy" ] );
};

