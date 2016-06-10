module.exports = function(grunt) {

  var config = {
    uglify: {
      options: {
        sourceMap: true
      },
      build: {
        dest: 'jquery.password_field.min.js',
        src: 'jquery.password_field.js'
      }
    }
  };

  grunt.initConfig(config);

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', [
    'uglify'
  ]);

};
