/**
 * Created by JohnBae on 2/13/17.
 */

import * as types from '../constants/actionTypes';
import {Map, fromJS} from 'immutable';
import fs from '../helpers/fileSystem';

var storage = new fs("widgets");

const DEFAULT_STORED_WIDGETS = fromJS(scanLayouts());

function scanLayouts(){
    var defaultStore = {};
    if(storage.list()!=undefined) {
        storage.list().forEach(function(elem){
            defaultStore[elem.replace(".json","")] = storage.cwd(storage.path(elem));
        });
    }
    defaultStore["Sheet"] = process.cwd() + "/src/widgets/Sheet/main.js";
    defaultStore["Time"] = process.cwd() + "/src/widgets/Time/main.js";
    return defaultStore;
}

function storedWidgets(state = DEFAULT_STORED_WIDGETS, action) {
    switch (action.type) {

        case types.ADD_STORED_WIDGETS:
            var path = action.payload.name + ".json";
            storage.save(path, action.payload.layout);
            var newState = state.set(action.payload.name, path);
            return newState;

        case types.DELETE_STORED_WIDGETS:
            storage.remove(action.payload + ".json");
            return state.delete(action.payload);

        default:
            return state;
    }
}

export default storedWidgets;
