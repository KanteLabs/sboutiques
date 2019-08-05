const express = require ('express');
const api = express.Router();
const formsController = require('../controllers/formsController');

api.post('/contact', formsController.sendContactEmail)
api.post('/newBrand', formsController.registerBrand)
api.post('/subscribe', formsController.subscribeUser)

module.exports = api;