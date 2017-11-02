/**
 * Created by JohnBae on 2/13/17.
 */

import {combineReducers} from 'redux'
import layout from './layout';
import session from './session';
import settings from './settings';
import storedLayouts from './storedLayouts';
import storedWidgets from "./storedWidgets";


const reducers = combineReducers({
    session,
    layout,
    settings,
    storedLayouts,
    storedWidgets
});

export default reducers;
