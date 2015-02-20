module.exports = function (grunt) {
	grunt.registerTask('build', [
    'bower:install',
		'compileAssets',
		'linkAssetsBuild',
		'clean:build',
		'copy:build',
    'bower:install'
	]);
};
