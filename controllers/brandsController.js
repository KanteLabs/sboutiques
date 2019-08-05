const Brands = require('../models/Brands/Brands')

const BrandsController = {};

BrandsController.getAll = (req, res) => {
    Brands.getAll()
    .then((data) => {
        res.json(data)
    })
    .catch((error)=>{
        res.status(404)
        res.json({
            error: error.message
        })
    })
}

BrandsController.getBrandById = (req, res) => {
    Brands.getBrandById(req.params.brand_id)
    .then((data) => {
        res.json(data)
    })
    .catch((error)=>{
        res.status(404)
        res.json({
            error: error.message
        })
    })
}

BrandsController.createBrand = (req, res) => {
    Brands.createBrand(req.body)
    .then((data) => {
        res.json(data)
    })
    .catch((error)=>{
        res.status(404)
        res.json({
            error: error.message
        })
    })
}

module.exports = BrandsController;