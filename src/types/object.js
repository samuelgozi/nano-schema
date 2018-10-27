module.exports = {
	allowedProps: ['type', 'required', 'child'],

	validateType(value) {
		return Object.prototype.toString.call(value) === '[object Object]';
	}
};
