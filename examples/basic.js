const secsock = require("../src/index");

var server = new secsock.Server(secure => {

	secure.on("json", data => {

		console.log(data);

	});

}, 2511);

var client = new secsock.Client(secure => {

	secure.sendJson({
		message: "Hello World"
	});

}, 2511)
