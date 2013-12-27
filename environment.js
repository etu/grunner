
/**
 * Environment class, keeps track of all game objects, canvases, pausing, unpausing
 */
var Environment = new Class({
	Implements: [ Options ],
	options: {
		gameObjects: [],
		width:  640,
		height: 480,
		pause:  false
	},
	/**
	 * Set up environment
	 */
	initialize: function(options) {
		env = this; // Set this to the global env variable

		this.setOptions(options);

		// Get the contexts
		this.options.ctxs = {
			background: $('background').getContext('2d'),
			screen:     $('screen').getContext('2d')
		}

		this.background = new Background();

		this.drawFrame(); // Start gameLoop
	},
	/**
	 * Loop where you should draw your stuff
	 */
	gameLoop: function() {
		// Put things to draw here
		this.background.move();

		this.drawFrame(); // Keep gameLoop running.
	},
	/**
	 * Wrapper for the requestAnimationFrame request
	 *
	 * @TODO: Implement fallbacks if window.requestAnimationFrame doesn't exist
	 */
	drawFrame: function() {
		if(!this.options.pause) {
			window.requestAnimationFrame((function() {
				this.gameLoop();
			}).bind(this));
		}
	},
	/**
	 * Pause function
	 */
	pause: function() {
		this.options.pause = true;
	},
	/**
	 * Unpause function
	 */
	unpause: function() {
		this.options.pause = false;
		this.background.options.lastUpdateTime = Date.now();
		this.drawFrame();
	}
});

