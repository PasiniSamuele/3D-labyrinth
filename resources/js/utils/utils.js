/********************************
 * 
 * Utils.js
 * 
 * Support to: mat3, texture,
 * file loading, shaders,
 * objects, 
 * 
 *******************************/

/**
 * "Static class" utils
 */
var utils = {

	/********************************
	 * GL functions
	 *******************************/

	/**
	 * The lerp() function is used to find a number between two numbers
	 * @param {*} from 
	 * @param {*} to 
	 * @param {*} percentage 
	 * @returns 
	 */
	lerp: function (from, to, percentage) {
		return from * (1 - percentage) + to * percentage;
	},

	/**
	 * Gets the percentage given start time and finish time
	 * @param {*} duration 
	 * @param {*} startTime 
	 * @param {*} timeNow 
	 * @returns 
	 */
	getAnimationPercentage: function (duration, startTime, timeNow) {
		let delta = timeNow - startTime;
		return delta / duration;
	},

	/**
	 * Returns the correct cube face
	 * @param {*} targetString 
	 * @returns 
	 */
	computeTargetFace: function (targetString) {
		switch (targetString) {
			case "gl.TEXTURE_CUBE_MAP_POSITIVE_X":
				return gl.TEXTURE_CUBE_MAP_POSITIVE_X;
			case "gl.TEXTURE_CUBE_MAP_NEGATIVE_X":
				return gl.TEXTURE_CUBE_MAP_NEGATIVE_X;
			case "gl.TEXTURE_CUBE_MAP_POSITIVE_Y":
				return gl.TEXTURE_CUBE_MAP_POSITIVE_Y;
			case "gl.TEXTURE_CUBE_MAP_NEGATIVE_Y":
				return gl.TEXTURE_CUBE_MAP_NEGATIVE_Y
			case "gl.TEXTURE_CUBE_MAP_POSITIVE_Z":
				return gl.TEXTURE_CUBE_MAP_POSITIVE_Z;
			case "gl.TEXTURE_CUBE_MAP_NEGATIVE_Z":
				return gl.TEXTURE_CUBE_MAP_NEGATIVE_Z;
		}
	},

	/**
	 * Create and compile a shader program
	 * @param {*} gl 
	 * @param {*} shaderText 
	 * @returns 
	 */
	createAndCompileShaders: function (gl, shaderText) {
		var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
		var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);
		var program = utils.createProgram(gl, vertexShader, fragmentShader);
		return program;
	},

	/**
	 * Create a shader
	 * @param {*} gl 
	 * @param {*} type 
	 * @param {*} source 
	 * @returns 
	 */
	createShader: function (gl, type, source) {
		var shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
		if (success) {
			return shader;
		} else {
			console.log(gl.getShaderInfoLog(shader));  // eslint-disable-line
			if (type == gl.VERTEX_SHADER) {
				alert("ERROR IN VERTEX SHADER : " + gl.getShaderInfoLog(vertexShader));
			}
			if (type == gl.FRAGMENT_SHADER) {
				alert("ERROR IN FRAGMENT SHADER : " + gl.getShaderInfoLog(vertexShader));
			}
			gl.deleteShader(shader);
			throw "could not compile shader:" + gl.getShaderInfoLog(shader);
		}
	},

	/**
	 * Create a shader program
	 * @param {*} gl 
	 * @param {*} vertexShader 
	 * @param {*} fragmentShader 
	 * @returns 
	 */
	createProgram: function (gl, vertexShader, fragmentShader) {
		var program = gl.createProgram();
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);
		var success = gl.getProgramParameter(program, gl.LINK_STATUS);
		if (success) {
			return program;
		} else {
			throw ("program filed to link:" + gl.getProgramInfoLog(program));
			console.log(gl.getProgramInfoLog(program));  // eslint-disable-line
			gl.deleteProgram(program);
			return undefined;
		}
	},

	/**
	 * Resize the canvas to fit the screen size
	 * @param {*} canvas 
	 */
	resizeCanvasToDisplaySize: function (canvas) {
		const expandFullScreen = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;

		};
		expandFullScreen();
		// Resize screen when the browser has triggered the resize event
		window.addEventListener('resize', expandFullScreen);
	},

	/**
	 * Sum the texture number to the gl offset
	 * @param {*} gl 
	 * @param {*} slot 
	 * @returns 
	 */
	getTextureSlotOffset: function (gl, slot) {
		return (slot - gl.TEXTURE0);
	},

	/********************************
	 * File loading functions
	 *******************************/

	/**
	 * Load text file and put it in a variable (Promise)
	 * @param {*} url 
	 * @returns 
	 */
	loadTextResource: function (url) {
		return new Promise((resolve, reject) => {
			var request = new XMLHttpRequest();
			request.open('GET', url + "?a=" + Math.random(), true);
			request.onload = function () {
				if (request.status < 200 || request.status > 299) {
					reject("Error: HTTP Status " + request.status + " on resource: " + url);
				} else {
					resolve(request.responseText);
				}
			};
			request.send();
		});
	},

	/**
	 * Load an image (Promise)
	 * @param {*} url 
	 * @returns 
	 */
	loadImage: function (url) {
		return new Promise((resolve, reject) => {
			var image = new Image();
			image.onload = function () {
				resolve(image);
			}
			image.src = url;
		})
	},

	/**
	 * Load text file, parse it and put it in a variable (Promise)
	 * @param {*} url 
	 * @returns 
	 */
	loadJSONResource: function (url) {
		return new Promise((resolve, reject) => {
			utils.loadTextResource(url)
				.then(
					(result) => {
						try {
							resolve(JSON.parse(result));
						} catch (e) {
							reject(e);
						}
					}
					, (error) => {
						reject(error);
					}
				)
		})
	},

	/**
	 * Load a file from url
	 * @param {*} url 
	 * @param {*} data 
	 * @param {*} callback 
	 * @param {*} errorCallBack 
	 * @returns 
	 */
	loadFile: async function (url, data, callback, errorCallBack) {
		var response = await fetch(url);
		if (!response.ok) {
			alert('Network response was not ok');
			return;
		}
		var text = await response.text();
		callback(text, data);
	},

	/**
	 * Load files from urls
	 * @param {*} urls 
	 * @param {*} callback 
	 * @param {*} errorCallback 
	 */
	loadFiles: async function (urls, callback, errorCallback) {
		var numUrls = urls.length;
		var numComplete = 0;
		var result = [];
		// Callback for a single file
		function partialCallback(text, urlIndex) {
			result[urlIndex] = text;
			numComplete++;
			// When all files have downloaded
			if (numComplete == numUrls) {
				callback(result);
			}
		}
		for (var i = 0; i < numUrls; i++) {
			await this.loadFile(urls[i], i, partialCallback, errorCallback);
		}
	},

	/********************************
	 * Computation functions
	 *******************************/

	/**
	 * Convert a decimal number to hex number
	 * @param {*} d 
	 * @param {*} padding 
	 * @returns 
	 */
	decimalToHex: function (d, padding) {
		var hex = Number(d).toString(16);
		padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
		while (hex.length < padding) {
			hex = "0" + hex;
		}

		return hex;
	},

	/**
	 * If a number is power of two
	 * @param {*} x 
	 * @returns 
	 */
	isPowerOfTwo: function (x) {
		return (x & (x - 1)) == 0;
	},

	/**
	 * Compute the nearest highest power of two
	 * @param {*} x 
	 * @returns 
	 */
	nextHighestPowerOfTwo: function (x) {
		--x;
		for (var i = 1; i < 32; i <<= 1) {
			x = x | x >> i;
		}
		return x + 1;
	},

	/**
	 * Convert an angle from deg to rad
	 * @param {*} angle 
	 * @returns 
	 */
	degToRad: function (angle) {
		return (angle * Math.PI / 180);
	},

	/**
	 * Returns an identity matrix
	 * @returns 
	 */
	identityMatrix: function () {
		return [1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1];
	},

	/**
	 * Returns an identity matrix
	 * @returns 
	 */
	identityMatrix3: function () {
		return [1, 0, 0,
			0, 1, 0,
			0, 0, 1];
	},

	/**
	 * Returns the 3x3 submatrix from a Matrix4x4
	 * @param {*} m 
	 * @returns 
	 */
	sub3x3from4x4: function (m) {
		out = [];
		out[0] = m[0]; out[1] = m[1]; out[2] = m[2];
		out[3] = m[4]; out[4] = m[5]; out[5] = m[6];
		out[6] = m[8]; out[7] = m[9]; out[8] = m[10];
		return out;
	},

	/**
	 * Multiply the mat3 with a vec3
	 * @param {*} m 
	 * @param {*} a 
	 * @returns 
	 */
	multiplyMatrix3Vector3: function (m, a) {
		out = [];
		var x = a[0], y = a[1], z = a[2];
		out[0] = x * m[0] + y * m[1] + z * m[2];
		out[1] = x * m[3] + y * m[4] + z * m[5];
		out[2] = x * m[6] + y * m[7] + z * m[8];
		return out;
	},

	/**
	 * Multiply the mat4 with a vec4
	 * @param {*} m 
	 * @param {*} a 
	 * @returns 
	 */
	multiplyMatrix4Vector4: function (m, a) {
		out = [];
		var x = a[0], y = a[1], z = a[2], w = a[3];
		out[0] = x * m[0] + y * m[1] + z * m[2] + w * m[3];
		out[1] = x * m[4] + y * m[5] + z * m[6] + w * m[7];
		out[2] = x * m[8] + y * m[9] + z * m[10] + w * m[11];
		out[3] = x * m[12] + y * m[13] + z * m[14] + w * m[15];
		return out;
	},

	/**
	 * Invert a 3x3 matrix
	 * @param {*} m 
	 * @returns 
	 */
	invertMatrix3: function (m) {
		out = [];
		var a00 = m[0], a01 = m[1], a02 = m[2],
			a10 = m[3], a11 = m[4], a12 = m[5],
			a20 = m[6], a21 = m[7], a22 = m[8],
			b01 = a22 * a11 - a12 * a21,
			b11 = -a22 * a10 + a12 * a20,
			b21 = a21 * a10 - a11 * a20,
			// Calculate the determinant
			det = a00 * b01 + a01 * b11 + a02 * b21;
		if (!det) {
			return null;
		}
		det = 1.0 / det;
		out[0] = b01 * det;
		out[1] = (-a22 * a01 + a02 * a21) * det;
		out[2] = (a12 * a01 - a02 * a11) * det;
		out[3] = b11 * det;
		out[4] = (a22 * a00 - a02 * a20) * det;
		out[5] = (-a12 * a00 + a02 * a10) * det;
		out[6] = b21 * det;
		out[7] = (-a21 * a00 + a01 * a20) * det;
		out[8] = (a11 * a00 - a01 * a10) * det;
		return out;
	},

	/**
	 * Requires as a parameter a 4x4 matrix (array of 16 values)
	 * @param {*} m 
	 * @returns 
	 */
	invertMatrix: function (m) {
		var out = [];
		var inv = [];
		var det, i;
		inv[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] +
			m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
		inv[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] -
			m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
		inv[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] +
			m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
		inv[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] -
			m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];
		inv[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] -
			m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
		inv[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] +
			m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
		inv[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] -
			m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
		inv[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] +
			m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];
		inv[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] +
			m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
		inv[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] -
			m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
		inv[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] +
			m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
		inv[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] -
			m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];
		inv[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] -
			m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
		inv[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] +
			m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
		inv[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11] -
			m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
		inv[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] +
			m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];
		det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];
		if (det == 0)
			return out = this.identityMatrix();
		det = 1.0 / det;
		for (i = 0; i < 16; i++)
			out[i] = inv[i] * det;
		return out;
	},

	/**
	 * Transpose a 4x4 matrix
	 * @param {*} m 
	 * @returns 
	 */
	transposeMatrix: function (m) {
		var out = [];
		var row, column, row_offset;
		row_offset = 0;
		for (row = 0; row < 4; ++row) {
			row_offset = row * 4;
			for (column = 0; column < 4; ++column) {
				out[row_offset + column] = m[row + column * 4];
			}
		}
		return out;
	},

	/**
	 * Transpose the values of a mat3
	 * @param {*} a 
	 * @returns 
	 */
	transposeMatrix3: function (a) {
		out = [];
		out[0] = a[0];
		out[1] = a[3];
		out[2] = a[6];
		out[3] = a[1];
		out[4] = a[4];
		out[5] = a[7];
		out[6] = a[2];
		out[7] = a[5];
		out[8] = a[8];
		return out;
	},

	/**
	 * Perform matrix product  { out = m1 * m2;}
	 * @param {*} m1 
	 * @param {*} m2 
	 * @returns 
	 */
	multiplyMatrices: function (m1, m2) {
		var out = [];
		var row, column, row_offset;
		row_offset = 0;
		for (row = 0; row < 4; ++row) {
			row_offset = row * 4;
			for (column = 0; column < 4; ++column) {
				out[row_offset + column] =
					(m1[row_offset + 0] * m2[column + 0]) +
					(m1[row_offset + 1] * m2[column + 4]) +
					(m1[row_offset + 2] * m2[column + 8]) +
					(m1[row_offset + 3] * m2[column + 12]);
			}
		}
		return out;
	},

	/**
	 * Mutiplies a matrix [m] by a vector [v]
	 * @param {*} m 
	 * @param {*} v 
	 * @returns 
	 */
	multiplyMatrixVector: function (m, v) {
		var out = [];
		var row, row_offset;
		row_offset = 0;
		for (row = 0; row < 4; ++row) {
			row_offset = row * 4;
			out[row] =
				(m[row_offset + 0] * v[0]) +
				(m[row_offset + 1] * v[1]) +
				(m[row_offset + 2] * v[2]) +
				(m[row_offset + 3] * v[3]);
		}
		return out;
	},

	/********************************
	 * Model matrix operations
	 *******************************/

	/**
	 * Create a transform matrix for a translation of ({dx}, {dy}, {dz})
	 * @param {*} dx 
	 * @param {*} dy 
	 * @param {*} dz 
	 * @returns 
	 */
	MakeTranslateMatrix: function (dx, dy, dz) {
		var out = this.identityMatrix();
		out[3] = dx;
		out[7] = dy;
		out[11] = dz;
		return out;
	},

	/**
	 * Create a transform matrix for a rotation of {a} along the X axis
	 * @param {*} a 
	 * @returns 
	 */
	MakeRotateXMatrix: function (a) {
		var out = this.identityMatrix();
		var adeg = this.degToRad(a);
		var c = Math.cos(adeg);
		var s = Math.sin(adeg);
		out[5] = out[10] = c;
		out[6] = -s;
		out[9] = s;
		return out;
	},

	/**
	 * Create a transform matrix for a rotation of {a} along the Y axis
	 * @param {*} a 
	 * @returns 
	 */
	MakeRotateYMatrix: function (a) {
		var out = this.identityMatrix();
		var adeg = this.degToRad(a);
		var c = Math.cos(adeg);
		var s = Math.sin(adeg);
		out[0] = out[10] = c;
		out[2] = -s;
		out[8] = s;
		return out;
	},

	/**
	 * Create a transform matrix for a rotation of {a} along the Z axis
	 * @param {*} a 
	 * @returns 
	 */
	MakeRotateZMatrix: function (a) {
		var out = this.identityMatrix();
		var adeg = this.degToRad(a);
		var c = Math.cos(adeg);
		var s = Math.sin(adeg);
		out[0] = out[5] = c;
		out[4] = -s;
		out[1] = s;
		return out;
	},

	/**
	 * Creates a world matrix for an object
	 * @param {*} rx 
	 * @param {*} ry 
	 * @param {*} rz 
	 * @param {*} s 
	 * @returns 
	 */
	MakeRotateXYZMatrix: function (rx, ry, rz, s) {
		var Rx = this.MakeRotateXMatrix(ry);
		var Ry = this.MakeRotateYMatrix(rx);
		var Rz = this.MakeRotateZMatrix(rz);
		out = this.multiplyMatrices(Ry, Rz);
		out = this.multiplyMatrices(Rx, out);
		return out;
	},

	/**
	 * Create a transform matrix for proportional scale
	 * @param {*} s 
	 * @returns 
	 */
	MakeScaleMatrix: function (s) {
		var out = this.identityMatrix();
		out[0] = out[5] = out[10] = s;
		return out;
	},

	/**
	 * Creates a world matrix for an object
	 * @param {*} tx 
	 * @param {*} ty 
	 * @param {*} tz 
	 * @param {*} rx 
	 * @param {*} ry 
	 * @param {*} rz 
	 * @param {*} s 
	 * @returns 
	 */
	MakeTrueWorld: function (tx, ty, tz, rx, ry, rz, s) {
		var Rx = this.MakeRotateXMatrix(rx);
		var Ry = this.MakeRotateYMatrix(ry);
		var Rz = this.MakeRotateZMatrix(rz);
		var S = this.MakeScaleMatrix(s);
		var T = this.MakeTranslateMatrix(tx, ty, tz);
		out = this.multiplyMatrices(Rz, S);
		out = this.multiplyMatrices(Rx, out);
		out = this.multiplyMatrices(Ry, out);
		out = this.multiplyMatrices(T, out);
		return out;
	},

	/**
	 * Creates a world matrix for an object
	 * @param {*} T 
	 * @param {*} Rx 
	 * @param {*} Ry 
	 * @param {*} Rz 
	 * @param {*} S 
	 * @returns 
	 */
	MakeWorldFromMatrices: function (T, Rx, Ry, Rz, S) {
		out = this.multiplyMatrices(Rz, S);
		out = this.multiplyMatrices(Ry, out);
		out = this.multiplyMatrices(Rx, out);
		out = this.multiplyMatrices(T, out);
		return out;
	},

	/**
	 * Add a vec3
	 * @param {*} v1 
	 * @param {*} v2 
	 * @returns 
	 */
	add3Vectors: function (v1, v2) {
		return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
	},

	/**
	 * Subtract a vec3
	 * @param {*} v1 
	 * @param {*} v2 
	 * @returns 
	 */
	sub3Vectors: function (v1, v2) {
		return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
	},

	/**
	 * Scale a vec3
	 * @param {*} v 
	 * @param {*} s 
	 * @returns 
	 */
	scale3Vector: function (v, s) {
		return [v[0] * s, v[1] * s, v[2] * s];
	},

	/********************************
	 * Model matrix operations
	 *******************************/

	/**
	 * Creates a world matrix for an object
	 * @param {*} tx 
	 * @param {*} ty 
	 * @param {*} tz 
	 * @param {*} rx 
	 * @param {*} ry 
	 * @param {*} rz 
	 * @param {*} s 
	 * @returns 
	 */
	MakeWorld: function (tx, ty, tz, rx, ry, rz, s) {
		var Rx = this.MakeRotateXMatrix(ry);
		var Ry = this.MakeRotateYMatrix(rx);
		var Rz = this.MakeRotateZMatrix(rz);
		var S = this.MakeScaleMatrix(s);
		var T = this.MakeTranslateMatrix(tx, ty, tz);
		out = this.multiplyMatrices(Rz, S);
		out = this.multiplyMatrices(Ry, out);
		out = this.multiplyMatrices(Rx, out);
		out = this.multiplyMatrices(T, out);
		return out;
	},

	/**
	 * Creates in {out} a view matrix. The camera is centerd in ({cx}, {cy}, {cz}).
	 * It looks {ang} degrees on y axis, and {elev} degrees on the x axis.
	 * @param {*} cx 
	 * @param {*} cy 
	 * @param {*} cz 
	 * @param {*} elev 
	 * @param {*} ang 
	 * @returns 
	 */
	MakeView: function (cx, cy, cz, elev, ang) {
		var T = [];
		var Rx = [];
		var Ry = [];
		var tmp = [];
		var out = [];
		T = this.MakeTranslateMatrix(-cx, -cy, -cz);
		Rx = this.MakeRotateXMatrix(-elev);
		Ry = this.MakeRotateYMatrix(-ang);
		tmp = this.multiplyMatrices(Ry, T);
		out = this.multiplyMatrices(Rx, tmp);
		return out;
	},

	/**
	 * Creates the perspective projection matrix. The matrix is returned.
	 * {fovy} contains the vertical field-of-view in degrees. {a} is the aspect ratio.
	 * {n} is the distance of the near plane, and {f} is the far plane.
	 * @param {*} fovy 
	 * @param {*} a 
	 * @param {*} n 
	 * @param {*} f 
	 * @returns 
	 */
	MakePerspective: function (fovy, a, n, f) {
		var perspective = this.identityMatrix();
		var halfFovyRad = this.degToRad(fovy / 2);	// stores {fovy/2} in radiants
		var ct = 1.0 / Math.tan(halfFovyRad);			// cotangent of {fov/2}
		perspective[0] = ct / a;
		perspective[5] = ct;
		perspective[10] = (f + n) / (n - f);
		perspective[11] = 2.0 * f * n / (n - f);
		perspective[14] = -1.0;
		perspective[15] = 0.0;
		return perspective;
	},

	/**
	 * Normalize a matrix
	 * @param {*} v 
	 * @returns 
	 */
	normalize: function (v) {
		let norm = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
		return [v[0] / norm, v[1] / norm, v[2] / norm];
	},

	/********************************
	 * Object loading functions
	 *******************************/

	/**
	 * This function loads an object from an .obj file
	 * @param {*} text 
	 * @returns 
	 */
	ParseOBJ: function (text) {
		// because indices are base 1 let's just fill in the 0th data
		const objPositions = [[0, 0, 0]];
		const objTexcoords = [[0, 0]];
		const objNormals = [[0, 0, 0]];
		const objColors = [[0, 0, 0]];
		// same order as `f` indices
		const objVertexData = [
			objPositions,
			objTexcoords,
			objNormals,
			objColors,
		];
		// same order as `f` indices
		let webglVertexData = [
			[],   // positions
			[],   // texcoords
			[],   // normals
			[],   // colors
		];
		const materialLibs = [];
		const geometries = [];
		let geometry;
		let groups = ['default'];
		let material = 'default';
		let object = 'default';
		const noop = () => { };
		function newGeometry() {
			// If there is an existing geometry and it's
			// not empty then start a new one.
			if (geometry && geometry.data.position.length) {
				geometry = undefined;
			}
		}
		function setGeometry() {
			if (!geometry) {
				const position = [];
				const texcoord = [];
				const normal = [];
				const color = [];
				webglVertexData = [
					position,
					texcoord,
					normal,
					color,
				];
				geometry = {
					object,
					groups,
					material,
					data: {
						position,
						texcoord,
						normal,
						color,
					},
				};
				geometries.push(geometry);
			}
		}
		function addVertex(vert) {
			const ptn = vert.split('/');
			ptn.forEach((objIndexStr, i) => {
				if (!objIndexStr) {
					return;
				}
				const objIndex = parseInt(objIndexStr);
				const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
				webglVertexData[i].push(...objVertexData[i][index]);
				// if this is the position index (index 0) and we parsed
				// vertex colors then copy the vertex colors to the webgl vertex color data
				if (i === 0 && objColors.length > 1) {
					geometry.data.color.push(...objColors[index]);
				}
			});
		}
		const keywords = {
			v(parts) {
				// if there are more than 3 values here they are vertex colors
				if (parts.length > 3) {
					objPositions.push(parts.slice(0, 3).map(parseFloat));
					objColors.push(parts.slice(3).map(parseFloat));
				} else {
					objPositions.push(parts.map(parseFloat));
				}
			},
			vn(parts) {
				objNormals.push(parts.map(parseFloat));
			},
			vt(parts) {
				// should check for missing v and extra w?
				objTexcoords.push(parts.map(parseFloat));
			},
			f(parts) {
				setGeometry();
				const numTriangles = parts.length - 2;
				for (let tri = 0; tri < numTriangles; ++tri) {
					addVertex(parts[0]);
					addVertex(parts[tri + 1]);
					addVertex(parts[tri + 2]);
				}
			},
			s: noop,    // smoothing group
			mtllib(parts, unparsedArgs) {
				// the spec says there can be multiple filenames here
				// but many exist with spaces in a single filename
				materialLibs.push(unparsedArgs);
			},
			usemtl(parts, unparsedArgs) {
				material = unparsedArgs;
				newGeometry();
			},
			g(parts) {
				groups = parts;
				newGeometry();
			},
			o(parts, unparsedArgs) {
				object = unparsedArgs;
				newGeometry();
			},
		};
		const keywordRE = /(\w*)(?: )*(.*)/;
		const lines = text.split('\n');
		for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
			const line = lines[lineNo].trim();
			if (line === '' || line.startsWith('#')) {
				continue;
			}
			const m = keywordRE.exec(line);
			if (!m) {
				continue;
			}
			const [, keyword, unparsedArgs] = m;
			const parts = line.split(/\s+/).slice(1);
			const handler = keywords[keyword];
			if (!handler) {
				//console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
				continue;
			}
			handler(parts, unparsedArgs);
		}
		// remove any arrays that have no entries.
		for (const geometry of geometries) {
			geometry.data = Object.fromEntries(
				Object.entries(geometry.data).filter(([, array]) => array.length > 0));
		}
		return {
			geometries,
			materialLibs,
		};
	},

	/**
	 * Function to parse mtl args
	 * @param {*} unparsedArgs 
	 * @returns 
	 */
	ParseMapArgs: function (unparsedArgs) {
		// TODO: handle options
		return unparsedArgs;
	},

	/**
	 * Function to load an .mtl file
	 * @param {*} text 
	 * @returns 
	 */
	ParseMTL: function (text) {
		const materials = {};
		let material;
		const keywords = {
			newmtl(parts, unparsedArgs) {
				material = {};
				materials[unparsedArgs] = material;
			},
			/* eslint brace-style:0 */
			Ns(parts) { material.shininess = parseFloat(parts[0]); },
			Ka(parts) { material.ambient = parts.map(parseFloat); },
			Kd(parts) { material.diffuse = parts.map(parseFloat); },
			Ks(parts) { material.specular = parts.map(parseFloat); },
			Ke(parts) { material.emissive = parts.map(parseFloat); },
			Ni(parts) { material.opticalDensity = parseFloat(parts[0]); },
			d(parts) { material.opacity = parseFloat(parts[0]); },
			illum(parts) { material.illum = parseInt(parts[0]); },
		};
		const keywordRE = /(\w*)(?: )*(.*)/;
		const lines = text.split('\n');
		for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
			const line = lines[lineNo].trim();
			if (line === '' || line.startsWith('#')) {
				continue;
			}
			const m = keywordRE.exec(line);
			if (!m) {
				continue;
			}
			const [, keyword, unparsedArgs] = m;
			const parts = line.split(/\s+/).slice(1);
			const handler = keywords[keyword];
			if (!handler) {
				//console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
				continue;
			}
			handler(parts, unparsedArgs);
		}
		return materials;
	},

	/**
	 * Get the geometry extents
	 * @param {*} geometries 
	 * @returns 
	 */
	getGeometriesExtents: function (geometries) {
		let getExtents = function (positions) {
			const min = positions.slice(0, 3);
			const max = positions.slice(0, 3);
			for (let i = 3; i < positions.length; i += 3) {
				for (let j = 0; j < 3; ++j) {
					const v = positions[i + j];
					min[j] = Math.min(v, min[j]);
					max[j] = Math.max(v, max[j]);
				}
			}
			return { min, max };
		};
		return geometries.reduce(({ min, max }, { data }) => {
			const minMax = getExtents(data.position);
			return {
				min: min.map((min, ndx) => Math.min(minMax.min[ndx], min)),
				max: max.map((max, ndx) => Math.max(minMax.max[ndx], max)),
			};
		}, {
			min: Array(3).fill(Number.POSITIVE_INFINITY),
			max: Array(3).fill(Number.NEGATIVE_INFINITY),
		});
	},

}