const db = require('../../db/firebase');

const paymentHelper = require('./Helpers/PaymentHelper');
const forms = require('../Forms/Forms');

const Payment = {};
const databaseRef = db.collection('transactions');

Payment.startPayment = (productData, paymentMethod) => {
    return new Promise((resolve, reject) => {
        async function startPayment(productData, paymentMethod) {
            try {
                if(paymentMethod.match('paypal')) {
                    const paypalRes = await paymentHelper.connectToPaypal(productData);
                    return paypalRes ? resolve(paypalRes) : reject(new Error("Failed getting Payment"))
                }
            } catch (error) {
                reject(new Error("Failed getting Payment"))
            }
        }

        startPayment(productData, paymentMethod)
        .then((res) => {
            resolve(res)
        })
        .catch((err) => {
            console.log(err)
            reject(err)
        })
    });
}

Payment.storeTransaction = (paymentDetails, paymentStatus) => {
    return new Promise((resolve, reject) => {
        async function storeTransaction(paymentDetails, paymentStatus) {
            const startedDB = db.collection('transactions_started').doc(paymentDetails.additionalInfo.date_placed);
            try {
                if(paymentStatus.match('started')) {
                    const redisRes = await paymentHelper.setTempRedisTransaction(paymentDetails)
                    const firebaseRes = await paymentHelper.storeTransaction(startedDB, paymentDetails);

                    return firebaseRes && redisRes ? resolve(firebaseRes) : reject(new Error("Failed storing Payment"))
                }
            } catch (error) {
                reject(new Error("Failed storing Payment"))
            }
        }

        storeTransaction(paymentDetails, paymentStatus)
        .then((res) => {
            resolve(res)
        })
        .catch((err) => {
            console.log(err)
            reject(err)
        })
    });
}

Payment.processTransaction = (method, tokens, userId) => {
    return new Promise((resolve, reject) => {
        async function processTransaction(method, tokens, userId) {
            try {
                const userRef = db.collection('users').doc(userId).collection('transactions');
                if(method.match('paypal')) {
                    const paypalRes = await paymentHelper.processTransaction(tokens);
                    const firebaseRes = await paymentHelper.saveTransaction(databaseRef, paypalRes, userRef, userId)
                    const emailRes = await forms.newPayment(paypalRes)
                    const redisRes = await paymentHelper.redisSetCompletedTransaction(paypalRes, userId)

                    return firebaseRes && emailRes && redisRes ? resolve(firebaseRes) : reject(new Error("Failed processing Payment"))
                }
                
            } catch (error) {
                reject(error)
            }
        }

        processTransaction(method, tokens, userId)
        .then((res) => {
            resolve(res)
        })
        .catch((err) => {
            console.log(err)
            reject(err)
        })
    });
}

module.exports = Payment;