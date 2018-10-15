const fs = require("fs");
const secsock = require("../src/index");

var server = new secsock.Server(secure => {

	secure.sendJson({
		test_data: "Hello World"
	});

	secure.on("file", (name, data) => {

		console.log(data.toString());

	});

}, 81);

var client = new secsock.Client(secure => {

	secure.on("json", data => {

		secure.sendFile("test.txt", Buffer.from(data.test_data));

	});

}, 81);


