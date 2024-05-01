// NOTE: list of all test tasks

function fibonacci(n) {
	if (n <= 1) {
		return 1
	}
	return fibonacci(n - 1) + fibonacci(n - 2)
}

module.exports = {
	fibonacci
};
