const ArticlesHelper = {};

ArticlesHelper.getFeaturedArticle = (databaseRef, limit) => {
    return new Promise((resolve, reject) => {
        databaseRef.get().then((snapshot)=>{
            return snapshot.exists ? resolve(snapshot.data()) : reject(new Error("No articles found"))
        }).catch((err)=>{
            return err;
        })
    })
};

ArticlesHelper.getFeaturedBrand = (databaseRef, limit) => {
    return new Promise((resolve, reject) => {
        databaseRef.get().then((snapshot)=>{
            return snapshot.exists ? resolve(snapshot.data()) : reject(new Error("No brand found"))
        }).catch((err)=>{
            return err;
        })
    })
};

module.exports = ArticlesHelper;