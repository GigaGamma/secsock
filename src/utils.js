var _unique = () => Math.random().toString(36).replace("0.", "");

module.exports = {

	unique () {
		return _unique() + _unique() + _unique() + _unique() + _unique() + _unique() + _unique() + _unique() + _unique() + _unique() + _unique() + _unique() + _unique() + _unique() + _unique() + _unique() + _unique() + _unique();
	},

	log (data) {
		console.log(`[${new Date().toISOString()}] ${data}`);
	}

}
