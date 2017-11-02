/**
 * Created by JohnBae on 2/16/17.
 */

import * as types from '../constants/actionTypes';

export const modifyAtLayout = (id, layout) =>{
    return {
        type: types.MODIFY_AT_LAYOUT,
        payload: {
            id: id,
            layout: layout
        }
    }
};

export const setLayout = (layout) =>{
    return {
        type: types.SET_LAYOUT,
        payload: layout
    }
};


export const deleteAtLayout = (key) =>{
    return {
        type: types.DELETE_AT_LAYOUT,
        payload: key
    }
};
