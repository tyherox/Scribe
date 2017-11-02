/**
 * Created by JohnBae on 4/4/17.
 */

import React, {Component} from 'react';

export default class Popover extends Component {

    constructor(props){
        this.super(props);
        this.state = {visibility: false}
    }

    hide(){
        this.setState({visibility: false});
    }

    show(){
        this.setState({visibility: true});
    }

    render() {
        var className = this.state.visibility ? "popover-overlay-show" : "popover-overlay-hide";
        return(
            <div className={className}>
                <div className="popover-content">
                    {this.props.children}
                </div>
            </div>
        )
    }
}
