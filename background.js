
/**
 * Background class, handles falling leafs and trees
 */
var Background = new Class({
	Implements: [ Options ],
	options: {
		lastUpdateTime: Date.now(),
		ctx:            null,
		frameSkip:      false
	},
	leafs: [],
	initialize: function(options) {
		this.setOptions(options);

		// Set reference to canvas context
		this.options.ctx = env.options.ctxs.background;

		// Populate list of Leaf locations
		for(var i = 0; i < Number.random(10, 25); i++) {
			this.leafs.push(new Leaf());
		}
	},
	/**
	 * Move/Draw function
	 */
	move: function(forwardDelta) {
		var delta = (Date.now() - this.options.lastUpdateTime) / 1000;

		Array.each(this.leafs, function(leaf) { // Move all Leafs
			leaf.move(delta, forwardDelta);
		});

		this.options.lastUpdateTime = Date.now();         // Save date to use for next delta calculation

		if(this.options.frameSkip) { this.draw(); }       // Only draw every second frame

		this.options.frameSkip = !this.options.frameSkip; // Toggle frameskip
	},
	/**
	 * Draw leafs and trees
	 */
	draw: function() {
		this.options.ctx.clearRect(0, 0, env.options.width, env.options.height); // Clear canvas

		Array.each(this.leafs, function(leaf) { // Render Leafs
			leaf.draw(this.options.ctx);
		}, this);
	}
});


var Leaf = new Class({
	Implements: [ Options ],
	options: {
		color: '#00FF00',
		speed: 0,
		x: 0,
		y: 0,
		spin: 0,
		width:  40,
		height: 40
	},
	initialize: function(options) {
		if(options == undefined) options = {};
		options.speed = Number.random(25, 50);
		options.x     = Number.random(0, env.options.width);
		options.y     = Number.random(0, env.options.height);

		this.setOptions(options);
	},
	move: function(delta, forwardDelta) {
		// Move the star
		this.options.y += (this.options.speed * delta);

		// If outside, move to the right part of the screen
		// And set a new speed.
		if(this.options.y - this.options.width > env.options.height) {
			this.options.y = -this.options.height;
			this.options.speed = Number.random(50, 100);
		}
	},
	draw: function(ctx) {
		ctx.fillStyle = this.options.color;
		ctx.fillRect(Math.round(this.options.x), this.options.y, this.options.width, this.options.height); // X, Y, Width, Height
	}
});

