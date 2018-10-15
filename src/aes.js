const crypto = require("crypto");

const stream = require("stream");
const Readable = stream.Readable;
const Writeable = stream.Writable;
const PassThrough = stream.PassThrough;

module.exports = {

	encryptString (string, key) {

		var c = crypto.createCipher("aes-256-cbc", key);

		var crypted = c.update(string, "utf8", "hex");
		crypted += c.final("hex");
		return crypted;

	},

	decryptString (string, key) {
	
		var c = crypto.createDecipher("aes-256-cbc", key);

		var crypted = c.update(string, "hex", "utf8");
		crypted += c.final("utf8");
		return crypted;

	}

	// stringToReadable (string) {

	// 	const s = new Readable();
	// 	s.push(string);
	// 	s.push(null);

	// 	return s;

	// },

	// bufferToReadable (buffer) {

	// 	var bufferStream = new PassThrough();

	// 	bufferStream.push(buffer);
	// 	bufferStream.push(null);
	// 	// bufferStream.wr

	// 	return bufferStream;

	// },

	// piperString (cb = () => {}) {

	// 	var s = "";
	// 	var p = new stream.Writable({
	// 		write: function(chunk, encoding, next) {
	// 			s += chunk;
	// 			next();
	// 		}
	// 	});

	// 	p.on("finish", () => {
	// 		cb(s);
	// 	});

	// 	return p;

	// },

	// encryptStream (istream, ostream, key, cb = () => {}) {

	// 	var c = crypto.createCipher("aes-256-cbc", key);
	// 	istream.pipe(c).pipe(ostream);

	// 	c.on("finish", () => {
	// 		istream.unpipe(c).unpipe(ostream);
	// 		// istream.resume();
	// 		// ostream.resume();
	// 		cb();
	// 	});

	// },

	// decryptStream (istream, ostream, key, cb = () => {}) {

	// 	var c = crypto.createDecipher("aes-256-cbc", key);
	// 	istream.pipe(c).pipe(ostream);

	// 	c.on("finish", () => {
	// 		istream.unpipe(c).unpipe(ostream);
	// 		// istream.resume();
	// 		// ostream.resume();
	// 		cb();
	// 	});

	// },

}
