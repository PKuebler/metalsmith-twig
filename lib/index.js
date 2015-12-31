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
	var cache = (opts.cache == false)?false:true;

	Twig.cache(cache);

	return function(files, metalsmith, done) {
		var metadata = metalsmith.metadata();

		each(Object.keys(files), function(file, done) {
			var data = files[file];

			if (!data.view)
				return done();

			var path = metalsmith.path(dir, data.view);

			data.relativePath = file.split('/').slice(0, -1).map(function(path) { return '..' }).join('/');
			if (data.relativePath != '')
				data.relativePath += '/';

			data.metadata = metadata;
			data.global = global;

			twig({
				path: path,
				load: function(template) {
					data.contents = new Buffer(template.render(data), 'utf8');

					done();
				}
			});
		}, done);
	};
}
