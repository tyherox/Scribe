/**
 * Created by JohnBae on 2/13/17.
 */

import * as types from '../constants/actionTypes';
import {Map, fromJS} from 'immutable';
import fs from '../helpers/fileSystem';

var storage = new fs("general");

const DEFAULT_LAYOUT = fromJS(scanLayout())

function scanLayout(){
    var prevState = storage.read("prevState.json");
    if(prevState == undefined) return({
        "1": {
            id: 1,
            pinned: true,
            refWidth: 4,
            refHeight:5,
            refTop: 0,
            refLeft: 2,
            content: {

            }
        }
    })
    else return JSON.parse(storage.read("prevState.json"));
}

function layout(state = DEFAULT_LAYOUT, action) {
    switch (action.type) {

        case types.MODIFY_AT_LAYOUT:
            var newState = state.mergeDeepIn([action.payload.id.toString()], action.payload.layout);
            console.log(action.payload.id.toString(), action.payload.layout);
            storage.save("prevState.json", newState);
            return newState;

        case types.SET_LAYOUT:
            var newState = fromJS(action.payload);
            storage.save("prevState.json", newState);
            return fromJS(newState);

        case types.DELETE_AT_LAYOUT:
            var newState = state.delete(action.payload);
            storage.save("prevState.json", newState);
            return newState;

        default:
            return state
    }
}

export default layout;
