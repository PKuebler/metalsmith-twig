var assert = require('assert'),
	equal = require('assert-dir-equal'),
	Metalsmith = require('metalsmith'),
	twig = require('..');

describe('metalsmith-twig', function() {
	it('should render a basic template', function(done) {
		Metalsmith(__dirname+'/figures/basic')
			.use(twig())
			.build(function(err) {
				if (err) return done(err);
				equal(__dirname+'/figures/basic/expected', __dirname+'/figures/basic/build');
				done();
			});
	});
});