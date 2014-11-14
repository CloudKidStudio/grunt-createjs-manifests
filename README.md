# grunt-createjs-manifests [![Dependency Status](https://david-dm.org/SpringRoll/grunt-createjs-manifests.svg)](https://david-dm.org/SpringRoll/grunt-createjs-manifests)

Grunt plugin to combine the manifests from multiple CreateJS exported files and output to a JSON file.

## Install

```shell
npm install grunt-createjs-manifests
```

## Usage 

```js
grunt.initConfig({
	manifests: {
		all: {
			output: "manifests.json",
			files: "src/assets/*.js",
			remove: "../../deploy/"
		}
	}
});
```

## Properties

Property | Type | Description | Default
---|---|---|---
**output** | _string_ | The output JSON file | null
**files** | _string,array_ | The list of files or single file, also accepts * wildcard | null
**remove** (optional) | _string_ | The string to remove from each manifest file path | ""
**insert** (optional) | _string_ | The string to prepend to each manifest file path | ""
**excludeAudio** (optional) | _boolean_ | Exlude any audio files from createjs in the manifest | true 
**cwd** (optional) | _string_ | The current working directory | "./" 
