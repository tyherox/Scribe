/**
 * Created by JohnBae on 2/16/17.
 */

import * as types from '../constants/actionTypes';

export const addStoredWidget = (widget) => {
    return {
        type: types.ADD_STORED_WIDGETS,
        payload: widget
    }
};

export const deleteStoredWidget = (layout) => {
    return {
        type: types.DELETE_AT_LAYOUT,
        payload: layout
    }
};
