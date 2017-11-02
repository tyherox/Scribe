/**
 * Created by JohnBae on 1/30/17.
 *
 * Dynamic react "Buffer" component. Allows spacing between elements in a natural html/jsx format.
 */

import React, {Component} from 'react';

export default class Buffer extends Component {

    componentDidMount(){
        this.setSpacing();
    }

    //Sets spacing for buffer elements.
    setSpacing(){
        var buffer = this.refs.buffer;

        if(this.props.size){
            buffer.style.padding = this.props.size + 'px';
        }
        else {
            buffer.style.padding = 15 + 'px';
        }
    }

    render() {
        return(<div ref="buffer"></div>)
    }
}
