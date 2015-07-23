var each = require('async').each,
	Twig = require('twig'),
	twig = Twig.twig;

/**
 * Expose `plugin`
 */

module.exports = plugin;

/**
 * Settings
 */

function plugin(opts) {
	opts = opts || {};

	var dir = opts.directory || 'views';
	var global = opts.global || {};

	return function(files, metalsmith, done) {
		var metadata = metalsmith.metadata();

		each(Object.keys(files), function(file, done) {
			var data = files[file];

			if (!data.view)
				return done();

			var path = metalsmith.path(dir, data.view);

			data.global = global;

			twig({
				path: path,
				load: function(template) {
					data.contents = template.render(data);

					done();
				}
			});
		}, done);
	};
}