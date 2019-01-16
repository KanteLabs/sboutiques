import WishList from '../DAO/WishListApi';

export const ADD_TO_WISHLIST = data => {
    return {
        type: 'ADD_TO_WISHLIST',
        action: WishList.add(data),
    };
};

export const REMOVE_FROM_WISHLIST = data => {
    return {
        type: 'REMOVE_FROM_WISHLIST',
        action: WishList.remove(data),
    };
};
