/**
 * Created by JohnBae on 1/30/17.
 *
 * React form "Input" components for easy custom styling and data management.
 */

import React from "react";

export default class Input extends React.Component{

    componentDidMount(){

    }

    componentDidUpdate(){

    }

    handleNewValue(){
        var value = null,
            type = this.props.type;
        switch(type){
            case "checkbox" : value = this.props.checked;
                break;
            case "number" :
                if(this.props.min <= value && this.props.max >= value){
                    value = parseInt(this.refs.input.value);
                }
                break;
            case "range" :
                if(this.props.min <= value && this.props.max >= value){
                    value = parseInt(this.refs.input.value);
                }
                break;
        }
        this.props.changeValue(value);
    }


    render(){

        var input = null,
            type = this.props.type;

        switch(type){
            case "checkbox" :
                input = <input className = "rye-input-area"
                               ref="input"
                               type="checkbox"
                               checked={this.props.checked}
                               onChange={this.handleNewValue.bind(this)} />;
                break;

            case "number" :
                input = <input className = "rye-input-area"
                               ref="input"
                               type="number"
                               max={this.props.max}
                               min={this.props.min}
                               value={this.props.value}
                               onChange={this.handleNewValue.bind(this)} />;
                break;

            case "range" :
                input = <input className = "rye-input-area"
                               ref="input"
                               type="range"
                               max={this.props.max}
                               min={this.props.min}
                               value={this.props.value}
                               onChange={this.handleNewValue.bind(this)} />;
                break;
        }

        return(
            <div className = "rye-input">
                <div className = "rye-input-title"
                     onClick={this.handleNewValue.bind(this)}>{this.props.text}</div>
                {input}
            </div>
        )

    }
}
