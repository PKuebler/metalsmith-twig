
/**
 * Expose `plugin`
 */

module.exports = plugin;

/**
 * Settings
 */

function plugin(opts) {

	opts = opts || {};

	var each = require('async').each,
		Twig = require('twig'),
		twig = Twig.twig;

	var dir = opts.directory || 'views';
	var global = opts.global || {};
	var cache = !opts.cache || opts.cache == true;
	var allowInlineIncludes = !!opts.allowInlineIncludes;
	var namespaces = opts.namespaces || false;

	if(opts.twig){
		Twig = opts.twig;
		twig = Twig.twig;
	}

	Twig.cache(cache);

	Twig.cache(opts.cache || false);

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

			var twigOptions = {
				path: path,
				allowInlineIncludes: allowInlineIncludes,
				load: function(template) {
					data.contents = new Buffer(template.render(data), 'utf8');

					done();
				}
			};

			if (!!namespaces) {
				Object.assign(twigOptions,
					{ namespaces }
				);
			}

			twig(twigOptions);
		}, done);
	};
}
