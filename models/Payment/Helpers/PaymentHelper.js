const { paypal, isProduction, paypalKeys, client, redis } = require('../../../db/config');

const paymentHelper = {};

paymentHelper.setTempRedisTransaction = (productData) => {
	return new Promise((resolve, reject) => {
		client.set(`${productData.user_id}_current_transaction`, JSON.stringify(productData), redis.print)
		client.get(productData.user_id, function (error, result) {
			if (error) {
				console.log(error);
				reject(error)
			}
			resolve(result)
		});
	});
}

paymentHelper.redisSetCompletedTransaction = (paypalInfo, userId) => {
	return new Promise((resolve, reject) => {
		client.get(`${userId}_current_transaction`, function (error, result) {
			if (error) {
				console.log(error);
				reject(error)
			}
			storeCompletedTransaction({result, paypalInfo}, userId)
		});

		function storeCompletedTransaction(data, userId) {
			client.set(`${userId}_completed_transaction`, JSON.stringify(data), redis.print);
			client.get(`${userId}_completed_transaction`, function (error, result) {
				if (error) {
					console.log(error);
					reject(error)
				}
				console.log('GET result ->' + result);
				resolve(result)
			});
		}
	});
}

paymentHelper.connectToPaypal = (productData) => {
	return new Promise((resolve, reject) => {
		const payReq = JSON.stringify({
			intent: 'sale',
			payer: {
			  payment_method: 'paypal'
			},
			redirect_urls: paypalKeys.redirect_urls,
			transactions: [{
			  "amount": {
				"total": productData.total,
				"currency": "USD",
				"details": {
				  "subtotal": productData.cost,
				  "tax": '0.00',
				  "shipping": productData.shipping,
				},
			  },
			  // This is the payment transaction description. Maximum length: 127
			description: `Purchase on Streetwear Boutiques from ${productData.designer}, email: ${productData.paypal_email}`,
				item_list: {
				items: [{
					currency: 'USD',
					name: productData.title,
					price: productData.cost,
					quantity: 1,
					sku: productData.id,
					description: productData.size,
				}]
				},
				// reference_id string .Optional. The merchant-provided ID for the purchase unit. Maximum length: 256.
				// reference_id: productData.uid,
				custom: `user_id: ${productData.user_id}, size: ${productData.size}`,
				soft_descriptor: productData.designer
			}]
		});

		paypal.payment.create(payReq, {
			'Access-Control-Allow-Origin': 'https://streetwearboutiques.com'
		}, (err, payment) => {
			const links = {};
			if(err) {
				console.error(err);
				return reject(err);
			}

			// Capture HATEOAS links
			payment.links.forEach((linkObj) => {
				links[linkObj.rel] = {
					href: linkObj.href,
					method: linkObj.method
				};
			});

			if (links.hasOwnProperty('approval_url')) {
				return resolve(links['approval_url'].href)
			} 
			else {
			  console.error('no redirect URI present');
			  return reject(new Error('no redirect URI present'))
			}
		})
	})
};

paymentHelper.storeTransaction = (databaseRef, paymentDetails) => {
	return new Promise((resolve, reject) => {
		databaseRef.set({paymentDetails, token: paymentDetails.token}, {merge: true})
		.then(res => {
			return resolve(res)
		})
		.catch(err => {
			return reject(err)
		})
	});
}

paymentHelper.saveTransaction = (databaseRef, paymentDetails, userRef, userId) => {
	return new Promise((resolve, reject) => {
		const d = new Date().getTime().toString();
		databaseRef.doc(`${d}`).set({paymentDetails, token: paymentDetails.tokens.token, payerID: paymentDetails.tokens.PayerID})
		.then(res => {
			client.get(`${userId}_current_transaction`, function (error, result) {
				if (error) {
					console.log(error);
					reject(error)
				}
				console.log(result);
				userRef.add({product: JSON.parse(result), paymentDetails})
				.then((data) => {
					resolve(data)
				})
			});
		})
		.catch(err => {
			console.log(err)
			return reject(err)
		})
	});
}

paymentHelper.processTransaction = (tokens) => {
	return new Promise((resolve, reject) => {
		const { paymentId, PayerID} = tokens;
		const payerId = {
			payer_id: PayerID
		  };

		paypal.payment.execute(paymentId, payerId, (error, payment) => {
			if(error) {
				console.log(error)
				return  reject(error.message);
			} else {
				if (payment.state === 'approved') {
					resolve({payment, tokens})
				} else {
					console.warn('payment.state: not approved ?');
					reject('payment.state: not approved ?')
				}
			}
		})
	});
}

module.exports = paymentHelper;