import mediaModel from '../Model/mediaModel';

import setMediaQueriesAction from '../ActionCreator/setMediaQueriesAction';

export default function mediaReducer(state = mediaModel(), action) {
    switch (action.type) {
        case setMediaQueriesAction.ACTION: {
            return {
                ...mediaModel(),
            };
        }
        default:
            return state;
    }
}
