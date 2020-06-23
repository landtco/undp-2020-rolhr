module.exports = {
	context: __dirname + "/src/js/",
	entry: {
		undp: "./app.js"
	},
	mode: "production",
	output: {
		path: __dirname + "/public/assets/js",
		filename: "[name].bundle.js",
		publicPath: "assets/js/"
	},
	module: {
  	},
	resolve: {
		extensions: ['.js', '.html'],
		alias: {
		  	'Utilities': __dirname + "/src/js/utilities/",
		  	'Modules': __dirname + "/src/js/modules/",
		  	'Vendor': __dirname + "/src/js/vendor/",
		}
	}
}