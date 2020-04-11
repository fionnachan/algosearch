/*
	Query: addresses.js
	____________
	Addresses endpoint
	____________
	Various Return schemas
*/

var constants = require('../global'); // Require global constants
const axios = require("axios"); // Axios for requests

// Export express routes
module.exports = function(app) {

	// --> Single address data retrieval
	app.get('/address/:address', function(req, res) {
		const address = req.params.address; // Get address from url

		// Request basic account information
		axios({
			method: 'get',
			url: `${constants.algodurl}/account/${address}`, // Request transaction details endpoint
			headers: {'X-Algo-API-Token': constants.algodapi}
		}).then(response => {
			let result = response.data; // Set data to result

			axios({
				method: 'get',
				url: `${constants.algodurl}/account/${address}/transactions?max=25`,
				headers: {'X-Algo-API-Token': constants.algodapi}
			}).then(resp => {
				// Add transactions to result
				result.confirmed_transactions = resp.data.transactions;
				res.send(result);
			}).catch(error => {
				res.status(501);
				console.log("Exception when retrieving address transactions: " + error);
			});
		}).catch(error => {
			res.status(501);
			console.log("Exception when retrieving address information: " + error);
		});
	});
}
