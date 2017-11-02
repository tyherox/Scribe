/**
 * Created by JohnBae on 1/30/17.
 *
 * React "Collapsible Pane" to handle collapsing / expanding behaviour or panes.
 */

import React from "react";

export default class Collapsible extends React.Component{

    constructor(props){
        super(props);
        this.state = {collapse: false};
    }

    componentDidMount(){
        //this.refs.cPane.style.height = parseInt(this.refs.cPane.getBoundingClientRect().height) + 'px';
    }

    componentDidUpdate(){
        //this.refs.cPane.style.height = parseInt(this.refs.cPane.getBoundingClientRect().height) + 'px';
    }

    //Handle collapsed / expanded state changes
    setCollapse(){
        var pane = this.refs.cPane;
        if(this.state.collapse){
            pane.style.height = 'auto';
            this.setState({collapse: false});
        }
        else{
            pane.style.height = this.props.height || '35px';
            this.setState({collapse: true});
        }
    }

    render(){
        return(
            <div className="rye-collapsiblePane"
                 ref="cPane">
                <div className="rye-collapsiblePane-topBar">
                    <div className="rye-collapsiblePane-topBar-title" onClick={()=>this.setCollapse()}>{this.props.title}</div>
                </div>
                {this.state.collapse ? null : this.props.children}
            </div>
        )
    }
}
