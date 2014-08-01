# grunt-createjs-manifests

Grunt plugin to combine the manifests of multiple CreateJS exported files.

## Install

```shell
npm install CloudKidStudio/grunt-createjs-manifests
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
**cwd** (optional) | _string_ | The current working directory | "./" 