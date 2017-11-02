/**
 * Created by JohnBae on 2/16/17.
 */

import * as types from '../constants/actionTypes';

export const modifyAtStoredLayout = (name, layout) => {

    return {
        type: types.ADD_STORED_LAYOUTS,
        payload: {
            name: name,
            layout: layout
        }
    }
};

export const addStoredLayout = (name, layout) => {

    return {
        type: types.ADD_STORED_LAYOUTS,
        payload: {
            name: name,
            layout: layout
        }
    }
};

export const renameStoredLayout = (prevName, newName) => {
    return {
        type: types.RENAME_AT_STORED_LAYOUTS,
        payload: {
            prevName: prevName,
            newName: newName
        }
    }
};

export const deleteStoredLayout = (name) => {
    return {
        type: types.DELETE_AT_STORED_LAYOUTS,
        payload: name
    }
};
