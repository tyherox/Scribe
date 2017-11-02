/**
 * Tyherox
 *
 * dev
 *
 * Development Test Framework for test case setup.
 *
 */

import React, {Component} from 'react';
import Layout from '../containers/layout/layout.js';
import MenuBar from '../containers/menubar/main.js'
import ReactDOM from 'react-dom';
import Sheet from '../widgets/Sheet/main.js';
import Time from '../widgets/Time/main.js';
import {createStore} from 'redux';
import reducer from '../reducers/index';
import * as Actions from '../actions/index';
import {Provider} from 'react-redux';
import fs from './fileSystem'
import jetpack from 'fs-jetpack';
import idGen from '../helpers/idGenerator';

export default function(){
    var store = createStore(reducer);

    class App extends Component{

        constructor(props){
            super(props);

            this.state = {
                showMenu: false,
                savedWidgets: [
                    Sheet,
                    Time
                ]
            };

            this.addWidget = this.addWidget.bind(this);
            this.toggleMenu = this.toggleMenu.bind(this);
        }

        componentDidMount(){
            var app = this.refs.app,
                menu = this.refs.menu,
                self = this;

            var callMenu = null;
        }

        assignHome(widget){
            var currentLayout = store.getState().layout,
                widgets = this.state.savedWidgets,
                row = store.getState().settings.get("gridRows"),
                col = store.getState().settings.get("gridCols"),
                range = [];

            currentLayout.forEach(function(entry){
                var top = entry.get("refTop"),
                    left = entry.get("refLeft");
                for(var h = top; h< top + entry.get("refHeight"); h++){
                    for(var w = left; w< left + entry.get("refWidth"); w++){
                       var num = col * h + w;
                        range.push(num);
                    }
                }
            });

            var id = widget.id.toString();
            if(id.includes(".")) id = id.substring(0,id.indexOf("."));

            var template = widgets.find(function(entry){
                if(entry.id == id) return entry;
            });

            var width = template.minWidth,
                height = template.minHeight,
                top, left, grid = row * col;

            for(var i = 0; i<grid; i++){
                if(range.indexOf(i)==-1){
                    var coordinates = [];
                    for(var r = 0; r < height; r++){
                        var tempRow = null;
                        for(var c = 0; c < width; c++){
                            var num = i + c + r * col;
                            if(tempRow==null) tempRow = Math.floor(num/col);
                            if(range.indexOf(num)==-1 && num<=grid && tempRow == Math.floor(num/col)){
                                coordinates.push(num);
                            }
                        }
                    }
                    if(coordinates.length==width * height) {
                        var origin = coordinates[0];
                        top = Math.floor(origin/col);
                        left = origin - top * col;
                        break;
                    }
                }
            }

            if(top==undefined && left==undefined) return null;
            return {
                id: parseFloat(widget.id),
                refWidth: width,
                refHeight: height,
                refTop: top,
                refLeft: left,
                pinned: true,
                content: widget.content};
        }

        addWidget(widget){
            var layout = store.getState().layout;

            var id = JSON.stringify(widget.id);

            if(id.includes("*")) {
                id = idGen(parseInt(id.replace("*","").replace(/['"]+/g, '')), store.getState().layout.map(function (elem) {
                    return elem.get('id');
                }).toArray());
                console.log("ID:", id);
                widget["id"] = parseFloat(id);
            }

            widget = this.assignHome(widget);

            if(widget!=null){
                store.dispatch(Actions.modifyAtLayout(id.toString(), widget));
            }
        }

        toggleMenu(state){
            this.setState({showMenu: state});
        }

        render(){
            console.log("RENDERING APP");
            return(
                <Provider store={store}>
                    <div ref="app">
                        <MenuBar addWidget = {this.addWidget}
                                 ref = "menu"
                                 widgets = {this.state.savedWidgets}
                                 toggleMenu = {this.toggleMenu}
                                 visible = {this.state.showMenu}/>
                        <Layout setLayout = {this.setLayout}
                                widgets = {this.state.savedWidgets}
                        />
                    </div>
                </Provider>
            )
        }
    }


    ReactDOM.render(<App/>, document.getElementById('parent'));
};

