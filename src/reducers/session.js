/**
 * Created by JohnBae on 2/13/17.
 */

import * as types from '../constants/actionTypes';
import {Map, fromJS} from 'immutable';

const DEFAULT_SESSION = fromJS({
    gridVisible: false,
    menuBar: false,
    pinMode: false,
});



function sessionReducer(state = DEFAULT_SESSION, action) {
    switch (action.type) {
        case types.MODIFY_AT_SESSION:
            return state.merge(action.payload);
        case types.SET_SESSION:
            return Map(action.payload);
        case types.DELETE_AT_SESSION:
            return state.delete(action.payload);
        default:
            return state;
    }
}
export default sessionReducer;
