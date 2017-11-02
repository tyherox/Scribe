/**
 * Created by JohnBae on 1/29/17.
 */

import React from "react";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Button from "../../components/button";
import Settings from './settings/settings'
import Display from './display/display'
import Files from './library/library'
import * as Actions from '../../actions/index';
import {connectAdvanced} from "react-redux";
import {bindActionCreators} from 'redux';
import shallowEqual from 'shallowequal';

class MenuBar extends React.Component{

    constructor(props){
        super(props);
        this.state = {subMenu: null, visible: false}
    }

    componentDidMount(){
        this.refs.hideButton.style.opacity = ".3"
    }

    exit(){
        window.close();
    }

    addSheet(){
        this.props.addWidget({
                id: '1*',
                pinned: true,
                content: {}
        });
    }

    closeSubMenu(){
        this.toggleSub();
    }

    toggleSub(pane){
        if(pane==null || this.state.subMenu==pane){
            this.refs.menu.style.width = "40px";
            this.setState({subMenu:null})
        }
        else if(this.state.subMenu==null || this.state.subMenu!=pane){
            this.refs.menu.style.width = "280px";
            this.setState({subMenu:pane})
        }

    }

    setPinnedMode(){
        this.props.reduxActions.modifyAtSession({pinMode: !this.props.reduxPinMode});
        if(this.props.reduxPinMode){
            this.refs.hideButton.style.opacity = ".3"
        }
        else this.refs.hideButton.style.opacity = "1"
    }

    render(){

        var subMenu = this.state.subMenu,
            openedMenu = this.state.visible,
            currentProject = this.props.rCurrentProject != "" ? this.props.rCurrentProject : "none";

        if(openedMenu){
            subMenu =
                <div id ="menuBar-subMenu" ref="subMenu">
                    { <Files addWidget = {this.props.addWidget}/>}
                </div>
        }

        return(
            <div>
                <div id = "menuBar">
                    <div style={{visibility: this.state.visible ? "visible" : "hidden"}}
                         onClick={()=>this.setState({visible: false})}
                         id="overlay"/>
                    <button className={this.state.visible ? "hamburger hamburger--spring is-active" : "hamburger hamburger--spring"}
                            type="button"
                            onClick={()=>this.setState({visible: !this.state.visible})}>
                        <span className="hamburger-box">
                            <span className="hamburger-inner"/>
                        </span>
                    </button>
                    <button id="menuBar-currentProject" ><span style={{color: "gray"}}>Current Project: </span>{currentProject}</button>
                    <button className="menuBar-actionButtons" onClick={this.addSheet.bind(this)}>+</button>
                    <span ref="hideButton">
                        <button className="menuBar-actionButtons"
                                onClick = {this.setPinnedMode.bind(this)}>
                            <img style={{
                                filter: "brightness(10%)",
                                height: "50%",
                                marginBottom: "5px",
                                marginLeft: "10px",
                                verticalAlign: "middle"
                            }}src="assets/hideToggle.png"/>
                        </button>
                    </span>
                </div>
                <ReactCSSTransitionGroup
                    transitionName="subMenu"
                    transitionAppear={true}
                    transitionAppearTimeout={500}
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}>
                    {subMenu}
                </ReactCSSTransitionGroup>
            </div>

        )
    }
}

function selectorFactory(dispatch) {
    let result = {};
    const actions = bindActionCreators(Actions, dispatch);
    return (nextState, nextOwnProps) => {
        const nextResult = {
            reduxPinMode: nextState.session.get("pinMode"),
            reduxMenuBar: nextState.session.get("menuBar"),
            rCurrentProject: nextState.settings.get("project"),
            reduxActions: actions,
            ...nextOwnProps
        };
        if (!shallowEqual(result,nextResult)){
            result = nextResult;
        }
        return result
    }
}

export default connectAdvanced(selectorFactory)(MenuBar);
