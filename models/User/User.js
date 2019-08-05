const db = require('../../db/firebase');

const User = {};
const userRef = db.collection('users');

User.getById = (uid) => {
    return new Promise((resolve, reject) => {
        async function getUser(uid) {
            try {
                await userRef.doc(uid).get().then((res) => {
                    if(!res.exists) {
                        return new Error("No user was found with that ID") 
                    }
                    const userData = res.data();
                    return userData ? resolve(userData) : reject();
                })
            } catch (error) {
                reject(error)
            }
        }

        getUser(uid).then((res)=>{
            resolve(res)
        }).catch((err)=>{
            console.log(err)
            reject(err)
        })
    })
};

module.exports = User;