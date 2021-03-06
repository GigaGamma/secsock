const aes = require("./aes");

const net = require("net");

/**
 * Creates an easy to use connection instance
 * @param {net.Socket} _socket The socket of said connection
 * @param {string} _aesKey The already established aes key
 * 
 * @class
 */
function SecureConnection (_socket, _aesKey) {

	var socket = _socket;
	var aesKey = _aesKey;

	function execute (event, args) {

		for (e of events[event]) {
			e.apply(undefined, args);
		}

	}

	var offloading = false;
	var ofb = "";

	var ofl = 0;

	/**
	 * Process data that has been received
	 * @private
	 */
	this.process = function process (data) {

		if (offloading) {
			ofb += data.toString().trim();
			if (ofb.length === ofl) {

				offloading = false;
				this.process(ofb);

			}
			return;
		}

		var e = aes.decryptString(data.toString().trim(), aesKey);

		var j = JSON.parse(e);

		if (j.type === "start_load") {
			offloading = true;
			ofl = j.data;
		}

		if (j.type === "json") {

			execute(j.type, [j.data]);

		} else if (j.type === "file") {

			execute(j.type, [j.data.name, Buffer.from(j.data.content)]);

		}

	}

	var events = {

		json: [],
		file: []

	}

	/**
	 * Listen to an event
	 * @param {string} event
	 * @param {Function} listener 
	 * @returns {SecureConnection}
	 */

	this.on = function on (event, listener) {

		if (!events[event]) throw new Error(`Invalid event: ${event}`);

		events[event].push(listener);

		return this;

	}

	this.write = function write (data) {

		var e = aes.encryptString(data, aesKey);

		if (e.length >= 65536) {

			var s = e.match(/.{1,65535}/g);

			// console.log(s.length);
			
			this.sendData("start_load", e.length);

			setTimeout(() => {

				var i = 0;

				var ii = setInterval(() => {

					if (s[i] === undefined) {clearInterval(ii); return;}

					socket.write(s[i] + "\n");

					i++;

				}, 50);

			}, 100);

		} else {

			socket.write(e + "\n");

		}

	}

	
	/**
	 * Sends data. I wouldn't recommend using this function directly.
	 * @param {string} type The type of data to send
	 * @param {Object} data The data to send
	 * @returns {SecureConnection}
	 * 
	 * @see sendJson
	 */

	this.sendData = function sendData (type, data) {

		this.write(JSON.stringify({

			type,
			data

		}));

		return this;

	}
	
	/**
	 * Sends JSON data
	 * @param {Object} json The JSON to send
	 * @returns {SecureConnection}
	 */

	this.sendJson = function sendJson (json) {

		this.sendData("json", json);

		return this;

	}
	
	/**
	 * Sends file data
	 * @param {string} name The name of the file to send
	 * @param {Buffer} content The file data to send
	 * @returns {SecureConnection}
	 */

	this.sendFile = function sendFile (name, content) {

		this.sendData("file", {
			name,
			content: [...content]
		});	
	
		return this;

	}

}

module.exports = SecureConnection;
