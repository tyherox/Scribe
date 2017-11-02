/**
 * Created by JohnBae on 1/31/17.
 *
 * React "Scroll Pane" to handle scroll related behaviours and provide a readable html/jsx component.
 */

import React from "react";

export default class ScrollPane extends React.Component{

    componentDidMount(){
    }

    componentDidUpdate(){

    }

    render(){
        return(
            <div className={"rye-scrollPane " + this.props.className}>
                <div className="rye-scrollPane-container">
                    {this.props.children}
                </div>
            </div>
        )
    }
}
