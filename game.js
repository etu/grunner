
'use strict';

var env, keyStates = {};

/**
 * On load, launch the game
 */
window.addEvent('load', function() {
	new Environment();

	$('unpause').addEvent('click', function() {
		env.unpause();
	});
});

window.addEvent('blur', function() {
	env.pause();
});


