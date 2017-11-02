/**
 * Created by JohnBae on 1/29/17.
 */

import React from "react";
import Button from "../../../components/button";
import Input from "../../../components/input";
import * as Actions from '../../../actions/index';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';

class SettingPane extends React.Component{

    constructor(props) {
        super(props);
    }

    toggleToolbar(state){
        this.props.reduxActions.modifyAtSetting({toolbarToggle: !state})
    }

    toggleFindButton(state){
        this.props.reduxActions.modifyAtSetting({findButton: !state})
    }

    toggleFocusButton(state){
        this.props.reduxActions.modifyAtSetting({sentenceFocusButton: !state})
    }

    setWidgetOpacity(state){
        console.log("SETTING:", state);
        this.props.reduxActions.modifyAtSetting({widgetOpacity: state});
    }

    reset(){
        this.props.reduxActions.modifyAtSetting({toolbarToggle: true, findButton: true, sentenceFocusButton: true, widgetOpacity: 100});
    }

    render(){

        return(
            <div id = "subMenu">
                <h1 className = "subMenu-title">Settings</h1>
                {/*<div className="settings-attrGroup">
                    <Input text="Show Sheet toolbars"
                           type="checkbox"
                           checked={this.props.reduxState.get("toolbarToggle")}
                           changeValue={this.toggleToolbar.bind(this)} />
                    <Input text="Show find button"
                           type="checkbox"
                           checked={this.props.reduxState.get("findButton")}
                           changeValue={this.toggleFindButton.bind(this)}/>
                    <Input text="Show sentence focus button"
                           type="checkbox"
                           checked={this.props.reduxState.get("sentenceFocusButton")}
                           changeValue={this.toggleFocusButton.bind(this)}/>
                </div>*/}
                <div className="settings-attrGroup">
                    <Input text="Toggle Sheet Toolbar"
                           type="checkbox"
                           checked={this.props.reduxState.get("toolbarToggle")}
                           changeValue={this.toggleToolbar.bind(this)} />
                    <Input text="Widget opacity"
                           type="number"
                           max="100"
                           min="0"
                           value={this.props.reduxState.get("widgetOpacity")}
                           changeValue={this.setWidgetOpacity.bind(this)}/>
                    <Input type="range"
                           max="100"
                           min="0"
                           value={this.props.reduxState.get("widgetOpacity")}
                           changeValue={this.setWidgetOpacity.bind(this)}/>
                </div>
                <div className = 'botToolGroup'>
                    <Button bColor = "#CCCCCC"
                            className = 'botToolGroup-item'
                            onClick={this.reset.bind(this)}> Default </Button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    reduxState: state.settings,
});

const mapDispatchToProps = (dispatch) => ({
    reduxActions: bindActionCreators(Actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingPane);
