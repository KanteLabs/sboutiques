const BrandsHelper = {};

BrandsHelper.getAll = (databaseRef) => {
    return new Promise((resolve, reject) => {
        let brands = []
        databaseRef.get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                return brands.push(
                    doc.data()
                )
            })
            return brands ? resolve(brands) : reject(new Error("No brands found"))
        })
        .catch((err) => {
            return reject(err)
        })
    });
}

BrandsHelper.getBrand = (databaseRef, brand_id) => {
    return new Promise((resolve, reject) => {
        databaseRef.where('id', '==', Number(brand_id)).get().then((snapshot)=>{
            if(snapshot.empty) {
                reject(new Error("No brands found"))
            }
            snapshot.forEach((res)=>{
                return res.exists ? resolve({
                    brandData: res.data(),
                    brandUid: res.id
                }) : reject(new Error("No brands found"))
            })
        }).catch((err)=>{
            return reject(err)
        })
    })
};

BrandsHelper.registerBrand = (databaseRef, data) => {
    return new Promise((resolve, reject) => {
        databaseRef.doc(data.uid).set(data.formData, {merge: true})
        .then((res) => {
            resolve(res);
        })
        .catch((err)=>{
            reject(err);
        })
    });
}

BrandsHelper.addBrandToUserAccount = (databaseRef, data) => {
    return new Promise((resolve, reject) => {
        databaseRef.doc(data.uid).collection('brand').doc(data.formData.name).set(data.formData, {merge: true})
        .then((res) => {
            resolve(res);
        })
        .catch((err)=>{
            reject(err);
        })
    });
}

module.exports = BrandsHelper;