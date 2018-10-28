module.exports = {
	allowedProps: ['required'],

	validateType(value) {
		if (value === null) return false;

		const d = new Date(value);
		return d instanceof Date && !isNaN(d);
	}
};
