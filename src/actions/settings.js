/**
 * Created by JohnBae on 2/16/17.
 */

import * as types from '../constants/actionTypes';

export const modifyAtSetting = (setting) => {
    return {
        type: types.MODIFY_AT_SETTING,
        payload: setting
    }
};

export const setSetting = (setting) => {
    return {
        type: types.SET_SETTING,
        payload: setting
    }
};
