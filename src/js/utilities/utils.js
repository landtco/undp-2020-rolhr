
// variables
var exports = {};



 // Default Parameter check and assign
exports.defPar = function(arg, def) { return (typeof arg == 'undefined' ? def : arg); }


// object merge utility to assign default options
exports.merge_options = function(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}


// loads javascript files passed as paramaters then calls slide init
exports.load_scripts = function(ua,cb) {
	var scriptLoadCount = 0;
	var scriptLoadedCount = 0;
	
	function loadScript() {
		var head= document.getElementsByTagName('head')[0];
			var script= document.createElement('script');
			script.onload = function() {
				scriptLoadedCount++;
				if (scriptLoadedCount == ua.length) {
					cb();
				}
				else {
					scriptLoadCount++;
					loadScript();
				}
			}
			script.type= 'text/javascript';
			script.src= ua[scriptLoadCount];
			head.appendChild(script);
			
	}
	loadScript();
}


// removes script tags from page that match to a seach value (such as a domain or file name)
exports.clear_scripts = function(mode, value) {
	//var $ = require('jquery');

	if (mode == 'domain') {
		var scripts = document.getElementsByTagName("script");
		//var scripts = $('script');
        for(var i = 0; i < scripts.length; i++) {

            if (scripts[i].src.indexOf(value) != -1) {
                scripts[i].parentNode.removeChild(scripts[i]);
            }
        }
    }
}


// Loads css files
exports.load_css = function(ua) {
	var cssCount = 0;

	function loadStylesheet() {
		var head = document.getElementsByTagName("head")[0];
		var cssNode = document.createElement('link');
		cssNode.type = 'text/css';
		cssNode.rel = 'stylesheet';
		cssNode.href = ua[cssCount];
		cssNode.media = 'screen';
		head.appendChild(cssNode);
		cssCount++;
		if (cssCount < ua.length) loadStylesheet();
	}
	loadStylesheet();
},


// find an object in an array where one of the objects properties matches a defined value and return that object
exports.find_object_in_array = function(array, key, value) {
	//var elementPos = array.map(function(x) {return x[key]; }).indexOf(value);
	//var objectFound = array[elementPos];
	//return objectFound;

	for (var i=0; i<array.length; i++) {
		if (array[i][key] == value) return array[i];
	}
	return false;
}


exports.random_string = function(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}


exports.hex_to_rgba = function(hex, alpha) {
	var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+ alpha + ')';
    }
    throw new Error('Bad Hex')
}

// export
module.exports = exports;