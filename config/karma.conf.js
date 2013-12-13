module.exports = function(config){
    config.set({
    basePath : '../',

    files : [
      'www/lib/angular/angular.js',
      'www/lib/angular/angular-*.js',
      'test/lib/angular/angular-mocks.js',
	  'common/js/node-export.js',
      'src/www/js/**/*.js',
      'test/unit/**/common.js'
    ],

		exclude: ['www/lib/angular/angular-loader*.js'],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'       
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

})}
