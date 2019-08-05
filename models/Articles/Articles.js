const db = require('../../db/firebase');
const articlesHelper = require('./Helpers/ArticlesHelper');
const Articles = {};

Articles.getFeaturedArticle = (article_id, brand_id) => {
    return new Promise((resolve, reject) => {
        async function grabFeaturedArticle(article_id, brand_id) {
            let articleRef = db.collection('articles').doc(`article_${article_id}`);
            let brandRef = articleRef.collection('brand').doc(`brand_${brand_id}`);

            try {
                const featuredArticle = await articlesHelper.getFeaturedArticle(articleRef);
                const featuredBrand = await articlesHelper.getFeaturedBrand(brandRef);
                return featuredArticle && featuredBrand ? resolve({
                    articleData: featuredArticle,
                    brandData: featuredBrand
                })  : new Error("Failed getting recent articles")
            } catch (error) {
                reject(error)
            }
        }

        grabFeaturedArticle(article_id, brand_id)
        .then((res)=>{
            resolve(res)
        }).catch((err)=>{
            console.log(err)
            reject(err)
        })
    })
};

module.exports = Articles;