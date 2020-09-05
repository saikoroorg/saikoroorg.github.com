// javascript
// CUBE Basic Engine API.

// Namespace.
var cube = cube || {};

/* VERSION/ *****************************/
cube.version = "0.8.27";
cube.timestamp = "200906";
/************************************* /VERSION*


/* CUBE API ************************************/

/* CUBE Screen API *****************************/

// Clear screen.
function cubeClear() {
	cube.screen.clear();
}

// Write text to the screen.
function cubeWrite(text) {
	cube.screen.print(text);
}

// Read text from the screen.
function cubeRead() {
	let text = "";
	return text;
}

/* CUBE Basics API ****************************/

// Wait some counts.
async function cubeWait(time) {
	await cube.count.wait(time);
}

// Get a time count.
function cubeTime() {
	return cube.count.time();
}

// Generate a random count.
function cubeRandom(maximum=0, seed=0) {
	if (seed) {
		cube.count.setSeed(seed);
	}
	return cube.count.random(maximum);
}

// Get a seed count for random.
function cubeSeed() {
	return cube.count.seed();
}

// Create a vector.
// The vector has x,y and z variables.
function cubeVector(x, y, z=0) {
	return new cube.Vec(x, y, z);
}

// Calculate the division.
function cubeDiv(x, y) {
	return Math.floor(x / y);
}

// Calculate the remainder of the division.
function cubeMod(x, y) {
	return Math.floor(x % y);
}

/* CUBE Sprite API *****************************/

// Get master screen.
// The screen has these variables.
//  .pos : position vector.
//  .width : width vector.
function cubeScreen() {
	return cube.screen;
}

// Resize screen width.
function cubeResizeScreen(width, height, screen=null) {
	if (!screen) {
		screen = cube.screen;
	}
	screen.resize(width, height);
	return screen;
}

// Get master sprite.
// The sprite has these variables.
//  .dir : directional vector.
//  .pos : position vector.
//  .width : width vector.
function cubeSprite() {
	return cube.sprite.clone();
}

// Load image for the sprite.
async function cubeLoadSprite(imageName, sprite=null) {
	if (!sprite) {
		sprite = cube.sprite.clone();
	}
	sprite.loadImage(imageName);
	await sprite.waitLoadingImage();
	return sprite;
}

// The sprite sets frame size.
function cubeFrame(x, y, width, height, sprite) {
	sprite.setFrame(x, y, width, height);
}

// The sprite set scale.
function cubeScale(scale, sprite) {
	sprite.setScale(scale);
}

// The sprite rotate to the angle.
function cubeRotate(angle, sprite) {
	sprite.setAngle(angle);
}

// The sprite set alpha.
function cubeAlpha(alpha, sprite) {
	sprite.setAlpha(alpha);
}

// The sprite looks at the directional vector.
function cubeLook(x, y, sprite) {
	sprite.look(new cube.Vec(x, y));
}

// The sprite moves to the position vector.
function cubeMove(x, y, sprite) {
	sprite.move(new cube.Vec(x, y));
}

// The sprite draws to the screen.
function cubeDraw(sprite, screen=null) {
	if (!screen) {
		screen = cube.screen;
	}
	sprite.enable(screen, true);
}

/* CUBE Joypad API *****************************/

// Get master joypad.
// The joypad has these variables.
//  .dir : directional vector.
//  .pos : position vector.
//  .act : true on action.
function cubeJoypad() {
	return cube.input.clone();
}

// Read and update joypad status.
function cubeReadJoypad(joypad=null) {
	if (!joypad) {
		cube.input.read(cube.screen);
		joypad = cube.input.clone();
	} else {
		joypad.read(cube.screen);
	}
	return joypad;
}

/* CUBE Param API *****************************/

// Create a param from query.
function cubeParam() {
	return cube.param.clone();
}

// Load param from local storage.
function cubeLoadParam(fileName, param=null) {
	if (!param) {
		param = cube.param.clone();
	}
	param.load(fileName);
	return param;
}

// Save param to local storage.
function cubeSaveParam(fileName, param=null) {
	if (!param) {
		param = cube.param;
	}
	param.save(fileName);
}

// Get all keys of param.
function cubeKeys(param=null) {
	if (!param) {
		param = cube.param;
	}
	return param.keys();
}

// Get value of param.
function cubeValue(key, param=null) {
	if (!param) {
		param = cube.param;
	}
	return param.value(key);
}

// Set value of param.
function cubeSetValue(key, value, param=null) {
	if (!param) {
		param = cube.param;
	}
	return param.setValue(key, value);
}

/**/
// javascript
// Basic components.

/*  */

// Vector.
//              y-
//   x-  z-(Near)/z+(Far)  x+
//              y+
cube.Vec = class {
    //x = 0;
    //y = 0;
    //z = 0;

    // Constructor.
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // clone.
    clone() {
        return new cube.Vec(this.x, this.y, this.z);
    }

    // Get vector by string.
    toString() {
        return "" + this.x.toString() +
            "," + this.y.toString() +
            "," + this.z.toString();
    }

    // Deserialize a text.
    deserialize(text) {
        text.replace(/(\d+),(\d+),(\d+)/, (match, p1, p2, p3) => {
            match;
            this.x = p1 ? Number(p1) : 0;
            this.y = p2 ? Number(p2) : 0;
            this.z = p3 ? Number(p3) : 0;
        });
    }

    // Serialize to a text.
    serialize() {
        return this.toString();
    }

    // Check all number is zero.
    isZero() {
        return this.x == 0 && this.y == 0 && this.z == 0;
    }

    // Get length square.
    lenSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    // operator+
    add(other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }

    // operator-
    sub(other) {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    }

    // operator*
    mul(value) {
        this.x = Math.round(this.x * value);
        this.y = Math.round(this.y * value);
        this.z = Math.round(this.z * value);
        return this;
    }

    // operator/
    div(value) {
        if (value != 0) {
            this.x = Math.round(this.x / value);
            this.y = Math.round(this.y / value);
            this.z = Math.round(this.z / value);
        } else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }
        return this;
    }

    // operator-
    neg() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }

    // operator==
    eq(other) {
        return this.x == other.x && this.y == other.y && this.z == other.z;
    }

    // operator!=
    ne(other) {
        return this.x != other.x || this.y != other.y || this.z != other.z;
    }
}


// Vector.
cube.Vec.zero = new cube.Vec(0,0,0);
cube.Vec.x = new cube.Vec(1,0,0);
cube.Vec.y = new cube.Vec(0,1,0);
cube.Vec.z = new cube.Vec(0,0,1);


// Direction set.
//                 3(Up)
//   1(Left)  0(Near)/5(Far)  4(Right)
//                2(Down)
cube.Dirs = class {

    // direction set by bit flags.
    //flags = 0;

    // Constructor.
    constructor(bit = -1) {
        if (bit >= 0 && bit < cube.Dirs.bitMax) {
            this.flags = 1 << bit;
        } else {
            this.flags = 0;
        }
    }

    // clone
    clone() {
        let clone = new cube.Dirs();
        clone.flags = this.flags;
        return clone;
    }

    // Deserialize a text.
    deserialize(text) {
        this.flags = isFinite(text) ? Number(text) : 0;
    }

    // Serialize to a text.
    serialize() {
        return "" + this.flags;
    }

    // Get directions by string.
    toString() {
        let str1 = "";
        for (let i = 0; i < cube.Dirs.bitMax; ++i) {
            str1 += this.test(new cube.Dirs(i)) ? i : "-";
        }
        return str1;
    }

    // Get directions by vector.
    toVec() {
        const table = [cube.Vec.z.clone().neg(),
                       cube.Vec.x.clone().neg(),
                       cube.Vec.y.clone().neg(),
                       cube.Vec.y, cube.Vec.x, cube.Vec.z];
        let vec = new cube.Vec(0, 0, 0);
        for (let i = 0; i < cube.Dirs.bitMax; ++i) {
            if (this.test(new cube.Dirs(i))) {
                vec.add(table[i]);
            }
        }
        return vec;
    }

    // clear bit flags.
    clear() {
        this.flags = 0;
    }

    // Check all bit is down.
    isEmpty() {
        return this.flags == 0;
    }

    // Count number of directions.
    count() {
        count = 0;
        for (let i = 0; i < Dirs.bitMax; ++i) {
            if (this.test(new cube.Dirs(i))) {
                count += 1;
            }
        }
        return count;
    }

    // add directions.
    add(dirs) {
        this.flags |= dirs.flags;
    }

    // Remove directions.
    sub(dirs) {
        this.flags &= ~dirs.flags;
    }

    // Check any flag is up.
    test(dirs) {
        return (this.flags & dirs.flags) > 0;
    }

    // Check near.
    near() {
        return (this.flags & (1 << 0)) > 0;
    }

    // Check far.
    far() {
        return (this.flags & (1 << 5)) > 0;
    }

    // Check right.
    right() {
        return (this.flags & (1 << 4)) > 0;
    }

    // Check left.
    left() {
        return (this.flags & (1 << 1)) > 0;
    }

    // Check Down.
    down() {
        return (this.flags & (1 << 2)) > 0;
    }

    // Check up.
    up() {
        return (this.flags & (1 << 3)) > 0;
    }
}


// Maximum of direction.
cube.Dirs.bitMax = 6;

// Directions.
cube.Dirs.empty = new cube.Dirs();
cube.Dirs.near = new cube.Dirs(0);
cube.Dirs.far = new cube.Dirs(5);
cube.Dirs.right = new cube.Dirs(4);
cube.Dirs.left = new cube.Dirs(1);
cube.Dirs.down = new cube.Dirs(2);
cube.Dirs.up = new cube.Dirs(3);


// 2D grid board.
//  0,0 ... W,0
//   :   x   :
//  0,H ... W,H
cube.Board = class {

    // // Values of each grid on the board.
    // int[,] values;
    //
    // // Objects over each grid on the board.
    // string[,] objects;

    // Constructor.
    constructor(values_) {

        // Use first length to reject jagged array.
        let width = values_ != null && values_.length > 0
                    ? values_[0].length : 0;
        let height = values_ != null ? values_.length : 0;
        //this.values = new string[height, Width];
        //this.objects = new string[height, Width];
        this.values = new Array(height);
        this.objects = new Array(height);
        for (let j = 0; j < height; ++j) {
            this.values[j] = new Array(width);
            this.objects[j] = new Array(width);
            for (let i = 0; i < width; ++i) {

                // Set 0 if no value on jagged array.
                this.values[j][i] = values_[j] ? values_[j][i] : 0;
                this.objects[j][i] = null;
            }
        }
    }

    // clone.
    clone() {
        let clone = new cube.Board();
        let width = this.width();
        let height = this.height();
        // clone.values = new int[height, width];
        // clone.objects = new string[height, width];
        clone.values = new Array(height);
        clone.objects = new Array(height);
        for (let j = 0; j < height; ++j) {
            clone.values[j] = new Array(width);
            clone.objects[j] = new Array(width);
            for (let i = 0; i < width; ++i) {
                clone.values[j][i] = this.values[j][i];
                clone.objects[j][i] = this.objects[j][i];
            }
        }
        return clone;
    }

    // Width of the board.
    width() {
        return this.values != null && this.values.length > 0
               ? this.values[0].length : 0;
    }

    // Height of the board.
    height() {
        return this.values != null ? this.values.length : 0;
    }

    // Check a point is inside the board.
    hasGrid(x, y) {
        return x >= 0 && x < this.width() && y >= 0 && y < this.height();
    }

    // Set a value of a grid.
    setValue(x, y, value) {
        if (this.hasGrid(x, y)) {
            this.values[y][x] = value;
        }
    }

    // Value of a grid.
    value(x, y) {
        return this.hasGrid(x, y) ? this.values[y][x] : cube.Board.invalidValue;
    }

    // Remove all objects.
    removeObjects() {
        let width = this.width();
        let height = this.height();
        for (let j = 0; j < height; ++j) {
            for (let i = 0; i < width; ++i) {
                this.objects[j][i] = null;
            }
        }
    }

    // add an object.
    addObject(obj, x, y) {
        if (this.hasGrid(x, y)) {
            this.objects[y][x] = obj;
        }
    }

    // Get the board and objects by string.
    toString() {
        let width = this.width();
        let height = this.height();

        // Print each grids.
        let str1 = "";
        for (let j = 0; j < height; ++j) {
            for (let i = 0; i < width; ++i) {
                if (this.objects[j][i] != null) {
                    str1 += " " + this.objects[j][i];
                } else {
                    str1 += " " + this.value(i, j);
                }
            }
            str1 += "\n";
        }

        return str1;
    }
}


// Invalid value.
cube.Board.invalidValue = -1;


// Piece.
cube.Piece = class {
    // Vec pos;
    // Dirs dirs;
    // Movement movement;

    // Constructor.
    constructor(pos, movement=null) {
        this.pos = pos;
        this.dirs = new cube.Dirs();
        this.movement = movement;
    }

    // clone
    clone() {
        let clone = new cube.Piece();
        clone.pos = this.pos.clone();
        clone.dirs = this.dirs.clone();
        clone.movement = this.movement;
        return clone;
    }
}

/*  */
// javascript
// Count component.

/*  */

// Count management class.
cube.Count = class {

    // Constructor.
    constructor(seed=0) {
        this._time = Date.now();
        this._seed = seed != 0 ? seed : this._time;
    }

    // Wait time.
    async wait(time) {
        if (time > 0) {

            // let start = Date.now();
            // while (Date.now() - start < time) {}
            await new Promise(r => setTimeout(r, time));
        }
    }

    // Get time count.
    time(diff=false) {
        let timeDiff = Date.now() - this._time;
        this._time = Date.now();

        return diff ? timeDiff : this._time;
    }

    // Get random count.
    random(max) {

        // Xorshift algorythm.
        this._seed = this._seed ^ (this._seed << 13);
        this._seed = this._seed ^ (this._seed >>> 17);
        this._seed = this._seed ^ (this._seed << 15);
        return Math.abs(this._seed % max);

        // LCG algorythm.
        // this._seed = (this._seed * 9301 + 49297) % 233280;
        // let rand = this._seed / 233280;
        // return Math.round(rand * max);
    }

    // Get random seed.
    seed() {
        return this._seed;
    }

    // Set random seed.
    setSeed(seed) {
        this._seed = seed != 0 ? seed : Date.now();
    }
}

// Counter singleton.
cube.count = new cube.Count();

/*  */
// javascript
// Parameters component.

/*  */

// Parameters management base class.
cube.Params = class {

    // Constructor.
    constructor(name=null, text=null) {
        this.name = name;
        this.deserialize(text);
    }

    // Get keys.
    keys() {
        return Object.keys(this.keyvalues);
    }

    // Get value.
    value(key) {
        return this.keyvalues[key];
    }

    // Set  or delete value.
    setValue(key, value) {
        if (value != null) {
            this.keyvalues[key] = value;
        } else {
            delete this.keyvalues[key];
        }
    }

    // Get all keys and values.
    keyValues() {
        return this.keyvalues;
    }

    // Set all keys and values.
    setKeyValues(keyvalues) {
        if (keyvalues != null) {
            this.keyvalues = keyvalues;
        } else {
            this.keyvalues = {};
        }
    }

    // Deserialize a text to parameters.
    deserialize(text) {
        this.keyvalues = {};
        if (text != null) {
            if (text.includes('&')) {
                text.split('&').forEach((q) => {
                    let keyvalue = q.split('=');
                    if (keyvalue[0] != null && keyvalue[1] != null) {
                        this.keyvalues[keyvalue[0]] = keyvalue[1];
                        // console.log("parameter:" + kv[0] + " = " + kv[1]);
                    }
                });
            } else {
                let keyvalue = text.split('=');
                if (keyvalue[0] != null && keyvalue[1] != null) {
                    this.keyvalues[keyvalue[0]] = keyvalue[1];
                    // console.log("parameter:" + kv[0] + " = " + kv[1]);
                }
            }
        }
    }

    // Serialize parameters to a text.
    serialize() {
        let keyvalues = [];
        for (let key in this.keyvalues) {
            if (key != null && this.keyvalues[key] != null) {
                keyvalues.push(key + "=" + this.keyvalues[key]);
            }
        }
        return keyvalues.join("&");
    }

    // Wait updating value.
    async waitUpdatingValue() {
        while (!this.updated) {
            await new Promise(r => setTimeout(r, 10));
        }
    }
};

// Initial parameters management class.
cube.InitialParams = class extends cube.Params {

    // Constructor.
    constructor(name=null, text=null) {

        // Load parameters text from local storage.
        if (text == null) {
            let query = window.location.search;
            if (query != null && query != "") {
                console.log("Load query:" + query);
                text = query.slice(1);
            }
        }

        super(name, text);
    }

    // Update parameters text.
    update() {
        let text = super.serialize();
        if (text != null) {
            let query = "?" + text;
            console.log("Flush query:" + query);
            window.history.replaceState(null, "", query);
            // window.location.search = query;
        }
    }
};

// Storage parameters management class.
cube.StorageParams = class extends cube.Params {

    // Constructor.
    constructor(name=null, text=null) {

        // Load parameters text from local storage.
        if (text == null) {
            text = localStorage.getItem(name);
            console.log("Load storage:" + text);
        }

        super(name, text);
    }

    // Save parameters text to local storage.
    save() {
        let text = super.serialize();
        if (text != null) {
            console.log("Save storage:" + text);
            localStorage.setItem(this.name, text);
        }
    }
};

// Message parameters management class.
cube.MessageParams = class extends cube.Params {

    // Constructor.
    constructor(name=null, text=null) {
        super(name, text);
    }

    // Send parameters text to parent window.
    send(to=null) {
        let text = super.serialize();
        if (text != null) {
            if (to != null) {
                console.log("Send message:" + text + " to " + to);
                to.postMessage(text, this.name ? this.name : "*");
            } else if (window.parent != null) {
                 console.log("Send message:" + text + " to " + this.name);
                 window.parent.postMessage(text, this.name ? this.name : "*");
            }
        }
    }
};

// Parameters singleton.
cube.param = new cube.Params();

/*  */
// javascript
// Screen components.

/*  */

// Screen management class.
cube.Screen = class {

    // Constructor.
    constructor(type=null, width=0, height=0) {
        this.type = type ? type.replace(/[¥.¥/]/g, "") : null;
        this.root = null;
        this.screen = null;
        this.pos = new cube.Vec();
        this.width = new cube.Vec();
        this.scale = 1;
        this.resized = false;

        // Search screen.
        if (type != null) {
            let screens = document.getElementsByClassName(type);
            if (screens.length > 0) {
                for (let i = 0; i < screens.length; ++i) {
                    if (!cube.Screen.manager().screens.includes(screens[i])) {
                        this.root = screens[i].parentNode;
                        this.screen = screens[i];
                        cube.Screen.manager().screens.push(this.screen);
                        break;
                    }
                }
            }
        }

        // Setup new screen.
        if (this.root == null){
            this.root = document.createElement("div");
            this.screen = document.createElement("pre");
            this.root.appendChild(this.screen);
            if (this.type != null) {
                this.screen.setAttribute("class", this.type);
                this.root.style.position = "absolute";
                this.root.style.width = "100%";
                this.root.style.height = "100%";
                this.root.style.display = "flex";
                this.root.style.alignItems = "center";
                this.root.style.justifyContent = "center";
                this.root.style.display = "flex";
                this.screen.style.position = "absolute";
                this.screen.style.margin = "0";
                this.screen.style.userSelect = "none";
                document.body.appendChild(this.root);
                cube.Screen.manager().screens.push(this.screen);
            }
            this.screen.style.width = this.width.x = this.root.clientWidth;
            this.screen.style.height = this.width.y = this.root.clientHeight;
            window.addEventListener("resize", (evt) => this.onResize(evt));
        }
    }

    // Resize screen.
    resize(w, h) {
        this.width = new cube.Vec(w, h);
        this.screen.style.width = this.width.x;
        this.screen.style.height = this.width.y;

        let sx = this.root.clientWidth / this.width.x;
        let sy = this.root.clientHeight / this.width.y;
        this.scale = Math.min(sx, sy);
        let t = "scale(" + this.scale + ")";
        this.screen.style.transform = t;

        let rect = this.screen.getBoundingClientRect();
        this.pos.x = rect.left;
        this.pos.y = rect.top;

        if (!this.resized) {
            this.resized = true;
        }
    }

    // Resize event handler.
    onResize(evt) {
        evt = evt != null ? evt : window.event;
        evt.preventDefault();
        if (this.resized) {
            this.resize(this.width.x, this.width.y);
        } else {
            this.screen.style.width = this.width.x = this.root.clientWidth;
            this.screen.style.height = this.width.y = this.root.clientHeight;
        }
        console.log("resize:" + evt.type + " scale=" + this.scale + " pos=" + this.pos);
    }

    // Clone.
    clone() {
        let clone = new cube.Screen(this.type);
        clone.pos = this.pos.clone();
        clone.resize(this.width.x, this.width.y);
        return clone;
    }

    // Enable to show or disable to hide.
    enable(screen, enable) {
        if (this.root != null) {
            let parent =  screen.screen || document.body;
            if (enable) {
                if (!parent.contains(this.root)) {
                    parent.appendChild(this.root);
                }
            } else {
                if (parent.contains(this.root)) {
                    parent.removeChild(this.root);
                }
            }
        }
    }

    // // Set screen scale.
    // setScale(scale) {
    //     this.scale = scale;
    //     let t = "scale(" + this.scale + ")";
    //     this.screen.style.transform = t;
    // }

    // Print text to screen.
    print(text) {
        this.screen.appendChild(document.createTextNode(text + "\n"));
    }

    // Clear text on screen.
    clear() {
        this.screen.textContent = null;
    }

    // Get manager for screens.
    static manager() {
        if (this._manager == null) {
            this._manager = {};
            this._manager.screens = [];
            this._manager.images = {};
        }
        return this._manager;
    }
}


// Sprite management class.
cube.Sprite = class {

    // Constructor.
    constructor(type=null) {
        this.type = type ? type.replace(/[¥.¥/]/g, "") : null;
        this.root = null;
        this.sprite = null;

        this.imageType = null;
        this.animeType = null;

        this.pos = null;
        this.width = new cube.Vec();
        this.dir = null;
        this.angle = 0;
        this.scale = 1;
        this.alpha = 1;

        // Setup new sprite.
        this.root = document.createElement("div");
        this.sprite = document.createElement("div");
        this.root.appendChild(this.sprite);

        // Set class type.
        if (this.type != null) {
            this.sprite.setAttribute("class", this.type);
        }
    }

    // Clone.
    clone() {
        let clone = new cube.Sprite(this.type);
        clone.setImage(this.imageType);
        clone.setFrame(-this.sprite.style.backgroundPositionX,
                       -this.sprite.style.backgroundPositionY,
                       this.sprite.style.width,
                       this.sprite.style.height);
        clone.setAnime(this.animeType);
        clone.setPos(this.pos);
        clone.setDir(this.dir);
        clone.setAngle(this.angle);
        clone.setScale(this.scale);
        clone.setAlpha(this.alpha);
        return clone;
    }

    // Load image for sprite.
    loadImage(data) {
        if (this.root != null) {
            let loader = new Image();
            loader.onload = () => {

                // Create new style.
                let style = document.createElement('style');
                document.head.appendChild(style);

                let count = cube.Screen.manager().images[this.type] ?
                    cube.Screen.manager().images[this.type] + 1 : 1;
                cube.Screen.manager().images[this.type] = count;
                let imageType = this.type + "_" + count;

                // Create new style rule with image.
                let rule = "." + imageType + "{" +
                    "background-image:url(\"" + data + "\");" +
                    "width:" + loader.naturalWidth + ";" +
                    "height:" + loader.naturalHeight + ";" +
                    "}";
                style.sheet.insertRule(rule);
                this.width.x = loader.naturalWidth;
                this.width.y = loader.naturalHeight;

                // Set image type for sprite.
                this.setImage(imageType);
            }
            loader.src = data;
        }
    }

    // Wait loading image.
    async waitLoadingImage() {
        while (this.imageType == null) {
            await new Promise(r => setTimeout(r, 10));
        }
    }

    // Set style of image type.
    setImage(type) {
        if (!this.sprite.classList.contains(type)) {
            this.sprite.classList.remove(this.imageType);
            this.sprite.classList.add(type);
            this.imageType = type;
        }
    }

    // Set frame of image.
    setFrame(x, y, w, h) {
        if (this.imageType != null) {
            this.width.x = this.sprite.style.width = w;
            this.width.y = this.sprite.style.height = h;
            this.sprite.style.backgroundPosition = "" + (-x) + " " + (-y);
            let nx = (this.sprite.style.naturalWidth / w);
            let ny = (this.sprite.style.naturalHeight / h);
            this.sprite.style.backgroundSize = "" + nx + " " + ny;
            let mx = w * (this.scale - 1) / 2;
            let my = h * (this.scale - 1) / 2;
            this.root.style.marginLeft = mx;
            this.root.style.marginRight = mx;
            this.root.style.marginTop = my;
            this.root.style.marginBottom = my;
        }
    }

    // Set style of animation type.
    setAnime(type) {
        if (!this.sprite.classList.contains(type)) {
            this.sprite.classList.remove(this.animeType);
            this.sprite.classList.add(type);
            this.animeType = type;
        }
    }

    // Enable to show or disable to hide.
    enable(screen, enable) {
        if (screen.screen != null) {
            if (enable) {
                if (!screen.screen.contains(this.root)) {
                    screen.screen.appendChild(this.root);
                }
            } else {
                if (screen.screen.contains(this.root)) {
                    screen.screen.removeChild(this.root);
                }
            }
        }
    }

    // Print text to sprite.
    print(text) {
        this.root.appendChild(document.createTextNode(text + "\n"));
    }

    // Clear text on sprite.
    clear() {
        this.root.textContent = null;
    }

    // Check pos is in sprite rect.
    isInRect(pos) {
        if (pos != null) {
            let rect = this.root.getBoundingClientRect();
            return pos.x > rect.left && pos.x < rect.right &&
                   pos.y > rect.top && pos.y < rect.bottom;
        }
        return false;
    }

    // Move to the position.
    move(pos) {
        this.setPos(pos);
        this.enable(cube.screen, true);
    }

    // Look to the direction.
    look(dir) {
        this.setDir(dir);
        this.enable(cube.screen, true);
    }

    // Set sprite position vector.
    setPos(pos) {
        if (this.imageType != null) {
            this.pos = pos;
            if (pos != null) {
                this.root.style.position = "absolute";
                let w = this.width.x * this.scale / 2;
                let h = this.width.y * this.scale / 2;
                this.root.style.top = this.pos.y - w;
                this.root.style.left = this.pos.x - h;
            } else {
                this.root.style.position = "relative";
            }
        }
    }

    // Set sprite direction vector.
    setDir(dir) {
        this.dir = dir;
        if (dir != null) {
            const angle_radian = 180 / Math.PI;
            this.angle = Math.atan2(this.dir.y, this.dir.x) * angle_radian;
            this.root.style.transform =
                "scale(" + this.scale + ")" +
                "rotate(" + this.angle + "deg)";
        }
    }

    // Set sprite angle.
    setAngle(angle) {
         this.dir = null; // Can not set direction vector.
        this.angle = angle;
        this.root.style.transform =
            "scale(" + this.scale + ")" +
            "rotate(" + this.angle + "deg)";
    }

    // Set sprite scale.
    setScale(scale) {
        if (this.imageType != null) {
            this.scale = scale;
            this.root.style.transform =
                "scale(" + this.scale + ")" +
                "rotate(" + this.angle + "deg)";
            let mx = parseInt(this.sprite.style.width) * (scale - 1) / 2;
            let my = parseInt(this.sprite.style.height) * (scale - 1) / 2;
            this.root.style.marginLeft = mx;
            this.root.style.marginRight = mx;
            this.root.style.marginTop = my;
            this.root.style.marginBottom = my;
        }
    }

    // Set sprite aplha.
    setAlpha(alpha) {
        this.alpha = alpha;
        this.root.style.opacity = this.alpha;
    }
}

// Screen singleton.
cube.screen = new cube.Screen("cubeScreen");

// Sprite singleton.
cube.sprite = new cube.Sprite("cubeSprite");

/*  */
// javascript
// Input component.

/*  */

// Input management class.
cube.Input = class {

    // Constructor.
    constructor(screen=null) {
        this.dir = null;
        this.pos = null;
        this.act = false;

        this._dirs = [null, null];
        this.keyCode = null;
        this.points = null;
        this.keyTime = 0;
        this.tapTime = 0;
        this.flickTime = 0;
        this.downEvent = false;
        this.upEvent = false;
        this.touches = null;

        // Add event listener to anonymous function
        // to use "this" keyword in the function.
        if (screen != null && screen.root != null) {
            this.screen = screen;
            let parent = screen.root;
            document.addEventListener("keyup", (evt) => this.onKeyUp(evt));
            document.addEventListener("keydown", (evt) => this.onKeyDown(evt));
            parent.addEventListener("mousedown", (evt) => this.onMouseDown(evt));
            parent.addEventListener("mousemove", (evt) => this.onMouseMove(evt));
            document.addEventListener("mouseup", (evt) => this.onMouseUp(evt));
            parent.addEventListener("touchstart", (evt) => this.onTouch(evt), {passive: false});
            parent.addEventListener("touchmove", (evt) => this.onTouch(evt), {passive: false});
            parent.addEventListener("touchend", (evt) => this.onTouch(evt));
            parent.addEventListener("touchcancel", (evt) => this.onTouch(evt));
            document.addEventListener("scroll", (evt) => this.onScroll(evt));
        }
    }

    // Clone.
    clone() {
        let clone = new cube.Input();
        if (this._dirs[0] != null) {
            clone._dirs[0] = this._dirs[0].clone();
        }
        if (this._dirs[1] != null) {
            clone._dirs[1] = this._dirs[1].clone();
        }
        clone.keyCode = this.keyCode;
        if (this.points != null) {
            clone.points = [];
            if (this.points[0] != null) {
                clone.points[0] = this.points[0].clone();
            }
            if (this.points[1] != null) {
                clone.points[1] = this.points[1].clone();
            }
        }
        clone.keyTime = this.keyTime;
        clone.tapTime = this.tapTime;
        clone.flickTime = this.flickTime;
        clone.downEvent = this.downEvent;
        clone.upEvent = this.upEvent;
        // if (this.touches != null) {
        //     clone.touches = [];
        //     for (let i = 0; i < this.touches.length; ++i) {
        //         clone.touches[i].pageX = this.touches[i].pageX;
        //         clone.touches[i].pageY = this.touches[i].pageY;
        //         clone.touches[i].force = this.touches[i].force;
        //     }
        // }
        clone.dir = this.dir ? this.dir.clone() : null;
        clone.pos = this.pos ? this.pos.clone() : null;
        clone.act = this.act;
        return clone;
    }

    // Generate directions from key code.
    keyCodeToDirs(keyCode) {
        const keyCodeRight = 39;
        const keyCodeUp = 38;
        const keyCodeLeft = 37;
        const keyCodeDown = 40;

        // Check if pressed key is direction key.
        if (keyCode == keyCodeRight) {
            return cube.Dirs.right.clone();
        } else if (keyCode == keyCodeUp) {
            return cube.Dirs.up.clone();
        } else if (keyCode == keyCodeLeft) {
            return cube.Dirs.left.clone();
        } else if (keyCode == keyCodeDown) {
            return cube.Dirs.down.clone();

        // Pressed key is not direction key.
        } else {
            return new cube.Dirs();
        }
    }

    // Generate directions from mouse/touch point vec.
    pointVecToDirs(vec) {
        const pi14 = Math.PI / 4;
        const pi34 = Math.PI * 3 / 4;

        // Check directions.
        let theta = Math.atan2(vec.y, vec.x);
        if (-pi14 < theta && theta <= pi14) {
            return cube.Dirs.right.clone();
        } else if (-pi34 < theta && theta <= -pi14) {
            return cube.Dirs.up.clone();
        } else if (pi34 < theta || theta <= -pi34) {
            return cube.Dirs.left.clone();
        } else if (pi14 < theta && theta <= pi34) {
            return cube.Dirs.down.clone();
        }
        return new cube.dirs();
    }

    // Serialize to parameters.
    serializeParams() {
        let params = new cube.Params();
        if (this._dirs[0] != null) {
            params.setValue("dirs0", this._dirs[0].serialize());
        }
        if (this._dirs[1] != null) {
            params.setValue("dirs1", this._dirs[1].serialize());
        }
        if (this.points != null) {
            if (this.points[0] != null) {
                params.setValue("points0", this.points[0].serialize());
            }
            if (this.points[1] != null) {
                params.setValue("points1", this.points[1].serialize());
            }
        }
        return params;
    }

    // Update direction by screen event.
    read() {
        this.updateDirsByScreen(1000, 10*10, 0.5);
    }

    // Update dirs by screen event.
    updateDirs() {
        this.updateDirsByScreen(1000, 10*10, 0.5);
    }

    // Update dirs by serialized parameters.
    updateDirsByParams(params) {
        if (params.value("dirs0") != null) {
            this._dirs[0] = new cube.Dirs();
            this._dirs[0].deserialize(params.value("dirs0"));
        }
        if (params.value("dirs1") != null) {
            this._dirs[1] = new cube.Dirs();
            this._dirs[1].deserialize(params.value("dirs1"));
        }
        if (params.value("points0") != null ||
            params.value("points1") != null) {
            this.points = [];
            if (params.value("points0") != null) {
                this.points[0] = new cube.Vec();
                this.points[0].deserialize(params.value("points0"));
            }
            if (params.value("points1") != null) {
                this.points[1] = new cube.Vec();
                this.points[1].deserialize(params.value("points1"));
            }
        } else {
            this.points = null;
        }

        this.dir = this._dirs[0] ? this._dirs[0].toVec() : null;
        this.pos = this.points ? this.points[1].clone() : null;
        THIS.act = this._dirs[1] ? true : false;
    }

    // Update dirs by screen event.
    // - timeout: Timeout time for tap/flick check.
    // - radius2: Play radius for tap/flick check.
    // - depth: Far depth for press check.
    updateDirsByScreen(timeout, radius2, depth) {
        let time = Date.now();

        // No input.
        if (this.keyCode <= 0 && this.points == null) {
            this._dirs[0] = null;
            this.keyTime = time;
            this.tapTime = time;
            this.flickTime = time;

        // Key input.
        } else if (this.keyCode > 0) {
            this._dirs[0] = this.keyCodeToDirs(this.keyCode);
            // console.log("Key input:" + this.tapTime + " " + time);

            // Timeout check.
            if (this.keyTime <= time - timeout) {
                this._dirs[0].add(cube.Dirs.far);
            }

        // Mouse/Touch input.
        } else if (this.points != null) {

            // Play radius check.
            let vec = this.points[1].clone().sub(this.points[0]);
            if (radius2 <= 0 || vec.lenSq() >= radius2) {

                // Flick/Swiping.
                this._dirs[0] = this.pointVecToDirs(vec);

                // Ignore tap after point out of play radius.
                this.tapTime = time - timeout;

                // Timeout or Far depth check.
                if (this.flickTime <= time - timeout
                 || this.points[1].z - this.points[0].z >= depth) {
                    this._dirs[0].add(cube.Dirs.far);

                    // Ignore flick after point reach to far depth.
                    this.flickTime = time - timeout;
                }
            } else {

                // Tap/Touching.
                this._dirs[0] = new cube.Dirs();

                // Timeout or Far depth check.
                if (this.tapTime <= time - timeout
                 || this.points[1].z - this.points[0].z >= depth) {
                    this._dirs[0].add(cube.Dirs.far);

                    // Ignore tap/flick after point reach to far depth.
                    this.tapTime = time - timeout;
                    this.flickTime = time - timeout;
                }
            }
            // console.log("Mouse/Touch input:" + this.tapTime + " " + time);
        }

        // On down event, only update status.
        if (this.downEvent) {
            console.log("Down Event:" + this._dirs[0].toString());
            this._dirs[1] = null;
            this.downEvent = false;

        // On up event, update status and return dirs.
        } else if (this.upEvent) {
            console.log("Up Event:" + this._dirs[0].toString());
            this._dirs[1] = this._dirs[0];
            this.upEvent = false;

        // On after up event.
        } else if (this._dirs[1] != null) {
            console.log("Up Event End.");
            this._dirs[0] = null;
            this._dirs[1] = null;
            this.keyCode = null;
            this.points = null;
        }

        this.dir = this._dirs[0] ? this._dirs[0].toVec() : null;
        this.pos = this.points ? this.points[1].clone() : null;
        this.act = this._dirs[1] ? true : false;
    }

    // Get input directions.
    dirs(raw=false) {
        if (this._dirs[raw ? 0 : 1] != null) {
            return this._dirs[raw ? 0 : 1].clone();
        }
        return null;
    }

    // Get mouse/touch point position.
    point(raw=false) {
        if (this.points != null) {
            return this.points[raw ? 0 : 1].clone();
        }
        return null;
    }

    // Set input direction directly.
    setDirs(dirs) {
        this._dirs[0] = dirs;
        this._dirs[1] = dirs;
    }

    // Key down event handler.
    onKeyDown(evt) {
        evt = evt != null ? evt : window.event;
        evt.preventDefault();
        this.keyCode = evt.keyCode;
        this.downEvent = true;
        // console.log("event:" + evt.type + " keycode:" + evt.keyCode)
    }

    // Key up event handler.
    onKeyUp(evt) {
        evt = evt != null ? evt : window.event;
        evt.preventDefault();
        this.keyCode = evt.keyCode;
        this.upEvent = true;
        // console.log("event:" + evt.type + " keycode:" + evt.keyCode)
    }

    // Update point on down event.
    updatePointOnDown(pos) {
        pos.sub(this.screen.pos).div(this.screen.scale);
        this.points = [pos.clone(), pos.clone()];
        this.downEvent = true;
        // console.log("Down:" + pos.toString());
    }

    // Update point on move event.
    updatePointOnMove(pos) {
        pos.sub(this.screen.pos).div(this.screen.scale);
        if (this.points != null) {
            this.points[1] = pos.clone();
        }
        // console.log("Move:" + pos.toString());
    }

    // Update point on up event.
    updatePointOnUp(pos) {
        pos.sub(this.screen.pos).div(this.screen.scale);
        if (this.points != null) {
            this.points[1] = pos.clone();
            this.upEvent = true;
        }
        console.log("Up:" + pos.toString());
    }

    // Mouse down event handler.
    onMouseDown(evt) {
        evt = evt != null ? evt : window.event;
        evt.preventDefault();
        let mouse = new cube.Vec(evt.pageX, evt.pageY);
        this.updatePointOnDown(mouse);
        // console.log("event:" + evt.type + " " + mouse.toString());
    }

    // Mouse move event handler.
    onMouseMove(evt) {
        evt = evt != null ? evt : window.event;
        evt.preventDefault();
        let mouse = new cube.Vec(evt.pageX, evt.pageY);
        this.updatePointOnMove(mouse);
        // console.log("event:" + evt.type + " " + mouse.toString());
    }

    // Mouse up event handler.
    onMouseUp(evt) {
        evt = evt != null ? evt : window.event;
        evt.preventDefault();
        let mouse = new cube.Vec(evt.pageX, evt.pageY);
        this.updatePointOnUp(mouse);
        // console.log("event:" + evt.type + " " + mouse.toString());
    }

    // Touch down/move/up/cancel event handler.
    onTouch(evt) {
        evt = evt != null ? evt : window.event;
        evt.preventDefault();

        // Touch down first finger.
        if (this.touches == null && evt.touches.length > 0) {
            this.touches = [];
            let touch = new cube.Vec();
            for (let i = 0; i < evt.touches.length; ++i) {
                this.touches.push(evt.touches[i]);
                touch.Add(new cube.Vec(evt.touches[i].pageX,
                                       evt.touches[i].pageY,
                                       evt.touches[i].force));
            }
            touch.div(evt.touches.length);
            this.updatePointOnDown(touch);

            // console.log("1:" + evt.touches.length + " " + touch.toString());

        // Touch down/up additinal finger or touch move.
        } else {
            let touchesNext = [];
            let moveVec = new cube.Vec();
            let moveCount = 0;
            for (let i = 0; i < evt.touches.length; ++i) {
                touchesNext.push(evt.touches[i]);
                for (let j = 0; j < this.touches.length; ++j) {
                    if (evt.touches[i].identifier == this.touches[j].identifier) {
                        moveVec.x += evt.touches[i].pageX - this.touches[j].pageX;
                        moveVec.y += evt.touches[i].pageY - this.touches[j].pageY;
                        moveVec.z += evt.touches[i].force - this.touches[j].force;
                        moveCount += 1;
                    }
                }
            }

            // Touch move.
            if (this.points != null) {
                if (moveCount > 0) {
                    let touch = this.points[1].add(moveVec.clone().div(moveCount));
                    this.updatePointOnMove(touch);
                    this.touches = touchesNext;

                    // console.log("2:" + evt.touches.length + " " + touch.toString() +
                    //     " " + moveVec.toString() + " " + moveCount);

                // Touch up last finger.
                } else {
                    let touch = this.points[1];
                    this.updatePointOnUp(touch);
                    this.touches = null;

                    // console.log("3:" + evt.touches.length + " " + touch.toString());
                }
            }
        }
    }

    // Scroll event handler.
    onScroll(evt) {
        evt = evt != null ? evt : window.event;
        evt.preventDefault();
        console.log("event:" + evt.type)
    }
}

// Input singleton.
cube.input = new cube.Input(cube.screen);

/*  */
