
'use strict';

var env, keyStates = {};

/**
 * On load, launch the game
 */
window.addEvent('load', function() {
	new Environment();
});

window.addEvent('blur', function() {
	env.pause();
});

