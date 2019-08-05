const db = require('../../db/firebase');
const clothesHelper = require('./Helpers/ClothesHelper');
const brandsHelper = require('../Brands/Helpers/BrandsHelper');
const { client, redis } = require('../../db/config');

const Clothes = {};
const clothesRef = db.collection('products');
const validClothesRef = clothesRef.where('deleted', '==', false).orderBy("id",'desc');

const clothesRefToUse = (limit) => {
    return limit.match('all') ? validClothesRef : validClothesRef.limit(limit)
}

const categoryRef = (limit, category) => {
    return category.match('all') ? validClothesRef :
    clothesRef.where('deleted', '==', false).where('category', '==', `${category.toUpperCase()}`).orderBy('created_date', 'desc');
}

function syncRecentUploadsDatabase() {
    console.log("syncing database with redis")

    clothesRef.where("deleted", "==", false).orderBy("id",'desc').limit(12).onSnapshot((snapshot) => {
        const products = [];
        snapshot.forEach((doc)=>{
            return products.push(
                doc.data()
            )
        })

        compareWithCache(products)
    })

    function compareWithCache(products) {
        client.exists('recent_uploads', (err, data) =>{
            if(err) throw err;

            if(!data) {
                console.log("no cache was found, creating one")

                client.setex('recent_uploads', 3600000, JSON.stringify(products), redis.print);
                client.get('recent_uploads',function(err, data) {
                    if (err) throw err;
                    console.log("updated cache with " + data.length )
                    return null;
                })
            } else {
                return "no updated needed"
            }
        })

        client.get('recent_uploads', function(err, data) {
            if (err) throw err;
            
            data = JSON.parse(data);

            if(!(data && (data[0].id === products[0].id))) {
                console.log("databases are not in sync, updating")
                client.setex('recent_uploads', 3600000, JSON.stringify(products), redis.print);
            } else {
                console.log("databases are in sync")
            }
        })
    }
}


syncRecentUploadsDatabase()
setInterval(syncRecentUploadsDatabase, 3600000)

Clothes.getProductById = (productId, title, brandId) => {
    return new Promise((resolve, reject) => {
        async function grabProduct(productId, title, brandId) {
            const brandRef = db.collection('brands');

            try {
                const brand = await brandsHelper.getBrand(brandRef, brandId);

                const databaseRef = brandRef.doc(brand.brandUid).collection('products').where('id', '==', productId);
                const product = await clothesHelper.getClothing(databaseRef);
                return product ? product : new Error("Failed getting product")
            } catch (error) {
                reject(error)
            }
        }

        grabProduct(productId, title, brandId)
        .then((res)=>{
            resolve(res)
        }).catch((err)=>{
            reject(err)
        })
    })
};

Clothes.getAll = (limit) => {
    return new Promise((resolve, reject) => {
        async function grabProducts(limit) {
            try {
                const products = await clothesHelper.getClothing(validClothesRef, clothesRefToUse(limit));
                return products ? products : new Error("Failed getting products")
            } catch (error) {
                reject(error)
            }
        }

        grabProducts(limit)
        .then((res)=>{
            resolve(res)
        }).catch((err)=>{
            reject(err)
        })
    })
};

Clothes.getByCategory = (limit, category) => {
    return new Promise((resolve, reject) => {
        async function grabProducts(limit, category) {
            const databaseRef = categoryRef(limit, category);

            try {
                const products = await clothesHelper.getByCategory(databaseRef, limit);
                return products ? products : new Error("Failed getting products")
            } catch (error) {
                
            }
        }
        grabProducts(limit, category)
        .then((res)=>{
            resolve(res)
        }).catch((err)=>{
            reject(err)
        })
    });

}

Clothes.getRecentUploads = (limit) => {
    return new Promise((resolve, reject) => {
        async function grabRecent(limit) {
            let productsRef = db.collection('products')
            try {
                const recentUploads = await clothesHelper.getRecent(productsRef, limit);
                return recentUploads ? recentUploads : new Error("Failed getting recent uploads")
            } catch (error) {
                reject(error)
            }
        }

        grabRecent(limit).then((res)=>{
            resolve(res)
        }).catch((err)=>{
            reject(err)
        })
    })
};

Clothes.create = (body, files) => {
    return new Promise((resolve, reject) => {
        async function uploadImages(body, files) {
            try {
                const imageResponses = await clothesHelper.uploadImages(body, files);
                const productAndImageData = await clothesHelper.addProductData(body,imageResponses);

                let brandRef = db.collection('brands').doc(productAndImageData.user_id).collection('products').doc(productAndImageData.title);
                let productRef = db.collection('products');
                const firebaseResponse = await clothesHelper.sendDataToFirebase(productAndImageData, brandRef, productRef)

                return firebaseResponse  ? firebaseResponse : new Error("Failed to upload images")
            } catch (error) {
                reject(new Error("Failed to upload images"))
            }
        }

        uploadImages(body, files).then((res)=>{
            resolve(res)
        }).catch((err)=>{
            reject(err)
        })
    });
}

Clothes.getWishlist = (uid) => {
    return new Promise((resolve, reject) => {
        async function getWishlist(uid) {
            try {
                const wishlistRef = db.collection('users').doc(uid).collection('wishlist');
                const products = await clothesHelper.getClothing(wishlistRef)
                return products ? products : new Error("Failed getting product")
            } catch (error) {
                reject(error)
            }
        }

        getWishlist(uid)
        .then((res)=>{
            resolve(res)
        }).catch((err)=>{
            reject(err)
        })
    });
}

Clothes.addToWishList = (body) => {
    return new Promise((resolve, reject) => {
        async function addToWishList(body) {
            try {
                const userRef = db.collection('users').doc(body.uid).collection('wishlist').doc(`${body.product.id}`);
                const firebaseResponse = await clothesHelper.addToWishList(userRef, body.product)
                return firebaseResponse ? resolve(firebaseResponse) : new Error("Failed to add to wishlist")
            } catch (error) {
                reject(new Error("Failed to add to wishlist"))
            }
        }

        addToWishList(body).then((res)=>{
            resolve({res, status: 200})
        }).catch((err)=>{
            reject(err)
        })
    });
}

Clothes.removeFromWishList = (body) => {
    return new Promise((resolve, reject) => {
        async function removeFromWishList(body) {
            try {
                db.collection('users').doc(body.uid).collection('wishlist').doc(body.product.id.toString()).delete().then((res) => {
                    console.log(res)
                }).catch((err) => {
                    reject(err)
                })
            } catch (error) {
                reject(new Error("Failed to remove from wishlist"))
            }
        }

        removeFromWishList(body).then((res)=>{
            resolve({res, status: 200})
        }).catch((err)=>{
            reject(err)
        })
    });
}

module.exports = Clothes;
