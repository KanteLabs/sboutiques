import axios from 'axios';

const baseURL = `/api/wishlist`;
export default class WishList {
    static add(data) {
        return axios.post(`${baseURL}/add`, data).then(data => {
            return data;
        });
    }

    static remove(data) {
        return axios.post(`${baseURL}/remove`, data).then(data => {
            return data;
        });
    }
}
