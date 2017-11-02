/**
 * Created by JohnBae on 1/30/17.
 *
 * React "Button" component to handle theme dependent styles.
 */

import React, {Component} from "react";

export default class Button extends Component{

    componentDidMount(){
        this.decorateButton()
    }

    componentDidUpdate(){
        this.decorateButton()
    }

    //Styling Button with theme dependent icons / parameters.
    decorateButton(){
        var button = this.refs.button;

        if(this.props.type == "square"){
            button.style.width = "36px";
            button.style.height = "36px";

        }
        if(this.props.type == "full"){
            button.style.width = "100%";
            button.style.height = "100%";

        }
        if(this.props.type == "half"){
            button.style.width = "50%";
            button.style.height = "100%";

        }
        if(this.props.width) button.style.width = this.props.width + "px";
        if(this.props.height) button.style.height = this.props.height + "px";
        if(this.props.bColor) button.style.backgroundColor = this.props.bColor;
        if(this.props.icon){
            button.style.backgroundImage = "url(assets/" + this.props.icon + ")";
            button.style.backgroundSize = "60%";
            if(this.props.size == "small") button.style.backgroundSize = "50%";
            button.style.backgroundRepeat = "no-repeat";
            button.style.backgroundPosition = "center";
            if(!this.props.customBackground) button.style.backgroundColor = "transparent";
            if(this.props.inverse)  button.style.backgroundColor = "white";
        }
    }

    shouldComponentUpdate(props){
        if(props.icon != this.props.icon) return true;
        if(props.className != this.props.className) return true;
        return false;
    }

    render(){
        return(
            <button className = {"rye-button " + (this.props.className == undefined  ? "" : this.props.className)}
                    style = {this.props.stylestyle}
                    ref = "button"
                    onClick={this.props.onClick}>
                {this.props.children}
            </button>
        )
    }
}
