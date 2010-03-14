// jquery ui defaults
/**

Naming Conventions:
	All plugin names are lowercase and should mimic their
	code structure, replacing "." with "-". jQuery.effects
	can be shortened to jquery-fx.
	
	Examples:
	
		code: jQuery.aop
		module: jquery-aop
		
		code: jQuery.effects.core
		module: jquery-fx-core
		
		code: jQuery.ui.tabs
		module: jquery-ui-tabs
		
	jQuery non-ui plugins
		'jquery-pluginname'
	jQuery ui plugins
		'jquery-ui-pluginname'
	jQuery ui effects plugins
		'jquery-fx-pluginname'
		
*/
jQuery.use.add([		
	// jquery ui
	{
		name: 'jquery-ui-core',
		file: 'jquery/ui/js/ui.core.js',
		provides: ['jQuery.ui','jQuery.widget', 'jQuery.ui.mouse']
	},
	{
		name: 'jquery-ui-accordion',
		file: ['jquery/ui/js/ui.accordion.js', 'jquery/ui/themes/{THEME}/ui.accordion.css'],
		requires: 'jquery-ui-core',
		provides: ['jQuery.ui.accordion','jQuery.fn.accordion']
	},
	{
		name: 'jquery-ui-datepicker',
		file: ['jquery/ui/js/ui.datepicker.js', 'jquery/ui/themes/{THEME}/ui.datepicker.css'],
		requires: 'jquery-ui-core',
		provides: ['jQuery.ui.datepicker', 'jQuery.fn.datepicker']
	},
	{
		name: 'jquery-ui-dialog',
		file: ['jquery/ui/js/ui.dialog.js', 'jquery/ui/themes/{THEME}/ui.dialog.css'],
		requires: 'jquery-ui-core',
		provides: ['jQuery.ui.dialog', 'jQuery.fn.dialog']
	},
	{
		name: 'jquery-ui-draggable',
		file: 'jquery/ui/js/ui.draggable.js',
		requires: 'jquery-ui-core',
		provides: ['jQuery.ui.draggable', 'jQuery.fn.draggable']
	},
	{
		name: 'jquery-ui-droppable',
		file: 'jquery/ui/js/ui.droppable.js',
		requires: 'jquery-ui-core',
		provides: ['jQuery.ui.droppable', 'jQuery.fn.droppable', 'jQuery.ui.intersect']
	},
	{
		name: 'jquery-ui-progressbar',
		file: ['jquery/ui/js/ui.progressbar.js', 'jquery/ui/themes/{THEME}/ui.progressbar.css'],
		requires: 'jquery-ui-core',
		provides: ['jQuery.ui.progressbar', 'jQuery.fn.progressbar']
	},
	{
		name: 'jquery-ui-resizable',
		file: ['jquery/ui/js/ui.resizable.js', 'jquery/ui/themes/{THEME}/ui.resizable.css'],
		requires: 'jquery-ui-core',
		provides: ['jQuery.ui.resizable', 'jQuery.fn.resizable']
	},
	{
		name: 'jquery-ui-selectable',
		file: 'jquery/ui/js/ui.selectable.js',
		requires: 'jquery-ui-core',
		provides: ['jQuery.ui.selectable', 'jQuery.fn.selectable']
	},
	{
		name: 'jquery-ui-slider',
		file: ['jquery/ui/js/ui.slider.js', 'jquery/ui/themes/{THEME}/ui.slider.css'],
		requires: 'jquery-ui-core',
		provides: ['jQuery.ui.slider', 'jQuery.fn.slider']
	},
	{
		name: 'jquery-ui-sortable',
		file: 'jquery/ui/js/ui.sortable.js',
		requires: 'jquery-ui-core',
		provides: ['jQuery.ui.sortable', 'jQuery.fn.sortable']
	},
	{
		name: 'jquery-ui-tabs',
		file: ['jquery/ui/js/ui.tabs.js', 'jquery/ui/themes/{THEME}/ui.tabs.css'],
		requires: 'jquery-ui-core',
		provides: ['jQuery.ui.tabs', 'jQuery.fn.tabs']
	},
	{
		name: 'jquery-ui-*',
		requires: ['jquery-ui-core','jquery-ui-accordion','jquery-ui-datepicker',
		'jquery-ui-dialog','jquery-ui-draggable','jquery-ui-droppable',
		'jquery-ui-progressbar','jquery-ui-resizable','jquery-ui-selectable',
		'jquery-ui-slider','jquery-ui-sortable','jquery-ui-tabs']
	},

	// jquery ui fx 
	{
		name: 'jquery-fx-core',
		file: 'jquery/ui/js/effects.core.js',
		provides: ['jQuery.effects', 'jQuery.easing']
	},
	{
		name: 'jquery-fx-blind',
		file: 'jquery/ui/js/effects.blind.js',
		requires: 'jquery-fx-core',
		provides: 'jQuery.effects.blind'
	},		
	{
		name: 'jquery-fx-bounce',
		file: 'jquery/ui/js/effects.bounce.js',
		requires: 'jquery-fx-core',
		provides: 'jQuery.effects.bounce'
	},
	{
		name: 'jquery-fx-clip',
		file: 'jquery/ui/js/effects.clip.js',
		requires: 'jquery-fx-core',
		provides: 'jQuery.effects.clip'
	},
	{
		name: 'jquery-fx-drop',
		file: 'jquery/ui/js/effects.drop.js',
		requires: 'jquery-fx-core',
		provides: 'jQuery.effects.drop'
	},
	{
		name: 'jquery-fx-explode',
		file: 'jquery/ui/js/effects.explode.js',
		requires: 'jquery-fx-core',
		provides: 'jQuery.effects.explode'
	},
	{
		name: 'jquery-fx-fold',
		file: 'jquery/ui/js/effects.fold.js',
		requires: 'jquery-fx-core',
		provides: 'jQuery.effects.fold'
	},
	{
		name: 'jquery-fx-highlight',
		file: 'jquery/ui/js/effects.highlight.js',
		requires: 'jquery-fx-core',
		provides: 'jQuery.effects.highlight'
	},
	{
		name: 'jquery-fx-pulsate',
		file: 'jquery/ui/js/effects.pulsate.js',
		requires: 'jquery-fx-core',
		provides: 'jQuery.effects.pulsate'
	},
	{
		name: 'jquery-fx-scale',
		file: 'jquery/ui/js/effects.scale.js',
		requires: 'jquery-fx-core',
		provides: 'jQuery.effects.scale'
	},
	{
		name: 'jquery-fx-shake',
		file: 'jquery/ui/js/effects.shake.js',
		requires: 'jquery-fx-core',
		provides: 'jQuery.effects.shake'
	},
	{
		name: 'jquery-fx-slide',
		file: 'jquery/ui/js/effects.slide.js',
		requires: 'jquery-fx-core',
		provides: 'jQuery.effects.slide'
	},
	{
		name: 'jquery-fx-transfer',
		file: 'jquery/ui/js/effects.transfer.js',
		requires: 'jquery-fx-core',
		provides: 'jQuery.effects.transfer'
	},	
	{
		name: 'jquery-fx-*',
		requires: ['jquery-fx-core', 'jquery-fx-blind', 'jquery-fx-bounce',
		'jquery-fx-clip', 'jquery-fx-drop', 'jquery-fx-explode', 'jquery-fx-fold',
		'jquery-fx-highlight', 'jquery-fx-pulsate', 'jquery-fx-scale',
		'jquery-fx-shake', 'jquery-fx-slide', 'jquery-fx-transfer']
	}
]);