const net = require("net");
const openpgp = require("openpgp");

const utils = require("./utils");
const chalk = require("chalk");

const aes = require("./aes");
const SecureConnection = require("./secure_connection");

/**
 * 
 * @param {SecsockCallback} listener The callback for when the connection is established
 * @param {number} port The port of the server
 * @param {string} host The hostname of the server
 * 
 * @class
 */
function SecsockClient (listener = (listener) => {}, port, host = "0.0.0.0") {

	var socket = net.createConnection({
		port,
		host
	});

	var sc;

	var publicKey;
	var aesKey = utils.unique();

	socket.on("data", async data => {

		if (!publicKey) {

			utils.log(`Received public key from server`);

			publicKey = data.toString();

			let options = {
				message: openpgp.message.fromText(aesKey),
				publicKeys: (await openpgp.key.readArmored(publicKey)).keys
			}

			openpgp.encrypt(options).then(ciphertext => {

				socket.write(ciphertext.data);
				sc = new SecureConnection(socket, aesKey);
				listener(sc);

			});

		} else {

			sc.process(data);

		}

	});

}

module.exports = SecsockClient;

/**
 * @callback SecsockCallback
 * @param {SecureConnection} secure
 * @private
 */

