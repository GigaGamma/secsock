const net = require("net");
const openpgp = require("openpgp");

const utils = require("./utils");
const chalk = require("chalk");

const aes = require("./aes");
const SecureConnection = require("./secure_connection");

/**
 * 
 * @param {SecureConnection} listener 
 * @param {number} port 
 * @param {string} hostname 
 */
function SecsockServer (listener, port, hostname = "0.0.0.0") {

	var server = net.createServer(socket => {

		var publicKey;
		var privateKey;
		var rsaPassphrase = utils.unique();

		var aesKey;

		utils.log(`Openpgp passphrase with length ${rsaPassphrase.length} successfully generated`);

		let options = {
			userIds: [{ name: "Auguste Rame", email: "identity@gigagamma.com" }],
			numBits: 512,
			passphrase: rsaPassphrase
		};

		openpgp.generateKey(options).then(key => {

			publicKey = key.publicKeyArmored;
			privateKey = key.privateKeyArmored;

			utils.log(`RSA keys successfully generated`);

			socket.write(publicKey);

		}).catch(reason => {

			throw reason;

		});

		var sc;

		socket.on("data", async data => {

			const privKeyObj = (await openpgp.key.readArmored(privateKey)).keys[0];
			await privKeyObj.decrypt(rsaPassphrase);

			if (!aesKey) {

				const options = {
					message: await openpgp.message.readArmored(data.toString()),
					publicKeys: (await openpgp.key.readArmored(publicKey)).keys,
					privateKeys: [privKeyObj]
				}

				openpgp.decrypt(options).then(plaintext => {

					aesKey = plaintext.data;

					utils.log("Secure Server -> Client connection established");

					sc = new SecureConnection(socket, aesKey);
					listener(sc);

				});

			} else {

				sc.process(data);

			}

		});

	});

	server.listen(port, hostname);

}

module.exports = SecsockServer;
