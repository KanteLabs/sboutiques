const User = require('../models/User/User')

const UserController = {};

UserController.getUser = (req, res) => {
    User.getById(req.params.user_id)
    .then(user => {
        res.json(user)
    })
    .catch((error)=>{
        const status = 404;
        res.json({
            status: status,
            error: error.message
        })
    })
}

// UserController.getWishList = (req, res) => {
//     User.getWishList(req.params.user_id)
//     .then(wishlist => {
//         console.log(wishlist)
//         res.json(wishlist)
//     })
//     .catch((error)=>{
//         const status = 404;
//         res.json({
//             status: status,
//             error: error.message
//         })
//     })
// }

module.exports = UserController;