module.exports = function(grunt) {
	grunt.initConfig({
		// Склеиваем
		concat: {
			main: {
				src: 'public/javascripts/**/*.js',
				dest: 'public/scripts.js'
			},
			style: {
				src: 'public/stylesheets/**/*.css',
				dest: 'public/style.css'
			}
		},
		// Сжимаем
		uglify: {
			main: {
				files: {
					// Результат задачи concat
					'public/scripts.min.js': '<%= concat.main.dest %>'
				}
			}
		},
		// Следим за изменениями файлов
		watch: {
			concat: {
				files: ['<%= concat.main.src %>', '<%= concat.style.src %>'],
				tasks: 'concat'  // Можно несколько: ['lint', 'concat']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	// grunt.loadNpmTasks('grunt-contrib-jshint');
	// grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['concat', 'watch']);
};