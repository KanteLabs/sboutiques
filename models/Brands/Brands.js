const db = require('../../db/firebase');

const brandsHelper = require('./Helpers/BrandsHelper');
const clothesHelper = require('../Clothes/Helpers/ClothesHelper');

const Brands = {};
const brandRef = db.collection('brands');

Brands.getAll = () => {
    return new Promise((resolve, reject) => {
        async function getAllBrands() {
            try {
                const brands = brandsHelper.getAll(brandRef.where('approved', '==', true).orderBy('name'));

                return brands ? resolve(brands) : reject(new Error("Failed getting brands"))
            } catch (error) {
                reject(new Error("Failed getting brands"))
            }
        }

        getAllBrands()
        .then((res) => {
            resolve(res)
        })
        .catch((err) => {
            console.log(err)
            reject(err)
        })
    });
}

Brands.getBrandById = (brand_id) => {
    return new Promise((resolve, reject) => {
        async function grabBrand(brand_id) {

            try {
                const brand = await brandsHelper.getBrand(brandRef, brand_id);
                const brandProducts = await clothesHelper.getBrandProducts(brandRef, brand.brandUid);

                return brand && brandProducts ? resolve({brandProducts, brand}) : brand ? resolve(brand) : reject(new Error("Failed getting brand"))
            } catch (error) {
                reject(error)
            }
        }

        grabBrand(brand_id).then((res)=>{
            resolve(res)
        }).catch((err)=>{
            console.log(err)
            reject(err)
        })
    })
};

Brands.createBrand = (body) => {
    return new Promise((resolve, reject) => {
        async function registerBrand(body) {
            let userdbRef = db.collection('users');
            try {
                const setBrandData = await brandsHelper.registerBrand(brandRef, body);
                const addBrandDataToUserAccount = await brandsHelper.addBrandToUserAccount(userdbRef, body);

                addBrandDataToUserAccount && setBrandData ? resolve(setBrandData) :  new Error("Failed to register brand")
            } catch (error) {
                reject(new Error("Failed to register brand"))
            }
        }

        registerBrand(body)
        .then((res)=>{
            resolve(res)
        }).catch((err)=>{
            console.log(err)
            reject(err)
        })
    });
}

module.exports = Brands;