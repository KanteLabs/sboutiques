import User from '../../DAO/userApi';

export const GET_USER_ACTION = () => {
    return (dispatch, getState) => {
        dispatch({type: 'GET_USER_ACTION_STARTED'});

        User.get().then(
            data => dispatch({type: 'GET_USER_ACTION_SUCCEEDED', data}),
            error => dispatch({type: 'GET_USER_ACTION_FAILED', error: error})
        );
    };
};
