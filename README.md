# jQuery.use

> jQuery.use provides you on demand asynchronously loaded plugins at your fingertips. Example:

	jQuery.use('jquery-ui-accordion', function ($) {
    	console.log( 'jQuery ui.accordion version ' + $.ui.accordion.version + ' loaded!' );
    	$('#accordion').accordion();
	});

That's all there is to it. If a plugin has CSS stylesheet dependencies or images to preload, they are downloaded as well.

jQuery.use includes with its default plugin configuration everything you need to start using jQuery with the latest version of jQuery.ui (1.7.2). You can specify a specific ui plugin, a group of ui plugins, or all of jQuery.ui. 
Example:

	jQuery.use('jquery-ui-*', function ($) { 
		console.log("All of jQuery UI was downloaded including effects!");
		$(".draggable").draggable().hide('explode');
	});

jQuery.use isn't just for downloading plugins and jQuery.ui, it can be configured to download any registered files and all of it's dependencies using your own custom modules. To do so just call `jQuery.use.add()` passing in your custom module object. 
Example:

	jQuery.use.add({
		name: 'my-custom-mod',
		file: [
			'http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js',
			'/some/other/js/downloaded/after/swfobject/is/downloaded.js',
			'my/js/thatRequires_jQuery-fx/on/the/page.js',
			'/some/css/stylesheet/i/need.css',
			'another/css/stylesheet.css'
		],
		requires: 'jquery-fx',
		provides: ['swfobject', 'my.other.custom.stuff'],
		preload: [
			'img/to/preload.png',
			'http://some/other/img/to/preload.gif'
		]
	}).use('my-custom-mod', function ($) {
		console.log('My custom module and all required dependencies are ready!');
	});

After you add your module you can immediately use it. And since `jQuery.use.add` returns `jQuery` you can chain if you want to.

As you probably noticed, there are a few different properties available to your custom module configuration object.

- 	name: This is the unique package key you'll utilize when calling `jQuery.use`. If the name you specified has already been taken, an exception will be thrown unless you pass true as the second argument: `jQuery.use.add(yourModuleObj, true);`
- 	file: A string or array of files to include in your module. These will be requested in the order they exist in the array. Where possible, files that can be requested to the configured package service will be prepared and requested with a singe request. 
- 	requires: A string or array of strings specifying other module names or URIs which need to be requested and available in the DOM before your specified @file[s] are added.
- 	provides: String or array of strings specifying the actual globally accessible properties your module adds to the DOM. These properties are continually tested, and when available, your jQuery.use callback is fired. 
- 	preload: String or array of strings specifying image URIs that should be preloaded.

At any time you can get access to all of the existing modules by making a call to `jQuery.use.modules()` which returns the internal module registry object. If you only want a specific module returned you can optionally pass a string specifying the module name. This is useful if you ever want to extend an existing module by adding new dependencies. 
Example:

	jQuery.use.modules('jquery-ui-slider').file.push('path/to/my/custom.css');
 

##Configuring jQuery.use 

jQuery.use has a few global configuration settings that allow you to customize the following:

- 	Your library's root folder (used for image downloading and when a dependency package service is not used).
- 	A jQuery UI Theme you want to use
- 	Enabling/disabling a *dependency package/rollup service
- 	Specifying the URI of such service
- 	Whether or not CSS files should utilize the service

To specify your library's root:
 
	$.use.lib_root = "http://my.website.com/lib/root/"

By dependency package service I mean a web service which will accept a list of file names, look them up, concat them, and output them all in one shot. By default, jQuery.use is configured not to use a dependency package service. You can tell jQuery.use to use your service like so:
 
	$.use.service = true;
	$.use.serviceURI = "http://www.myservice.com/";

In this case, jQuery.use would make GET requests for js and css dependencies to http://www.myservice.com/ appending the list of files to the querystring. 
Example:

	jQuery.use('jquery-ui-tabs');

	GET http://www.myservice.com/?jquery/ui/themes/base/ui.tabs.css
	GET http://www.myservice.com/?jquery/ui/js/ui.core.js&jquery/ui/js/ui.tabs.js
 

By default, jQuery.use is configured to use the ui-lightness theme. If you want to use your own custom theme just drop your theme into the jquery/ui/themes folder and set the following:

	$.use.uiTheme = “yourtheme”;


Another default of jQuery.use is to not utilize a server side dependency package service for CSS stylesheets. This is due to the way CSS images are loaded. CSS images load relative to the folder from which the stylesheet was downloaded. If all of your CSS images are not using absolute URIs, your images may not load correctly. If you are sure that your CSS image URIs are all absolute, you can take advantage of your server side dependency package service for stylesheets by setting the following:

	$.use.combineCSS = true;


###Other Notes:

Update - **NOT RECOMMENDED. PLAY AT YOUR OWN RISK!**
If user requires a different version of jQuery they CAN download it - it won't interfere with anything else on the page if `myjQuery = jQuery.noConflict(true)` is used. `myjQuery` will then be the instance just downloaded along with any plugins attached after it was downloaded and before `noConflict()` was called. This can be useful if a page module requires a newer/older version of jQuery and some plugins but doesn't want to trash whatever else is on the page. 

!! Note: There could be a conflict if the new version of jQuery is in the DOM but other scripts are not yet and a call is made to jQuery expecting the old version. In this case the new version would be the one getting called and may bomb out if not fully backwards compatible.

It would be nice if jQuery.use stored references to all downloaded code, even different versions of the same plugins, so that if "used" again, no download would be necessary. This is a problem for jQuery since no official plugin strategy exists and code is written such that it is appended to an existing instance of jQuery directly. For now, let's be content with just downloading what was requested if it wasn't already. We'll detect this by looking at all of our scripts / links in the page and splitting out any urls in pkg service requests.