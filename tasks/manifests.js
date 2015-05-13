module.exports = function(grunt)
{
	// Include libraries
	var glob = require("glob"),
		path = require('path'),
		_ = require('lodash');

	grunt.registerMultiTask('manifests', "Concat CreateJS manifests", function()
	{
		// prepare options
		var options = this.options(
		{
			space: "", // JSON stringify whitespace
			lowercase: true, // lowercase the key
			audio: false // show the audio
		});

		var log = grunt.log,
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
			var token = "manifest: [";
			var start = str.indexOf(token);

			// Ignore if we don't have the lib.properities
			if (start === -1) return;

			var assets = str.substring(
				// -1 so we include the opening bracket in the substring, but 
				// don't have to remove it from the search
				start + token.length - 1,
				str.search(/\]/) + 1
			);

			/* jshint ignore:start */
			eval("assets = " + assets);
			/* jshint ignore:end */

			_.each(assets, function(asset, i)
			{
				asset.src = insert + asset.src.replace(remove, '');
			});

			// exclude createjs audio export paths from the manifest
			if (!options.audio)
			{
				assets = _.filter(assets, function(asset)
				{
					return !/\.(mp3|wav|aif|aiff)$/.test(asset.src);
				});
			}

			var name = path.basename(file, '.js');
			if (options.lowercase)
			{
				name = name.charAt(0).toLowerCase() + name.substr(1);
			}
			manifest[name] = assets;

			// Add to a single collection of all manifest files
			manifestFiles = manifestFiles.concat(assets);
		}

		_.each(_.isArray(files) ? files : [files], function(file)
		{
			// Regular file include
			if (file.indexOf("*") === -1)
			{
				addManifest(file);
			}
			// Glob expression with wildcard
			else
			{
				_.each(glob.sync(file,
				{
					cwd: cwd
				}), addManifest);
			}
		});

		grunt.file.write(output, JSON.stringify(manifest, null, options.space));

		// The duplicate assets id, so we don't check the same asset
		// more than once
		var dupes = [];

		// Get the dirty duplicates
		_.each(manifestFiles, function(asset)
		{
			// Check for duplicates with the id and different source files
			_.each(manifestFiles, function(check)
			{
				if (check.src != asset.src && check.id == asset.id && dupes.indexOf(check.id) === -1)
				{
					log.subhead("Warning: The asset ID ('" + check.id + "') has multiple sources:");
					log.warn(check.src);
					log.warn(asset.src);
					dupes.push(check.id);
				}
			});
		});
	});
};