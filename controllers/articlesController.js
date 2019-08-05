const Articles = require('../models/Articles/Articles')

const ArticlesController = {};

ArticlesController.getFeatureArticle = (req, res) => {
    Articles.getFeaturedArticle(0, 1)
    .then(articles => {
        res.json(articles)
    })
    .catch((error)=>{
        const status = 404;
        res.json({
            status: status,
            error: error.message
        })
    })
}

module.exports = ArticlesController;