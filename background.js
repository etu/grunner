
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
	trees: [],
	initialize: function(options) {
		this.setOptions(options);

		// Set reference to canvas context
		this.options.ctx = env.options.ctxs.background;

		// Populate list of Leaf locations
		for(var i = 0; i < Number.random(5, 10); i++) {
			this.leafs.push(new Leaf());
		}

		Array.each([env.options.width, env.options.width / 2, 0], function(x) {
			this.trees.push(new Tree({x: x}));
		}, this);
	},
	/**
	 * Move/Draw function
	 */
	move: function(forwardDelta) {
		var delta = (Date.now() - this.options.lastUpdateTime) / 1000;

		Array.each(this.leafs, function(leaf) { // Move all Leafs
			leaf.move(delta, forwardDelta);
		});

		Array.each(this.trees, function(tree) { // Move all Trees
			tree.move(delta, forwardDelta);
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

		Array.each(this.trees, function(tree) { // Render Trees
			tree.draw(this.options.ctx);
		}, this);

		Array.each(this.leafs, function(leaf) { // Render Leafs
			leaf.draw(this.options.ctx);
		}, this);
	}
});


/**
 * Leaf class, handles leafs
 */
var Leaf = new Class({
	Implements: [ Options ],
	options: {
		x: 0,
		y: 0,

		speed: 0,

		width:  40,
		height: 40,

		frame: 0,
		frames: 4,
		frameDelta: 0,
		frameChange: 250 / 1000,
		frameDirection: 1,

		spritemap: new Image()
	},
	initialize: function(options) {
		if(options == undefined) options = {};
		options.speed = Number.random(25, 50);
		options.x     = Number.random(0, env.options.width);
		options.y     = Number.random(0, env.options.height);

		this.options.spritemap.src = 'imgs/falling_leaf.png';

		this.setOptions(options);
	},
	move: function(delta, forwardDelta) {
		if(forwardDelta == undefined) forwardDelta = 0;

		// Move the leaf
		this.options.y += (this.options.speed * delta);
		this.options.x -= (this.options.speed * forwardDelta);

		// If outside, move to the right part of the screen
		// And set a new speed.
		if(this.options.y - this.options.width > env.options.height) {
			this.options.y = -this.options.height;
			this.options.speed = Number.random(50, 100);
		}
		if(this.options.x + this.options.width < 0) {
			this.options.x = Number.random(0, env.options.width);
		}

		// Handle frame change
		if(this.options.frameDelta > this.options.frameChange) {
			this.options.frame += this.options.frameDirection;

			if(this.options.frame > this.options.frames) {
				this.options.frameDirection *= -1;
				this.options.frame--;
			}
			if(this.options.frame < 0) {
				this.options.frameDirection *= -1;
				this.options.frame++;
			}

			this.options.frameDelta = 0;
		}

		// Use some extra data then normal delta to make speed make
		// the animation frames at different rate on different leafs
		this.options.frameDelta += (delta + Math.abs(forwardDelta)) * (this.options.speed / 100);
	},
	draw: function(ctx) {
		var frameoffset = this.options.frame * this.options.width;

		ctx.drawImage(
			this.options.spritemap,     // Image
			frameoffset,                // Source X Position (within image)
			0,                          // Source Y Position (within image)
			this.options.width,         // Source Width
			this.options.height,        // Source Height
			Math.round(this.options.x), // Canvas X
			Math.round(this.options.y), // Canvas Y
			this.options.width,         // Canvas Width
			this.options.height         // Canvas Height
		);
	}
});


/**
 * Tree Class
 */
var Tree = new Class({
	Implements: [ Options ],
	options: {
		x: 200,
		y: 100,
		color: '#009900',
		width: undefined,
		height: undefined,

		treeWidth: undefined,
		treeColor: '#411616'
	},
	initialize: function(options) {
		this.randomize();

		this.options.x      = env.options.width - this.options.width; // Some X

		this.setOptions(options);
	},
	move: function(delta, forwardDelta) {
		this.options.x -= delta * 100;

		if(this.options.x < this.options.width * -1) {
			this.options.x = env.options.width;
			this.randomize();
		}
	},
	draw: function(ctx) {
		// Drawn crown of tree
		ctx.fillStyle = this.options.color;
		ctx.fillRect(Math.floor(this.options.x), Math.floor(this.options.y), this.options.width, this.options.height);

		// calculate tree
		var treeX = Math.floor(this.options.width / 2 - this.options.treeWidth / 2 + this.options.x); // Adjust tree to center point below tree crown
		var treeY = Math.floor(this.options.y + this.options.height);                                 // Adjust top left of tree
		var treeH = Math.floor(env.options.height - treeY);                                           // Reach all the way down to the bottom of the screen

		// Draw tree
		ctx.fillStyle = this.options.treeColor;
		ctx.fillRect(treeX, treeY, this.options.treeWidth, treeH);
	},
	randomize: function() { // Randomize size of tree
		this.options.y      = Number.random(150, 250); // Random Y
		this.options.width  = Number.random(200, 250); // Random width of tree crown
		this.options.height = Number.random(80,  120); // Random height of tree crown

		this.options.treeWidth = this.options.width / Number.random(4, 5); // Base width of tree on size of crown, somewhat
	}
});

