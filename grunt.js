
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Grunt file.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

module.exports = function(grunt) {

  // Load custom tasks.
  grunt.loadNpmTasks('grunt-css');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-rigger');
  grunt.loadNpmTasks('grunt-shell');

  // Load configuration.
  var config = grunt.file.readJSON('./config.json');

  grunt.initConfig({

    shell: {

      // NPM
      npm_jasmine: {
        command: 'npm install',
        stdout: true,
        execOptions: {
          cwd: config.base.jasmine
        }
      },

      // BOWER
      bower_cache_clean: {
        command: 'rm -rf ~/.bower',
        stdout: true,
        execOptions: {
          cwd: config.bower.javascript
        }
      },
      bower_php: {
        command: 'bower install',
        stdout: true
      },
      bower_javascript: {
        command: 'bower install',
        stdout: true,
        execOptions: {
          cwd: config.bower.javascript
        }
      },
      bower_tests: {
        command: 'bower install',
        stdout: true,
        execOptions: {
          cwd: config.bower.jasmine
        }
      },

      // LIB
      build_openlayers: {
        command: 'python build.py full OpenLayers.js',
        stdout: true,
        execOptions: {
          cwd: config.build.openlayers
        }
      },
      build_bootstrap: {
        command: 'make bootstrap',
        stdout: true,
        execOptions: {
          cwd: config.build.bootstrap
        }
      },
      move_bootstrap_images: {
        command: 'cp -r img ../../../css/img',
        stdout: true,
        execOptions: {
          cwd: config.build.bootstrap
        }
      },

      // TEST
      phpunit: {
        command: 'phpunit --color',
        stdout: true,
        execOptions: {
          cwd: './tests'
        }
      },
      jasmine_public: {
        command: 'grunt --config gruntPublic.js jasmine',
        stdout: true,
        execOptions: {
          cwd: config.base.jasmine
        }
      },
      jasmine_public_server: {
        command: 'grunt --config gruntPublic.js jasmine-server',
        stdout: true,
        execOptions: {
          cwd: config.base.jasmine
        }
      },
      jasmine_editor: {
        command: 'grunt --config gruntEditor.js jasmine',
        stdout: true,
        execOptions: {
          cwd: config.base.jasmine
        }
      },
      jasmine_editor_server: {
        command: 'grunt --config gruntEditor.js jasmine-server',
        stdout: true,
        execOptions: {
          cwd: config.base.jasmine
        }
      }

    },

    clean: {
      npm: [
        config.base.jasmine+'/node_modules',
      ],
      bower: [
        config.bower.php+'/components',
        config.bower.javascript+'/components',
        config.bower.jasmine+'/components'
      ],
      payload: [
        config.payload.app.css,
        config.payload.app.js.shared,
      ]
    },

    concat: {
      exhibit: {
        src: [
          config.vendor.js.underscore_s,
          config.vendor.js.chosen,
          config.base.js.admin+'/*.js',
        ],
        dest: config.payload.app.js.admin+'/exhibit.js',
        separator: ';'
      },
      neatline: {
        src: [

          // Vendor:
          config.vendor.js.jquery,
          config.vendor.js.underscore,
          config.vendor.js.backbone,
          config.vendor.js.marionette,
          config.vendor.js.neatline,
          config.vendor.js.safesync,
          config.vendor.js.openlayers,
          config.vendor.js.rivets,

          // Neatline:
          config.base.js.shared+'/*.js',
          config.base.js.shared+'/shared/record/record.model.js',
          config.base.js.shared+'/shared/record/record.collection.js',
          config.base.js.shared+'/map/**/*.js',
          config.base.js.shared+'/bubble/**/*.js'

        ],
        dest: config.payload.app.js.shared+'/neatline.js',
        separator: ';'
      },
      editor: {
        src: [

          // Vendor:
          config.vendor.js.jquery,
          config.vendor.js.underscore,
          config.vendor.js.underscore_s,
          config.vendor.js.backbone,
          config.vendor.js.marionette,
          config.vendor.js.neatline,
          config.vendor.js.openlayers,
          config.vendor.js.stamen,
          config.vendor.js.svgtowkt,
          config.vendor.js.routefilter,
          config.vendor.js.toastr,
          config.vendor.js.draggable,
          config.vendor.js.chosen,
          config.vendor.js.bootstrap,
          config.vendor.js.rivets,
          config.vendor.js.codemirror,
          config.vendor.js.codemirror_yaml,

          // Neatline:
          config.base.js.shared+'/*.js',
          config.base.js.shared+'/shared/record/record.model.js',
          config.base.js.shared+'/shared/record/record.collection.js',
          config.base.js.shared+'/map/**/*.js',
          config.base.js.shared+'/bubble/**/*.js',

          // Editor:
          config.base.js.shared+'/editor/*.js',
          config.base.js.shared+'/editor/map/*.js',
          config.base.js.shared+'/editor/menu/*.js',
          config.base.js.shared+'/editor/record/*.js',
          config.base.js.shared+'/editor/records/*.js',
          config.base.js.shared+'/editor/search/*.js',
          config.base.js.shared+'/editor/styles/*.js'

        ],
        dest: config.payload.app.js.shared+'/editor.js',
        separator: ';'
      },
      neatline_css: {
        src: [
          config.payload.app.css+'/public/*.css',
          config.vendor.css.openlayers,
        ],
        dest: config.payload.app.css+'/neatline.css',
      },
      editor_css: {
        src: [
          '<config:concat.neatline_css.src>',
          config.vendor.css.bootstrap,
          config.vendor.css.toastr,
          config.vendor.css.chosen,
          config.vendor.css.codemirror,
          config.payload.app.css+'/editor/*.css'
        ],
        dest: config.payload.app.css+'/editor.css',
      }
    },

    min: {
      exhibit: {
        src: '<config:concat.exhibit.src>',
        dest: config.payload.app.js.admin+'/exhibit.js',
        separator: ';'
      },
      neatline: {
        src: '<config:concat.neatline.src>',
        dest: config.payload.app.js.shared+'/neatline.js',
        separator: ';'
      },
      editor: {
        src: '<config:concat.editor.src>',
        dest: config.payload.app.js.shared+'/editor.js',
        separator: ';'
      }
    },

    stylus: {
      compile: {
        options: {
          paths: [config.base.stylus]
        },
        files: {
          './views/shared/css/payloads/*.css': [
            config.base.stylus+'/public/*.styl',
            config.base.stylus+'/editor/*.styl'
          ]
        }
      }
    },

    rig: {
      jasmine: {
        src: config.base.jasmine+'/helpers/_helpers.js',
        dest: config.base.jasmine+'/helpers/helpers.js',
      }
    },

    copy: {
      jasmine: {
        files: {
          './views/shared/javascripts/tests/payloads/js/':
          './views/shared/javascripts/payloads/*.js',
          './views/shared/javascripts/tests/payloads/css/':
          './views/shared/css/payloads/*.css'
        }
      }
    },

    watch: {
      payload: {
        files: [
          '<config:concat.neatline.src>',
          '<config:concat.editor.src>',
          config.base.stylus+'/**/*.styl',
          config.base.jasmine+'/helpers/*.js'
        ],
        tasks: [
          'compile:concat'
        ]
      },
      jasmine: {
        files: [
          '<config:concat.neatline.src>',
          '<config:concat.editor.src>',
          config.base.stylus+'/**/*.styl',
          config.base.jasmine+'/helpers/*.js',
          config.base.jasmine+'/tests/**/*.js'
        ],
        tasks: [
          'compile:concat',
          'jasmine'
        ]
      }
    }

  });


  // Task aliases.
  // -------------

  // Default task.
  grunt.registerTask('default', 'test');

  // Assemble static assets.
  grunt.registerTask('compile:concat', [
    'clean:payload',
    'concat:exhibit',
    'concat:neatline',
    'concat:editor',
    'stylus',
    'concat:neatline_css',
    'concat:editor_css',
    'copy',
    'rig'
  ]);

  // Assemble/min static assets.
  grunt.registerTask('compile:min', [
    'clean:payload',
    'min:exhibit',
    'min:neatline',
    'min:editor',
    'stylus',
    'concat:neatline_css',
    'concat:editor_css',
    'copy',
    'rig'
  ]);

  // Build the application.
  grunt.registerTask('build', [
    'clean',
    'shell:npm_jasmine',
    'shell:bower_cache_clean',
    'shell:bower_php',
    'shell:bower_javascript',
    'shell:bower_tests',
    'shell:build_openlayers',
    'shell:build_bootstrap',
    'shell:move_bootstrap_images',
    'compile:min'
  ]);

  // Run all tests.
  grunt.registerTask('test', [
    'shell:phpunit',
    'shell:jasmine_public',
    'shell:jasmine_editor'
  ]);

  // Run PHPUnit.
  grunt.registerTask('phpunit', 'shell:phpunit');

  // Run Jasmine.
  grunt.registerTask('jasmine', [
    'shell:jasmine_public',
    'shell:jasmine_editor'
  ]);
  grunt.registerTask(
    'jasmine:public',
    'shell:jasmine_public'
  );
  grunt.registerTask(
    'jasmine:public:server',
    'shell:jasmine_public_server'
  );
  grunt.registerTask(
    'jasmine:editor',
    'shell:jasmine_editor'
  );
  grunt.registerTask(
    'jasmine:editor:server',
    'shell:jasmine_editor_server'
  );


};
