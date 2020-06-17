
var instance = {};

// Private variables
var ua= navigator.userAgent;

// Detect browser type and version
var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1) return data[i].identity;
			}
			else if (dataProp) return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			// for new MS Edge
			string: navigator.userAgent,
			subString: "Edge",
			identity: "Edge",
			versionSearch: "Edge"
		},
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{	// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Internet Explorer",
			versionSearch: "MSIE"
		},
		{	// for new IE v11
			string: navigator.userAgent,
			subString: "rv:11.0",
			identity: "Internet Explorer",
			versionSearch: "rv"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{	// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	]
};
BrowserDetect.init();
instance.browser = BrowserDetect.browser;
instance.browserVer = BrowserDetect.version;

// Detect Touch Device
instance.isTouchDevice = (typeof(window.ontouchstart) != 'undefined') ? true : false;
window.isTouchDevice = instance.isTouchDevice;   // To support old versions of Hype interaction

// Detect OS and version
instance.os="Unknown OS";
if (ua.indexOf("Win")!=-1) instance.os="Windows";
if (ua.indexOf("Windows")!=-1) instance.os="Windows";
if (ua.indexOf("Mac")!=-1) instance.os="MacOS";
if (ua.indexOf("iPad")!=-1) instance.os="iPad";
if (ua.indexOf("iPhone")!=-1) instance.os="iPhone";
if (ua.indexOf("X11")!=-1) instance.os="UNIX";
if (ua.indexOf("Linux")!=-1) instance.os="Linux";
if (ua.indexOf("Android")!=-1) instance.os="Android";

instance.osVer="Unknown Ver";
if (ua.indexOf("NT 5.1")!=-1) instance.osVer="XP";
if (ua.indexOf("NT 6.0")!=-1) instance.osVer="Vista";
if (ua.indexOf("NT 6.1")!=-1) instance.osVer="7";
if (ua.indexOf("NT 6.2")!=-1) instance.osVer="8";
if (ua.indexOf("NT 6.3")!=-1) instance.osVer="8.1";
if (ua.indexOf("NT 10")!=-1) instance.osVer="10";
if (ua.indexOf("Mac OS X ")!=-1) {
	instance.osVer = ua.toUpperCase().match(/MAC OS X [0-9_.]*/).toString().substr(9, 4).replace(/_/g, ".");
}
if (ua.indexOf("Android ")!=-1) {
	instance.osVer = ua.toUpperCase().match(/ANDROID [\d+\.]{3,5}/).toString().substr(8, 4).replace(/_/g, ".");
}
if (ua.indexOf("CPU OS ")!=-1) {
	instance.osVer = ua.toUpperCase().match(/CPU OS [0-9_.]*/).toString().substr(7, 4).replace(/_/g, ".");
}

// Detect iOS or Android
instance.ios = (instance.os == "iPad") ? true : false;
instance.android = (instance.os == "Android") ? true : false;
instance.isTablet = (instance.ios || instance.android) ? true : false;



// Detect touchPc and goofy browsers combinations
instance.isTouchPc = ((instance.isTouchDevice) && (instance.os == "Windows")) ? true : false;
instance.isPcChromeTouch = ((instance.isTouchPc) && (instance.browser == "Chrome")) ? true : false;
instance.isPcFirefoxTouch = ((instance.isTouchPc) && (instance.browser == "Firefox")) ? true : false;

// Detect MSpointer support
instance.pointerEnabled = window.navigator.pointerEnabled;
instance.msPointerEnabled = (instance.pointerEnabled) ? false : window.navigator.msPointerEnabled;

// Detect IE
instance.ie = (instance.pointerEnabled || instance.msPointerEnabled) ? true : false;

// Screen size
instance.screenW = screen.width;
instance.screenH = screen.height;

// Language Detection
instance.launguage = navigator.language || navigator.userLanguage;


// Viewport size
instance.browserW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
instance.browserH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

// Update viewport size info when resizing
window.onresize = function(event) {
    instance.browserW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
	instance.browserH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
};


// export
module.exports = instance;