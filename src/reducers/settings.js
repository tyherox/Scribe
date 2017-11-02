/**
 * Created by JohnBae on 2/13/17.
 */

import * as types from '../constants/actionTypes';
import {Map, fromJS} from 'immutable';
import fs from '../helpers/fileSystem';

var storage = new fs("general");

const DEFAULT_SETTINGS = fromJS(scanSettings());

function scanSettings() {
    var prevState = storage.read("settings.json");
    if(prevState == undefined) return({
        screenWidth: screen.width,
        screenHeight: screen.height - 35,
        gridCols: 8,
        gridRows: 5,
        cellOffset: 4,
        toolbarToggle: true,
        findButton: true,
        sentenceFocusButton: true,
        widgetOpacity: 100,
        librarySortValue: 'Recently Opened',
        libraryCategory: 'files',
        project: "",
    })
    else return JSON.parse(storage.read("settings.json"));
}

function settings(state = DEFAULT_SETTINGS, action) {

    switch (action.type) {
        case types.MODIFY_AT_SETTING:
            var newState = state.merge(action.payload);
            storage.save("settings.json", newState);
            return newState;

        case types.SET_SETTING:
            var newState = Map(action.payload);
            storage.save("settings.json", newState);
            return newState;

        default:
            return state;
    }
}

export default settings;
