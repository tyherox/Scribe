/**
 * Created by JohnBae on 12/1/16.
 */

import React from 'react-dom';
import { remote } from 'electron';
import jetpack from 'fs-jetpack';
import decor from './helpers/decor.js';
import dev from './helpers/dev.js';

import {SpellCheckHandler, ContextMenuListener, ContextMenuBuilder} from 'electron-spellchecker';

window.spellCheckHandler = new SpellCheckHandler();
window.spellCheckHandler.attachToInput();

// Start off as US English, America #1 (lol)
window.spellCheckHandler.switchLanguage('en-US');

let contextMenuBuilder = new ContextMenuBuilder(window.spellCheckHandler);
let contextMenuListener = new ContextMenuListener((info) => {
    contextMenuBuilder.showPopupMenu(info);
});

//Path to user's data based on Electron's Method
var usrPath = remote.app.getPath('userData');

//Package search directory based on usrPath
var widgetDir = usrPath+'/widgets',
    layoutDir = usrPath+'/layouts',
    themeDir = usrPath+'/themes',
    pluginDir = usrPath+'/plugins',
    settingDir = usrPath+'/settings';

//Variables to reference found packages in relative Dir
var widgets = [],
    layouts = [],
    themes = [],
    plugins = [];

function searchWidgets(){
    //Check for existance
    if(!jetpack.dir(widgetDir)) return;

    //Search for built-in widgets
    /*jetpack.list(__dirname+"/widgets").forEach(function(file){
        var filePath = __dirname + "/widgets/" + file;
        if(jetpack.inspect(filePath).type!='file') widgets.push(loadScript(filePath,"widget"));
    });*/

    //Serach for downloaded widgets
    /*jetpack.list(widgetDir).forEach(function(file){
        var filePath = __dirname + "/widgets/" + file;
        console.log(filePath);
        if(jetpack.inspect(filePath).type!='file') widgets.push(loadScript(filePath,"widget"));
    });*/
}

function searchLayouts(){

    if(!jetpack.dir(layoutDir)) return;
    jetpack.list(layoutDir).forEach(function(file){
        var filePath = layoutDir + "/" + file;
        if(jetpack.inspect(filePath).type=='file') layouts.push(loadScript(filePath));
    });
}

function searchThemes(){
    if(!jetpack.dir(themeDir)) return;

    jetpack.list(__dirname+"/themes").forEach(function(file){
        var filePath = __dirname + "/themes/" + file;
        if(jetpack.inspect(filePath).type!='file') themes.push(loadScript(filePath,"theme"));
    });
    jetpack.list(themeDir).forEach(function(file){
        var filePath = __dirname + "/themes/" + file;
        if(jetpack.inspect(filePath).type!='file') themes.push(loadScript(filePath,"widget"));
    });
}

/*function searchPlugins(){
 jetpack.dir(pluginDir);
 jetpack.list(__dirname+"/widgets").forEach(function(file){
 plugins.push(loadScript(__dirname+"/widgets/" + file,"widget"));
 });
 jetpack.list(widgetDir).forEach(function(file){
 plugins.push(loadScript(widgetDir + file,"widget"));
 });
 }*/

//Function to enable found packages
function loadScript(path, type){
    var returnData ={};
    switch(type){
        case "widget":
            if(jetpack.find(path,{matching: '*main.js*', directories: false})) {
                //returnData.main = require(path+"/main.js");
            }
            if(jetpack.find(path,{matching: '*style.css*', directories: false})) {
                var css = document.createElement("link");
                css.setAttribute("rel", "stylesheet");
                css.setAttribute("type", "text/css");
                css.setAttribute("href", path +"/style.css");
                document.getElementsByTagName("head")[0].appendChild(css)
            }
            if(jetpack.find(path,{matching: '*package.json*', directories: false})) {
                returnData.json = require(path+"/package.json");
            }
            if(jetpack.find(path,{matching: '*icon.png*', directories: false})) {
                returnData.icon = path+"/icon.png";
            }
            break;
        case "theme":
            if(jetpack.find(path,{matching: '*theme.css*', directories: false})) {
                returnData.css = (path+"/theme.css");
            }
            if(jetpack.find(path,{matching: '*package.json*', directories: false})) {
                returnData.json = require(path+"/package.json");
            }
            if(jetpack.find(path,{matching: '*icon.png*', directories: false})) {
                returnData.icon = path+"/icon.png";
            }
            break;
        case "plugin":
            returnData = require(path);
            break;
    }
    return returnData;
}

searchWidgets();
searchLayouts();
searchThemes();
//searchPlugins();


//ReactDOM.render(dev(), document.getElementById('parent'));

dev();

decor.setTheme(themes[0]);
