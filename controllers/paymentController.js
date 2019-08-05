const Payment = require('../models/Payment/Payment')

const PaymentController = {};

PaymentController.startPayment = (req, res) => {
    Payment.startPayment(req.body, req.params.method)
    .then(data => {
        res.json(data)
    })
    .catch((error)=>{
        const status = 404;
        res.json({
            status: status,
            error: error.message
        })
    })
}

PaymentController.storeTransaction = (req, res) => {
    Payment.storeTransaction(req.body, req.params.status)
    .then(data => {
        res.json(data)
    })
    .catch((error)=>{
        const status = 404;
        res.json({
            status: status,
            error: error.message
        })
    })
}

PaymentController.processTransaction = (req, res) => {
    Payment.processTransaction(req.params.method, req.query, req.body.userId)
    .then(data => {
        res.json(data)
    })
    .catch((error)=>{
        const status = 404;
        res.json({
            status: status,
            error: error.message
        })
    })
}

module.exports = PaymentController;