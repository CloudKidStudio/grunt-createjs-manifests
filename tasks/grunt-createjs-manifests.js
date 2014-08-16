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
			manifest = {},
			manifestFiles = [];

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
			var assets = properties.manifest;
			_.each(assets, function(asset, i){
				// don't include any sound files published with the manifest
				if (asset.src.indexOf('mp3') !== -1 || asset.src.indexOf('.wav') !== -1)
				{

					assets.splice(i, 1);
				}
				else
				{
					asset.src = insert + asset.src.replace(remove, '');
				}
			});
			manifest[path.basename(file, '.js')] = assets;

			// Add to a single collection of all manifest files
			manifestFiles = manifestFiles.concat(assets);
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

		// The duplicate assets id, so we don't check the same asset
		// more than once
		var dupes = [];

		// Get the dirty duplicates
		_.each(manifestFiles, function(asset){
			// Check for duplicates with the id and different source files
			_.each(manifestFiles, function(check){
				if (check.src != asset.src && check.id == asset.id && dupes.indexOf(check.id) === -1)
				{
					log.subhead("Warning: The asset ID ('" + check.id + "') has multiple sources:");
					log.warn(check.src);
					log.warn(asset.src);
					dupes.push(check.id);
				}
			});
		});

		done();
	});
};