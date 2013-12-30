
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


window.addEvent('keydown', function(e) {
	if(keyStates[e.key] !== null) keyStates[e.key] = true;

	if(keyStates.p) { // Hotkey for pausing/unpausing
		if(env.options.pause) env.unpause();
		else env.pause();
	}
});
window.addEvent('keyup', function(e) {
	delete keyStates[e.key];
});
