const Forms = require('../models/Forms/Forms')

const FormsController = {};

FormsController.sendContactEmail = (req, res) => {
    Forms.contact(req.body)
    .then(status => {
        res.json(status)
    })
    .catch((error)=>{
        const status = 404;
        res.json({
            status: status,
            error: error.message
        })
    })
}

FormsController.registerBrand = (req, res) => {
    Forms.newBrand(req.body)
    .then(status => {
        res.send(status)
    })
    .catch((error)=>{
        const status = 404;
        res.json({
            status: status,
            error: error.message
        })
    })
}

FormsController.subscribeUser = (req, res) => {
    Forms.subscribe(req.body)
    .then(status => {
        res.json(status)
    })
    .catch((error)=>{
        const status = 404;
        res.json({
            status: status,
            error: error.message
        })
    })
}

module.exports = FormsController;