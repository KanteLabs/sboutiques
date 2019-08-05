const clothesHelper = {};
const { cloudinary, client, redis } = require('../../../db/config');

clothesHelper.getClothing = (databaseRef, limit) => {
    return new Promise((resolve, reject) => {
        const products = [];

        databaseRef.get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                return products.push(
                    doc.data()
                )
            })
            return products ? resolve(products) : reject(new Error("No products found"))
        }).catch((err)=>{
            return err;
        })
    })
};

clothesHelper.getByCategory = (databaseRef, limit) => {
    return new Promise((resolve, reject) => {
        const products = [];

        databaseRef.get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                return products.push(
                    doc.data()
                )
            })
            return products ? resolve(products) : reject(new Error("No products found"))
        }).catch((err)=>{
            return err;
        })
    })
};

clothesHelper.getRecent = (databaseRef, limit) => {
    return new Promise((resolve, reject) => {
        let products = []
        databaseRef.where("deleted", "==", false).orderBy("id",'desc').limit(limit).get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                return products.push(
                    doc.data()
                )
            })

            return products ? storeRecentUploads(products) : reject(new Error("No products found"))
        }).catch((err)=>{
            return err;
        })

        function storeRecentUploads(products) {
            client.setex('recent_uploads', 3600, JSON.stringify(products), redis.print);
            client.get(`recent_uploads`, function (error, result) {
                if (error) {
                    console.log(error);
                    reject(error)
                }
                console.log('GET result ->' + result.length);
                resolve(JSON.parse(result))
            });
        }
    })
};

clothesHelper.getBrandProducts = (databaseRef, brandUid) => {
    return new Promise((resolve, reject) => {
        let products = []
        databaseRef.doc(brandUid).collection('products').orderBy('title').get().then((snapshot)=>{
            if(snapshot.empty) {
                resolve(204)
            }
            snapshot.forEach((res)=>{
                return products.push(
                    res.data()
                )
            })
            return products ? resolve(products) : reject(new Error("No products found"));
        }).catch((err)=>{
            return err;
        })
    })
}

clothesHelper.uploadImages = (body, images) => {
    return new Promise((resolve, reject) => {
        let imageResponseArray = [];
        images.map((image, i) => {
            cloudinary.v2.uploader.upload_stream(
                { 
                    resource_type: 'image', 
                    folder: `products/${body.user_id}/${body.title}`,
                    public_id: image.fieldname.match('main_image') ? image.fieldname : image.originalname.split('.')[0],
                    tags: [body.category, body.sub_category],
                    format: 'jpg',
                }, 
                function(err, res){
                    imageResponseArray.push(res);
                    if(imageResponseArray.length === images.length) {
                        return resolve(imageResponseArray)
                    } else {
                        null
                    }

                    if(err) {
                        return reject (err)
                    }
                }
            ).end(image.buffer);
        })
    })
}

clothesHelper.addProductData = (body, imageData) => {
    let firebasePayload = {
        additonal_images: getAdditionalImages(imageData),
        amount_sold: 0,
        category: body.category,
        clothing_label: JSON.parse(body.clothing_label),
        created_date: body.created_date,
        description: body.description,
        designer: body.designer,
        id: JSON.parse(body.id),
        inventory: JSON.parse(body.inventory),
        inventory_total: 1,
        main_image:  getMainImage(imageData),
        price: body.price,
        shipping_cost: body.shipping_cost,
        sold_out: JSON.parse(body.sold_out),
        sub_category: body.sub_category,
        title: body.title,
        url: body.url,
        user_id: body.user_id,
    }

    function getMainImage(imageData) {
        let foundImage = imageData.find((image, i) => {
            return image.public_id.match('main_image');
        })
        return foundImage.secure_url;
    }

    function getAdditionalImages(imageData) {
        let additionalImages = {};
        imageData.map((image, i) => {
            if(!image.public_id.match('main_image')) {
                return additionalImages[image.signature.slice(0, 10)] = image.secure_url
            }
        })
        return additionalImages;
    }

    return new Promise((resolve, reject) => {
        return firebasePayload.url ? resolve(firebasePayload) : reject(new Error("failed to build firebase payload"))
    });
}

clothesHelper.sendDataToFirebase = (data, databaseRef, productRef) => {
    let d = new Date();

    return new Promise((resolve, reject) => {
        databaseRef.set(data, {merge: true}).then((res)=>{
            productRef.doc(`${d.getTime()}`).set({...data, deleted: false})
            .then((res)=>{
                return res ? resolve(res) : reject(new Error("Failed to upload to firebase"))
            })
            .catch((err)=>{
                console.log(err)
                return reject(err);
            })
        })
        .catch((err)=>{
            console.log(err)
            return reject(err);
        })
    });
}

clothesHelper.addToWishList = (databaseRef, product) => {
    return new Promise((resolve, reject) => { 
        databaseRef.set(product)
        .then((res)=>{
            return res ? resolve(res) : reject(new Error("Failed to upload to firebase"))
        })
        .catch((err)=>{
            return reject(err);
        })
    });
}
module.exports = clothesHelper;
