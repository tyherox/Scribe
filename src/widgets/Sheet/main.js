/**
 * Tyherox
 *
 * TimeWidget
 *
 * The TimeWidget is a simple widget used to tell time. Expanding adds the functionality of showing seconds
 */

import React from 'react';
import Toolbar from './toolbar.jsx';
import Editor from './editor.jsx';
import fs from '../../helpers/fileSystem';

var storage = new fs('widgets/1-sheets');

export {storage};

export default {
    id:1,
    multi: true,
    minWidth: 2,
    minHeight: 2,
    maxWidth: 10,
    maxHeight: 10,
    toolbar: Toolbar,
    content: Editor
}
