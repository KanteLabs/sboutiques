const express = require ('express');
const api = express.Router();
const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })
const path = require('path')

const ApiHelper = require('./ApiHelper');

const clothesController = require('../controllers/clothesController');
const articlesController = require('../controllers/articlesController');
const brandsController = require('../controllers/brandsController');
const userController = require('../controllers/userController');
const paymentController = require('../controllers/paymentController');

api.get('/clothes/category/:category', clothesController.getByCategory);
api.get('/clothes/recent-uploads', ApiHelper.checkCache, clothesController.getRecentUploads);
api.get('/clothes/:limit', clothesController.getAll);
api.post('/clothes/upload/', multer().any(), function (req, res){
    const isLessThan5 = ApiHelper.checkFileAmount(req.files);
    const areFilesApproved = ApiHelper.checkForValidFiles(req.files);
    const isGreaterThanZero = ApiHelper.isGreaterThanZero(req.body);

    return (
        isLessThan5 
            ?   areFilesApproved 
                ?   isGreaterThanZero 
                    ?   clothesController.uploadProduct(req, res) 
                    :   res.status(415).send('Please make sure all your prices are greater than $0.')
                : res.status(415).send('You can only upload images that end with the following extenstions: .png, .gif, .jpeg, and .jpg. Please try again.')
            : res.status(406).send('You may only attach 5 additional images, on top of 1 main image. Reduce the amount of Images and try again')
        )
    }
);

api.get('/wishlist/:user_id', clothesController.getWishlist)
api.post('/wishlist/add', clothesController.addToWishList)
api.post('/wishlist/remove', clothesController.removeFromWishList)

api.get('/articles/featured_article', articlesController.getFeatureArticle);

api.get('/brands/', brandsController.getAll);
api.get('/brands/:brand_id', brandsController.getBrandById);
api.get('/brands/clothing/:productId/:productTitle/:brandId', clothesController.getProductById);
api.post('/brands/register', brandsController.createBrand);

api.get('/user/:user_id', userController.getUser);

api.post('/pay/:method', paymentController.startPayment);
api.post('/pay/:method/process', paymentController.processTransaction);
api.post('/pay/transaction/:status', paymentController.storeTransaction);

// api.get('/:id',apiController.getapi);
// api.post('/',apiController.createapi);
// api.put('/:id',apiController.editapi);

module.exports =  api;