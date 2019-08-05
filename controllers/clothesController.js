const Clothes = require('../models/Clothes/Clothes')

const ClothesController = {};

ClothesController.getAll = (req, res) => {
    Clothes.getAll(req.params.limit)
    .then(products => {
        res.json(products)
    })
    .catch((error)=>{
        const status = 404;
        res.json({
            status: status,
            error: error.message
        })
    })
}

ClothesController.getByCategory = (req, res) => {
    Clothes.getByCategory(req.query.limit, req.params.category)
    .then(products => {
        res.json(products)
    })
    .catch((error)=>{
        const status = 404;
        res.json({
            status: status,
            error: error.message
        })
    })
}

ClothesController.getRecentUploads = (req, res) => {
    Clothes.getRecentUploads(12)
    .then(uploads => {
        res.json(uploads)
    })
    .catch((error)=>{
        const status = 404;
        res.json({
            status: status,
            error: error.message
        })
    })
}

ClothesController.uploadProduct = (req, res) => {
    let {body, files} = req;
    Clothes.create(body, files)
    .then((imageRes)=>{
       res.json(imageRes)
    })
    .catch((err)=>{
        const status = 404;
        res.json({
            status: status,
            error: err.message
        })
    })
}

ClothesController.getWishlist = (req, res) => {
    Clothes.getWishlist(req.params.user_id)
    .then((data)=>{
       res.json(data)
    })
    .catch((err)=>{
        console.log(err)
        const status = 404;
        res.json({
            status: status,
            error: err.message
        })
    })
}

ClothesController.addToWishList = (req, res) => {
    Clothes.addToWishList(req.body)
    .then((data)=>{
       res.json(data)
    })
    .catch((err)=>{
        console.log(err)
        const status = 404;
        res.json({
            status: status,
            error: err.message
        })
    })
}

ClothesController.removeFromWishList = (req, res) => {
    Clothes.removeFromWishList(req.body)
    .then((data)=>{
       res.json(data)
    })
    .catch((err)=>{
        console.log(err)
        const status = 404;
        res.json({
            status: status,
            error: err.message
        })
    })
}

ClothesController.getProductById = (req, res) => {
    const {productTitle, productId, brandId} = req.params;
    Clothes.getProductById(Number(productId), productTitle, brandId)
    .then((data)=>{
       res.json(data)
    })
    .catch((err)=>{
        console.log(err)
        const status = 404;
        res.json({
            status: status,
            error: err.message
        })
    })
}

module.exports = ClothesController;