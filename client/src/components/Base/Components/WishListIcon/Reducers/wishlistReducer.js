import {ADD_TO_WISHLIST} from '../Actions/WishlistAction';

const initialState = {
    data: null,
    error: null,
};

export default function wishlistReducer(state = initialState, action) {
    switch (action.type) {
        case 'ADD_TO_WISHLIST':
            return {
                ...state,
                data: action.data,
            };
        default:
            return state;
    }
}
