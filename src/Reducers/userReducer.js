const initialState = {
    loading: true,
    data: null,
    error: false,
};

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_USER_ACTION_STARTED':
            return {
                ...state,
                loading: true,
                data: null,
            };
        case 'GET_USER_ACTION_SUCCEEDED':
            return {
                ...state,
                loading: false,
                data: action.data,
            };
        case 'GET_USER_ACTION_FAILED':
            return {
                ...state,
                loading: false,
                error: action.error,
            };
        default:
            return state;
    }
}
