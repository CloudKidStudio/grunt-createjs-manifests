# grunt-createjs-manifests

[![Build Status](https://travis-ci.org/SpringRoll/grunt-createjs-manifests.svg)](https://travis-ci.org/SpringRoll/grunt-createjs-manifests) [![Dependency Status](https://david-dm.org/SpringRoll/grunt-createjs-manifests.svg?style=flat)](https://david-dm.org/SpringRoll/grunt-createjs-manifests) [![npm version](https://badge.fury.io/js/grunt-createjs-manifests.svg)](http://badge.fury.io/js/grunt-createjs-manifests)

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

## Options

Option | Type | Description | Default
---|---|---|---
**space** (optional) | _string_ | White-space character for JSON stringify output | ""
**lowercase** (optional) | _boolean_ | If the manifest keys should be lowercased (first character is lowercased) | true
**audio** (optional) | _boolean_ | If we should include audio files (.mp3, etc) | false 

```js
grunt.initConfig({
	manifests: {
		release: {
			output: "manifests.json",
			files: "src/assets/*.js",
			remove: "../../deploy/"
		},
		debug: {
			output: "manifests.json",
			files: "src/assets/*.js",
			remove: "../../deploy/",
			options: {
				// output is easier to read
				space: "\t"
			}
		}
	}
});
```
