/**
 * Tyherox
 *
 * Widget
 *
 * The widget class is the template for all widgets of Scribe. It includes the container to place custom content and
 * means to be arranged upon the Layout module.
 */

import React from 'react';
import Interact from 'interact.js';
import Button from '../../components/button'
import * as Actions from '../../actions/index';
import {connectAdvanced} from "react-redux";
import {bindActionCreators} from 'redux';
import shallowEqual from 'shallowequal';

class Widget extends React.PureComponent{

    constructor(props){
        super(props);

        var sw = this.props.reduxSettings.get("screenWidth"),
            sh = this.props.reduxSettings.get("screenHeight"),
            gc = this.props.reduxSettings.get("gridCols"),
            gr = this.props.reduxSettings.get("gridRows");

        this.state = {
            mounted: true,
            tmpWidth: 0,
            tmpHeight: 0,
            tmpTop: 0,
            tmpLeft: 0,
            gridWidth: (sw) / gc,
            gridHeight: sh / gr,
        }
    }

    componentDidMount(){

        var self = this,
            widget = self.refs.widgetRef;

        widget.addEventListener("mousemove", function(e){
            var x = e.pageX,
                y = e.pageY,
                ew = false,
                ns = false;

            if(x > widget.getBoundingClientRect().right - 10){
                ew = true;
            }
            if(y > widget.getBoundingClientRect().bottom - 10){
                ns = true;
            }

            if(ew && ns) {
                console.log("AOKOKFOES");
                widget.style.cursor = "nwse-resize";
            }
            else if(ew)  widget.style.cursor = "ew-resize";
            else if(ns) widget.style.cursor = "ns-resize";
        });

        //Initialize Drag Module for Widget
        Interact(widget)
            .on('dragstart resizestart', function(event){
                startDrag();
            })
            .on('dragend resizeend', function(event){
                self.props.reduxActions.modifyAtSession({gridVisible: false});
                console.groupEnd();
                endDrag();
            })
            .draggable({
                restrict: {
                    restriction: document.getElementById("layout"),
                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
                    endOnly: true
                }
            })
            .on('dragmove', function(event){

                self.setState({
                    tmpLeft: (self.state.tmpLeft + event.dx),
                    tmpTop: (self.state.tmpTop + event.dy)
                });
            })
            .resizable({
                invert: 'none',
                square: false,
                preserveAspectRatio: false,
                edges: { left: false, right: true, bottom: true, top: false },
                restrict: {
                    restriction: document.getElementById("layout"),
                    endOnly: true
                }
            })
            .on('resizemove', function(event){
                var width = event.rect.width,
                    height = event.rect.height,
                    offset = self.props.reduxSettings.get("cellOffset") * 2;

                if(width<=self.props.minWidth * self.state.gridWidth - offset) {
                    width = self.state.gridWidth * self.props.minWidth - offset;
                }
                else if(width>self.props.maxWidth * self.state.gridWidth - offset) {
                    width = self.props.maxWidth * self.state.gridWidth - offset;
                }

                if(height<=self.props.minHeight * self.state.gridHeight - offset){
                    height = self.state.gridHeight * self.props.minHeight - offset;
                }
                else if(height>self.props.maxHeight * self.state.gridHeight - offset){
                    height = self.props.maxHeight * self.state.gridHeight - offset;
                }
                self.setState({
                    tmpWidth: width,
                    tmpHeight: height,
                });

            })
            .actionChecker(function (pointer, event, action) {
                if(action.name=='drag'){
                    //Invalidate actions for widget content drag (users can only drag by using the toolbar)
                    if((event.target.className.includes("widgetToolbar") || event.target.className.includes("sheet-title"))){
                        action.name = 'drag';
                    }
                    else{
                        return null;
                    }
                }
                return action;
            })
            .origin('parent');

        //Initialize widget props for LibraryProjects
        this.setSize();
        this.setMinSize();
        this.setMaxSize();
        this.setLocation();
        this.setTransition();
        this.setIndex();
        this.setOpacity();

        if(this.props.reduxLayout.get("pinned")){
            this.refs.pinButton.style.opacity = "1";
        }
        else this.refs.pinButton.style.opacity = ".3";

        //Prep LibraryProjects/Widget for drag
        var startDrag = function(){
            self.setState({
                dragging: true,
                index: 10,
                transition: 'transform 0s, width .0s, height .0s, z-index .0s .0s'
            });
            self.props.reduxActions.modifyAtSession({gridVisible: true});
        };

        //Clean up temp variables for drag
        var endDrag = function(){

            var top = self.state.tmpTop,
                left = self.state.tmpLeft,
                width = self.state.tmpWidth,
                height= self.state.tmpHeight;

            var home = {
                top: self.props.reduxLayout.get("refTop") + Math.round(top/self.state.gridHeight),
                left: self.props.reduxLayout.get("refLeft") + Math.round(left/self.state.gridWidth),
                width: width==0 ?self.props.reduxLayout.get("refWidth") : Math.round(width/self.state.gridWidth),
                height: height==0 ?self.props.reduxLayout.get("refHeight") : Math.round(height/self.state.gridHeight),
            };

            if(self.props.validateHome(self.props.id, home)){
                self.props.reduxActions.modifyAtLayout(self.props.id,{
                    refTop: home.top,
                    refLeft: home.left,
                    refWidth: home.width,
                    refHeight: home.height,
                });
                self.setState({
                    index: 1,
                    tmpLeft: 0,
                    tmpTop: 0,
                    tmpWidth: 0,
                    tmpHeight: 0,
                    transition: 'transform .5s, width .5s, height .5s, z-index .5s .5s,  opacity .5s',
                    dragging: false,
                });
            }
            else self.setState({
                index: 1,
                tmpLeft: 0,
                tmpTop: 0,
                tmpWidth: 0,
                tmpHeight: 0,
                transition: 'transform .5s, width .5s, height .5s, z-index .5s .5s,  opacity .5s',
                dragging: false,
            });
        };
    }

    componentDidUpdate(props, state){
        if(this.state.transition!=state.transition){
            this.setTransition();
        }
        if(this.state.tmpWidth != state.tmpWidth || this.state.tmpHeight != state.tmpHeight||
            this.props.reduxLayout.get("refWidth") != props.reduxLayout.get("refWidth") || this.props.reduxLayout.get("refHeight") != props.reduxLayout.get("refHeight")){
            this.setSize();
        }
        if(this.props.minWidth!=props.minWidth || this.props.minHeight!=props.minHeight){
            this.setMinSize();
        }
        if(this.props.maxWidth!=props.maxWidth || this.props.maxHeight!=props.maxHeight){
            this.setMaxSize();
        }
        if(this.state.tmpLeft != state.tmpLeft|| this.state.tmpTop != state.tmpTop||
            this.props.reduxLayout.get("refLeft") != props.reduxLayout.get("refLeft")|| this.props.reduxLayout.get("refTop") != props.reduxLayout.get("refTop")){
            this.setLocation();
        }
        if(this.state.index!=state.index){
            this.setIndex();
        }
        if(this.props.reduxSettings.get("widgetOpacity")!=props.reduxSettings.get("widgetOpacity") ||
            this.props.reduxPinMode != props.reduxPinMode ||
            this.props.reduxPinMode && (this.props.reduxLayout.get("pinned") != props.reduxLayout.get("pinned"))){
            this.setOpacity();
        }
    }

    setSize(){
        var widget = this.refs.widgetRef,
            width = this.props.reduxLayout.get("refWidth") * this.state.gridWidth - this.props.reduxSettings.get("cellOffset") * 2,
            height = this.props.reduxLayout.get("refHeight") * this.state.gridHeight - this.props.reduxSettings.get("cellOffset") * 2;

        console.log("height testing...:", height);

        if(this.state.tmpWidth != 0 || this.state.tmpHeight != 0){
            width = this.state.tmpWidth;
            height = this.state.tmpHeight;
        }

        widget.style.width = width + "px";
        widget.style.height = height + "px";
    }

    setMinSize(){

        var widget = this.refs.widgetRef;
        widget.style.minWidth = this.props.minWidth * this.state.gridWidth - this.props.reduxSettings.get("cellOffset") * 2 + "px";
        widget.style.minHeight = this.props.minHeight * this.state.gridHeight - this.props.reduxSettings.get("cellOffset") * 2 + "px";
    }

    setMaxSize(){
        var widget = this.refs.widgetRef;
        widget.style.maxWidth = this.props.maxWidth * this.state.gridWidth - this.props.reduxSettings.get("cellOffset") * 2 + "px";
        widget.style.maxHeight = this.props.maxHeight * this.state.gridHeight - this.props.reduxSettings.get("cellOffset") * 2 + "px";
    }

    setLocation(){

        var widget = this.refs.widgetRef,
            x = this.props.reduxLayout.get("refLeft") * this.state.gridWidth + this.props.reduxSettings.get("cellOffset"),
            y = this.props.reduxLayout.get("refTop") * this.state.gridHeight + this.props.reduxSettings.get("cellOffset");

        if(this.state.tmpTop!=0 || this.state.tmpLeft!=0){
            x += this.state.tmpLeft;
            y += this.state.tmpTop;
        }

        widget.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    }

    setTransition(){
        var widget = this.refs.widgetRef;
        widget.style.transition = this.state.transition || 'transform .5s, width .5s, height .5s, z-index .5s .5s, opacity .5s';
    }

    setIndex(){
        var widget = this.refs.widgetRef;
        widget.style.zIndex = this.state.index;
    }

    setOpacity(){
        var widget = this.refs.widgetRef,
            opacity = this.props.reduxSettings.get("widgetOpacity");
        if(this.props.reduxPinMode && !this.props.reduxLayout.get("pinned")) {
            opacity = 0;
        }
        widget.style.opacity = opacity * .01;
    }

    remove(){
        var self = this;
        this.setState({mounted: false}, function(){
            self.props.reduxActions.deleteAtLayout(this.props.id);
        });
    }

    setPin(){
        this.props.reduxActions.modifyAtLayout(this.props.id, {pinned: !this.props.reduxLayout.get("pinned")});
        if(this.props.reduxLayout.get("pinned")){
            this.refs.pinButton.style.opacity = ".3";
        }
        else this.refs.pinButton.style.opacity = "1";
    }

    render(){
        console.log("rendering widget:", this.props.id);
        var Content = this.props.content,
            CustomToolbarElem = this.props.toolbar,
            toolbarClass = "widgetToolbar themeSecondaryColor";

        if(CustomToolbarElem==null) CustomToolbarElem = EmptyToolbar;

        return(
            <div className = 'widget widgetBackground'
                 ref = 'widgetRef'>
                <div className = "widgetToolbar"
                     ref="widgetToolbarRef">
                    <CustomToolbarElem id = {this.props.id}/>
                    <Button className="widgetToolbarButtons"
                            size = "small"
                            icon = "remove.png"
                            onClick = {this.remove.bind(this)}/>
                    <span ref="pinButton">
                        <Button className="widgetToolbarButtons"
                                size = "small"
                                icon = "pin.png"
                                onClick = {this.setPin.bind(this)}/>
                    </span>
                    {/*<button className="widgetToolbarButtons">M</button>*/}
                </div>
                <div className = "widgetContainer" ref="widgetContainerRef">
                    <Content id = {this.props.id}/>
                </div>
            </div>
        )
    }
}

class EmptyToolbar extends React.Component {
    render(){
        return(
            <div>
            </div>
        )
    }
}

function selectorFactory(dispatch) {
    let result = {};
    const actions = bindActionCreators(Actions, dispatch);
    return (nextState, nextOwnProps) => {
        var layout =  nextState.layout.get(nextOwnProps.id) ? nextState.layout.get(nextOwnProps.id).delete("content") : null
        const nextResult = {
            layout: nextState.layout,
            reduxLayout: layout,
            reduxPinMode: nextState.session.get("pinMode"),
            reduxSettings: nextState.settings,
            reduxActions: actions,
            ...nextOwnProps
        };
        if(nextResult.reduxLayout==undefined) return result;
        if (!nextResult.reduxSettings.equals(result.reduxSettings) ||
            !nextResult.reduxLayout.equals(result.reduxLayout) ||
            !nextResult.reduxPinMode == result.reduxPinMode){
            result = nextResult;
        }
        return result
    }
}

export default connectAdvanced(selectorFactory)(Widget);
