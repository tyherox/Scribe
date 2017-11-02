/**
 * Created by JohnBae on 8/10/16.
 */

import path from 'path';

var currentTheme = null,
    currentCache = null,
    themeElements = [];

var setTheme = function (theme) {
    document.getElementById('themeCss').href = theme.css;
    currentTheme = theme;
    currentCache = path.join(currentTheme.css, "../", "/assets/");

    themeElements.forEach(function (item) {
        var element = item.element,
            asset = currentCache + item.name,
            size = item.size,
            pos = item.position;

        element.style.backgroundImage = "url(" + asset + ")";
        element.style.backgroundRepeat = "no-repeat";
        element.style.backgroundSize = size;
        element.style.backgroundPosition = pos;
    });
};

var setIcon = function (element, name, options) {

    if (!options) options = {};
    var size = options.size || "80% 80%",
        pos = options.pos || 'center',
        asset = currentCache + name;

    if (currentCache) {
        element.style.backgroundImage = "url(" + asset + ")";
        element.style.backgroundRepeat = "no-repeat";
        element.style.backgroundSize = size;
        element.style.backgroundPosition = pos;
    }
};

export default {
    setTheme: setTheme,
    setIcon: setIcon
};
