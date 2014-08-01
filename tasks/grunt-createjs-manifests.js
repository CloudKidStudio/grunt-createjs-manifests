module.exports = function(grunt)
{
	grunt.registerMultiTask('manifests', "Concat CreateJS manifests", function(){
		var glob = require("glob"),
			path = require('path'),
			_ = grunt.util._,
			log = grunt.log,
			done = this.async;

		var data = this.data,
			cwd = data.cwd || process.cwd(),
			remove = data.remove || '',
			insert = data.insert || '',
			output = data.output,
			files = data.files,
			manifest = {};

		if (!output)
		{
			log.error("output field required by the manifests task");
			done(false);
			return;
		}

		if (!files)
		{
			log.error("files field required by the manifests task");
			done(false);
			return;
		}

		function addManifest(file)
		{
			var str = grunt.file.read(file);
			var token = "lib.properties = ";
			var start = str.indexOf(token);

			// Ignore if we don't have the lib.properities
			if (start === -1) return;

			var properties = str.substring(
				start + token.length, 
				str.search(/\;[\n\t\r]*\/\/ stage content\:/)
			);
			eval("properties = " + properties);
			_.each(properties.manifest, function(asset, i){
				asset.src = insert + asset.src.replace(remove, '');
			});
			manifest[path.basename(file, '.js')] = properties.manifest;
		}

		_.each(_.isArray(files) ? files : [files], function(file){
			// Regular file include
			if (file.indexOf("*") === -1) 
				addManifest(file);
			// Glob expression with wildcard
			else 
			{
				glob(file, { cwd: cwd, sync: true }, function(er, globFiles) {
					_.each(globFiles, addManifest);
				});
			}
		});

		grunt.file.write(output, JSON.stringify(manifest, null, "\t"));

		done();
	});
};