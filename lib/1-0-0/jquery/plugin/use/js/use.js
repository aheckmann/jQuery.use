/*!
* jQuery.use - The jQuery plugin manager
* Copyright (c) 2009 Aaron Heckmann
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*/
/*
* jQuery.use provides you on demand asynchronously loaded
* plugins at your fingertips. Example:
*
*  jQuery.use('jquery-ui-accordion', function ($) {
*      console.log( 'jQuery ui.accordion version ' + $.ui.accordion.version + ' loaded!' );
*      $('#accordion').accordion();
*  });
*
* That's all there is to it. If a plugin has CSS stylesheet
* dependencies or images to preload, they are downloaded as well.
*
* jQuery.use includes with it's default plugin configuration
* everything you need to start using jQuery with the latest
* version of jQuery.ui (1.7.2). You can specify a specific 
* ui plugin, a group of ui plugins, or all of jQuery.ui. 
* Example:
*
*  jQuery.use('jquery-ui-*', function ($) {
*      console.log("All of jQuery UI was downloaded including effects!");
*      $(".draggable").draggable().hide('explode');
*  });
*
* jQuery.use isn't just for downloading plugins and jQuery.ui, 
* it can be configured to download any registered files and all
* of it's dependencies using your own custom modules. To do so
* just call jQuery.use.add() passing in your custom module
* object. Example:
*
*  jQuery.use.add({
*      name: 'my-custom-mod',
*      file: [
*                'http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js',
*                '/some/other/js/downloaded/after/swfobject/is/downloaded.js',
*                'my/js/thatRequires_jQuery-fx/on/the/page.js',
*                '/some/css/stylesheet/i/need.css',
*                'another/css/stylesheet.css'
*            ],
*      requires: 'jquery-fx',
*      provides: ['swfobject', 'my.other.custom.stuff'],
*      preload: ['img/to/preload.png','http://some/other/img/to/preload.gif']
*
*  }).use('my-custom-mod', function ($) {
*      console.log('My custom module and all required dependencies are ready!');
*  })
*
* After you add your module you can immediately use it. And since jQuery.use.add
* returns jQuery you can chain if you want to.
*
* As you probably noticed, there are a few different properties available
* to your custom module configuration object.
*      name: This is the unique package key you'll utilize when calling jQuery.use.
*            If the name you specified has already been taken, an exception will
*            be thrown unless you pass true as the second argument:
*            jQuery.use.add(yourModuleObj, true);
*      file: A string or array of files to include in your module. These will be
*            requested in the order they exist in the array. Where possible,
*            files that can be requested to the configured package service will
*            be prepared and requested with a singe request. 
*  requires: A string or array of strings specifying other module names or URIs
*            which need to be requested and available in the DOM before your
*            specified @file[s] are added.
*  provides: String or array of strings specifying the actual globally
*            accessible properties your module adds to the DOM. These
*            properties are continually tested, and when available, your 
*            jQuery.use callback is fired. 
*   preload: String or array of strings specifying image URIs that should be
*            preloaded.
*
* At any time you can get access to all of the existing modules by making a
* call to jQuery.use.modules() which returns the internal module registry object.
* If you only want a specific module returned you can optionally pass a string
* specifying the module name. This is useful if you ever want to extend
* an existing module by adding new dependencies. Example:
*
*   jQuery.use.modules('jquery-ui-slider').file.push('path/to/my/custom.css');
* 
*
* --
* Configuring jQuery.use 
*
* jQuery.use has a few global configuration settings that allow
* you to customize the following:
*     Your library's root folder (used for image downloading and when a
*        dependency package service is not used).
*     A jQuery UI Theme you want to use
*     Enabling/disabling a *dependency package/rollup service
*     Specifying the URI of such service
*     Whether or not CSS files should utilize the service
*
* To specify your library's root:
* 
*     $.use.lib_root = "http://my.website.com/lib/root/"
*
* By dependency package service I mean a web service which will accept
* a list of file names, look them up, concat them, and output them all
* in one shot. By default, jQuery.use is configured not to use a 
* dependency package service. You can tell jQuery.use to use your 
* service like so:
* 
*     $.use.service = true;
*     $.use.serviceURI = "http://www.myservice.com/";
*
* In this case, jQuery.use would make GET requests for js and css
* dependencies to http://www.myservice.com/ appending the list of
* files to the querystring. Example:
*
*     jQuery.use('jquery-ui-tabs');
*
*     GET http://www.myservice.com/?jquery/ui/themes/base/ui.tabs.css
*     GET http://www.myservice.com/?jquery/ui/js/ui.core.js&jquery/ui/js/ui.tabs.js
* 
*
* By default, jQuery.use is configured to use the ui-lightness theme. 
* If you want to use your own custom theme just drop your theme into 
* the jquery/ui/themes folder and set the following:
*
*     $.use.uiTheme = “yourtheme”;
*
*
* Another default of jQuery.use is to not utilize a server side 
* dependency package service for CSS stylesheets. This is due to the 
* way CSS images are loaded. CSS images load relative to the folder 
* from which the stylesheet was downloaded. If all of your CSS images 
* are not using absolute URIs, your images may not load correctly. If you 
* are sure that your CSS image URIs are all absolute, you can take advantage 
* of your server side dependency package service for stylesheets by 
* setting the following:
*
*    $.use.combineCSS = true;
*
*
*
* Other Notes:
*
* Update - **NOT RECOMMENDED. PLAY AT YOUR OWN RISK!**
* If user requires a different version of jquery they
* CAN download it - it won't interfere with anything
* else on the page if myjQuery = jQuery.noConflict(true) is used.
* myjQuery will then be the instance just downloaded along
* with any plugins attached after it was downloaded and before
* noConflict was called. This can be useful if a page
* module requires a newer/older version of jQuery and
* some plugins but doesn't want to trash whatever else
* is on the page. 
* 
* !! Note: There could be a conflict if the new version
* of jQuery is in the DOM but other scripts are not yet
* and a call is made to jQuery expecting the old version.
* In this case the new version would be the one getting
* called and may bomb out if not fully backwards compatible.
*
*
* It would be nice if jQuery.use() stored references to
* all downloaded code, even different versions of the 
* same plugins, so that if "used" again, no download
* would be necessary. This is a problem for jQuery
* since no official plugin strategy exists and code 
* is written such that it is appended to an existing
* instance of jQuery directly. 
* For now, let's be content with just downloading what
* was requested if it wasn't already. We'll detect
* this by looking at all of our scripts / links in
* the page and splitting out any urls in pkg service
* requests.
*
*
* FUTURE 
* Handling timeouts
* 
*/
(function($, p){
	
	/**
	 * The internal storage for all registered plugins/modules.
	 */
	var modules = {},
	
	/**
	 * The possible states of a request for a package resource.
	 */
	STATUS = {
		LOADED: 3,
		LOADING: 2,
		UNLOADED: 1
	},
	
	VERSION = "1.0.0",
	
	lib_root = false,
	
	serviceURI = false,
	
	useService = false,
	
	/**
	 * For speed and munging.
	 */
	doc = document,
	
	/**
	 * Internal cache for all loading/loaded package urls
	 */
	_loadedPkgs = {},
	
	/** 
	 * Cached ref for speed. Note: HTML5 docs don't 
	 * require the head element.
	 */
	_head = doc.getElementsByTagName("head")[0] || doc.documentElement,
	
	/**
	 * To retrieve fully qualified URIs cross-browser
	 * create an anchor using innerHTML and return it's 
	 * href attr. This div is what is used as it's wrapper.
	 */
	_fullQualURIdiv = doc.createElement('div'),
	
	/**
	 * Prefix for all package urls that get added to
	 * the internal cache (_loadedPkgs). 
	 */
	_urlprefix = "*",
	
	/**
	 * Determines which jQuery ui theme to use by default. This
	 * setting is configurable through jQuery.use.uiTheme. 
	 * file:['jquery/ui/themes/{THEME}/ui.accordion.css']
	 */
	UI_THEME = "ui-lightness",
	
	/**
	 * Overrides useService for CSS files. This is defaulted to
	 * false because css images that use relative paths will be 
	 * pointed at the incorrect folder. Set to true if your
	 * css images all use absolute urls.
	 */
	_combineCSS = false,
	
	/**
	 * Speed and munging.
	 */
	toString = p.toString,
		
	/**
	 * Fetches all of the package dependencies and fires
	 * callback when complete.
	 *
	 * @param pkg {string|array}  
	 * @param callback {function}
	 * @param scope {object} The scope in which callback
	 * will be called when executed.
	 * @returns jQuery
	 */
	_use = function (pkg, callback, scope) {
		
		if ($.use.lib_root === false) {
			throw "jQuery.use.lib_root has not been set. Please set this " +
					"to your libray's root before continuing.";
		}
		
		if ($.use.service && $.use.serviceURI === false) {
			throw "jQuery.use.serviceURI has not been set.";	
		}		
		
		_updateInternalPkgCache();
	
		var deps = _cleanDeps(_getDeps(pkg)),
			numLoaded = 0,
			cb = function () {
				// Sometimes callback gets fired before
				// IE finishes evaluating it's contents.
				// Continually check the DOM until all properties
				// are available.
				if (++numLoaded === 2 && callback) {
					setTimeout( function () {
						if (!_providesAvailable(deps.provides)) {
							return setTimeout(arguments.callee, 30);
						}
														
						callback.call(scope||window, jQuery);
						
						// preload images after js and css so we 
						// don't block.
						_preloadImgs(deps.preload);
						
					}, 30);
				}
								
			}
		;

		// no deps required
		if (0 === deps.js.length + deps.css.length) {
			callback && callback();
			return;
		}
		
		function _isPkg (dep) {
			return dep.isPkg && 
					(dep.url.indexOf("http") == -1 || dep.url.indexOf(serviceURI) === 0);
		}	
		
		function _load (deps, loader, doNotUseService) {
			
			var len = deps.length, 
				dep, 
				src, 
				pkgUrl = "", 
				u = [], 
				usingService = $.use.service && !doNotUseService, 
				serviceURI = _getServiceURI(),
				paramIdx = 100
			;
				
			if (len === 0) {
				cb();
				return;
			}
				
			dep = deps.splice(0,1)[0];
			src = _resolve(dep.url.toLowerCase(), _isPkg(dep), !usingService);
		
			if ( _loadedPkgs.hasOwnProperty(src) ) {
				
				if (_loadedPkgs[src].status === STATUS.LOADING ) {			
					_loadedPkgs[src].queue.push(function(){
						_load(deps, loader, doNotUseService)
					});
					
				} else {
					// already loaded this asset. request the next
					_load(deps, loader, doNotUseService);
				}			
		
			} else {
				
				// try assembling a svc package url
				// request URIs that don't point to the svc seperately
				while ( usingService && _isPkg(dep)) {
							
					pkgUrl += "d"+ (paramIdx++) +"="+ dep.url + "&";
					
					src = _resolve(dep.url.toLowerCase(), true);
					
					_loadedPkgs[src] = {status:STATUS.LOADING, queue:[]};
					
					// Since we are combining as many urls into one
					// request as we can, we need to publish each url's
					// "load" event individually in case other packages
					// depend on them too.
					u[ u.length ] = src;
							
					dep = deps.length && _isPkg(deps[0]) && deps.splice(0,1)[0];
				}
				
				// only true if a dep.isPkg was true
				if ( pkgUrl.length > 0 ) {
					
					// remove the trailing "&"
					pkgUrl = pkgUrl.substring(0, pkgUrl.length-1);
					
					loader( serviceURI+pkgUrl, function () {
						// this was a service request so be sure
						// to fire success on each url included in the
						// request
						for( var i = 0, len = u.length; i < len; i++ ) {
							_fireSuccess(u[i]);
						}
						
						_load( deps, loader, doNotUseService );
					});
					
				} else 			
					// just a normal "non-service" request
					loader( src, function () {	
						_load(deps, loader, doNotUseService) 
					});
																	
			}			
		}

		_load(deps.css, _fetchCSS, !$.use.combineCSS); // for now don't combine css until 
										  // a build process is in place that 
										  // can absolutize the image urls
		_load(deps.js, _fetchJS);
			
		return jQuery;
	},
	
	/**
	 * Preloads imgs.
	 * @param imgs {array} An array of image URIs to preload.
	 */
	_preloadImgs = function (imgs) {
		if (imgs.length) {
			
			// let the browser breath after the css/js requests
			setTimeout(
				function() {
					for (var 
						i = 0, 
						len = imgs.length, 
						PRFX = $.use.lib_root; 
						i < len; i++ 
					) {
						(new Image()).src = PRFX + imgs[i];	
					}
				}, 
				1
			);		
		}
	},
	
	/**
	 * Determines if all of the properties
	 * specified by provides are available.
	 * @param provides {array}
	 * @returns {bool}
	 */
	_providesAvailable = function (provides) {
		var available = true,
			i = 0, 
			len = provides.length,
			names,
			nLen,
			ns,
			j
		;

		while ( available && i < len ) {
		    names = provides[i].split('.');
		 	nLen = names.length;
			ns = window;
			j = 0;

			for (; j < nLen; j++) {	
				if ( !(names[j] in ns) ) {
					available = false;
					break;
				}
				ns = ns[names[j]];
			}
			
		    i++;
		}
		return available;
	},
	
	/**
	 * Makes a request for a css stylesheet and
	 * appends it to the head of the doc firing
	 * cb when complete.
	 * @param src {string}
	 * @param cb {function}
	 */
	_fetchCSS = function (src, cb) { 
		_loadedPkgs[src] = {status:STATUS.LOADING, queue:[]};
		var css = doc.createElement('link');
		css.type = 'text/css';
		css.rel = 'stylesheet';
		css.href = src;
		css.media = 'screen';
		_head.appendChild(css);
		
		// there isn't a way to detect cross-browser when
		// stylesheets are loaded so fire now. There is also
		// no need to run the queue since nothing is in it.
		_fireSuccess(src, cb);
	},
	
	/**
	 * Makes a request for a js resource and
	 * appends it to the head of the doc firing
	 * cb when complete. If the resource has
	 * any pending callbacks in it's queue they
	 * are executed when the resource loads too.
	 * @param src {string}
	 * @param cb {function}
	 */
	_fetchJS = function (src, cb) {	
		_loadedPkgs[src] = {status:STATUS.LOADING, queue:[]};
		
		$.ajax({
			type: "GET",
		  	url: src,
		  	cache: true,
		  	dataType: "script",
		  	success: function () {	  		
				_fireSuccess(src, cb);
			}
		});
	},
	
	/**
	 * Fired when src finishes loaded successfully.
	 * Updates the internal pkg cache status to loaded
	 * and executes everything in it's queue.
	 * @param src {string}
	 * @param cb {function}
	 */
	_fireSuccess = function (src, cb) {
		var loadPkg = _loadedPkgs[src],
			q = loadPkg.queue,
			len = q.length,
			i = 0
		;
		
		loadPkg.status = STATUS.LOADED;	
		cb && cb();	
		for (; i < len; i++) {
			q[i]();
		}
		loadPkg.queue = [];	
	},
	
	/**
	 * Returns a properly suffixed service URI.
	 */
	_getServiceURI = function () {
		var _srvurl = $.use.serviceURI || "";
		return _srvurl + ( _srvurl.indexOf("?") > -1 ? "&" : "?");
	},
	
	/**
	 * Returns an object of all dependencies for the 
	 * specified module.
	 * @param mod {string|array} The name of a module, a URI, 
	 * an array of module names, an array of URIs, or an
	 * array of both URIs and module names.
	 * @param isPackage {bool} True if the module should be
	 * treated as if being requested through the server side
	 * package service.
	 * @returns {Object} { js:[], css:[], provides:[], preload:[] }
	 */
	_getDeps = function (mod, isPackage) {
		var req,
			len,
			css = [],
			js = [],
			preload = [],
			rCSS = /\.css/i,
			i = 0,
			deps,
			rq,
			urls = [],
			provides = [],
			pkg = !!isPackage,
			theme = $.use.uiTheme
		;	
		
		if ( toString.call(mod) === "[object Array]" ) {						
			req = mod;			
		} else if ( modules.hasOwnProperty(mod) ) {						
			req = (modules[mod].requires || []).concat(modules[mod].file || []);
			provides = modules[mod].provides || [];
			preload = modules[mod].preload || [];
			pkg = true;		
		} else {			
			req = [mod];			
		}
				
		for (len = req.length; i<len; i++) {
			rq = req[i];
			
			if ("" === rq) {
				continue;
			}
			
			if (modules.hasOwnProperty(rq)) {							
				
				deps = _getDeps(rq, pkg);	
				js = js.concat(deps.js);
				css = css.concat(deps.css);
				provides = provides.concat(deps.provides);
				preload = preload.concat(deps.preload);
			
			} else {		
				
				if (rCSS.test( rq )) {
					css.push({url: rq.replace("{THEME}", theme), isPkg: pkg});
				} else {
					js.push({url: rq, isPkg: pkg});
				}
														
			}
		}
		
		return {
			js: js,
			css: css,
			provides: provides,
			preload: preload
		};

	},
	
	/**
	 * Removes all js/css duplicates from a dependency object 
	 * @param deps {object}
	 * @returns {object} The dependency object without dups.
	 */
	_cleanDeps = function (deps) {
		deps.js = _removeDups(deps.js);
		deps.css = _removeDups(deps.css);
		deps.preload = _removeDups(deps.preload);
		return deps;
	},
	
	/**
	 * Remove duplicates from an array of pkg objects.
	 * @param deps {array} An array from a dependency object
	 * @returns {array} The dup-less array
	 */
	_removeDups = function (dep) {
		var i = 0, 
			len = dep.length, 
			done = {}, 
			ret=[],
			d,
			key
		;
			
		for (; i < len; i++) {
			d = dep[i];
			key = d.url ? d.url : d;
			if (!done[ key ]) {
				 done[ key ] = 1;
				 ret[ ret.length ] = d;
			}
		}
		
		return ret;
	},
	
	/**
	 * Takes the package urls that are in the DOM and ensures
	 * they're in our internal cache.
	 * @returns _loadedPkgs
	 */
	_updateInternalPkgCache = function () {
		var curURLs = _getURLsFromDOM(),
			i = curURLs.length + 1,
			_url
		;
		
		while (--i) {
			_url = curURLs[i-1].toLowerCase();
			if (!_loadedPkgs.hasOwnProperty(_url)) {
				_loadedPkgs[_url] = {status: STATUS.LOADED};
			}
		}
		
		return _loadedPkgs;
		
	},
	
	/**
	 * Resolves a URI to it's current scope. If isPkg is true
	 * return a specially prefixed identifier, else return a 
	 * fully qualified URI cross-browser.
	 * @param url {string}
	 * @param isPkg {bool} True if the url should be resolved
	 * as part of a package service.
	 * @param serviceDisabled {bool} Overrides whether or not
	 * the url will be resolved to use the service.
	 * @returns {string} The resolved url.
	 */
	_resolve = function (url, isPkg, serviceDisabled) {
		if (isPkg) {
			return (serviceDisabled ? $.use.lib_root : _urlprefix) + url;
		}
			
		_fullQualURIdiv.innerHTML = '<a href="'+ url +'"></a>';
		return _fullQualURIdiv.firstChild.href;
	},
	
	/**
	 * Gets packages from the DOM splitting out resources
	 * loaded from the java pkg manager
	 * @returns {object}  {js:[],css:[]}
	 */
	_getURLsFromDOM = function () {	
		var rgxService = new RegExp(_getServiceURI().replace("?","\\?") ,"i"),
			mapAttr = function (attr) {
				var resolve = _resolve, usingService = $.use.service;
				return function () {
					if (usingService && rgxService.test(this[attr]) ) {		
						return ( 
								_urlprefix + 
								this[attr]
								.replace(rgxService, "")
								.split("&")
								.join("&"+_urlprefix)
							)
							.split("&");
					}				
					return resolve(this[attr]);
				}
			}
		;
		return $("script[src]")
					.map( mapAttr('src') )
					.get()
					.concat(
						$("link[href][type=text/css]").map( mapAttr('href') ).get() 
					);
	},
	
	/**
	 * Adds a new package to the package manager
	 * @param pkg {object|array} The package configuration object or
	 *                           Array of package config objects.
	 *
	 *   pkg.name {string} The name of the package
	 *   pkg.file {string|array} The files to download specific
	 *                           for this pkg.
	 *   pkg.requires {string|array} The name of other packages
	 *                               that are dependencies. These
	 *                               packages will be downloaded first.
	 *   pkg.provides {string|array} The properties that will be 
	 *                               globally accessible once the pkg.files
	 *                               are downloaded. ex: 'jQuery.fn.myPlugin'
	 *   overrides {bool} [optional] If true, this package will 
	 *                                   overwrite any previously registered 
	 *                                   package with the same name. 
	 *                                   ** Use with caution **
	 * @returns jQuery
	 */
	_addPkg = function (pkg, overrides) {
		if (!pkg) {
			return;
		}
		
		// allow array of objects
		if (toString.call(pkg) === "[object Array]") {
			for (var 
				i = 0, 
				len = pkg.length; 
				i<len; 
				i++
			) {
				_addPkg(pkg[i], overrides);
			}	
			return $;
		}
		
		if (modules.hasOwnProperty(pkg.name) && !overrides) {
			throw 'Package name already taken.';
		}
		
		if (pkg.file) {
			pkg.file = $.makeArray(pkg.file);
		}
		
		if (pkg.requires) {
			pkg.requires = $.makeArray(pkg.requires);
		}
		
		if (pkg.provides) {
			pkg.provides = $.makeArray(pkg.provides);
		}
		
		modules[pkg.name] = pkg;
		
		delete modules[pkg.name].name;
		
		return $;
	},
	
	/**
	 * Return the module object specified or all module objects.
	 */
	_modules = function (name) {
		return name ? modules[name] : modules;
	};
	
	$.use = _use;
	$.use.add = _addPkg;
	$.use.modules = _modules;
	$.use.VERSION = VERSION;
	$.use.combineCSS = _combineCSS;
	$.use.uiTheme = UI_THEME;// determines which jquery-ui theme to use for ui stylesheet dependencies 
	$.use.serviceURI = serviceURI; // set this in your project. If $.use.service is set to false this isn't used.
	$.use.service = useService; // turns off the use of the pkging service. Make sure to set $.use.LIB_ROOT if you do this.
	$.use.lib_root = lib_root; // Set this to your library's root. This is used for preloading images and for all 
							// all css and js files when $.use.service is set to false. 

})(jQuery, Object.prototype);