/**
 * Created by JohnBae on 2/13/17.
 */

import * as types from '../constants/actionTypes';
import {Map, fromJS} from 'immutable';
import fs from '../helpers/fileSystem';

var storage = new fs("layouts");

const DEFAULT_STORED_LAYOUTS = fromJS(scanLayouts());

function scanLayouts(){
    var defaultStore = {};
    if(storage.list()!=undefined) storage.list().forEach(function(elem){
        defaultStore[elem.replace(".json","")] = storage.cwd(storage.path(elem));
    });
    return defaultStore;
}

function storedLayouts(state = DEFAULT_STORED_LAYOUTS, action) {

    switch (action.type) {

        case types.MODIFY_AT_STORED_LAYOUTS:
            var path = action.payload.name + ".json";
            storage.save(path, action.payload.layout);
            var newState = state.setIn(action.payload.name.toString(), path);
            return newState;

        case types.ADD_STORED_LAYOUTS:
            var path = action.payload.name + ".json";
            storage.save(path, action.payload.layout);
            var newState = state.set(action.payload.name.toString(), path);
            return newState;

        case types.DELETE_AT_STORED_LAYOUTS:
            storage.remove(action.payload + ".json");
            return state.delete(action.payload);

        case types.RENAME_AT_STORED_LAYOUTS:
            storage.rename(action.payload.prevName + ".json", action.payload.newName + ".json");
            if(state.has(action.payload.prevName)){
                return state.delete(action.payload.prevName).set(action.payload.newName, state.get(action.payload.prevName));
            }
        default:
            return state;
    }
}

export default storedLayouts;
