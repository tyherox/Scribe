/**
 * Created by JohnBae on 4/4/17.
 */

import React, {Component} from 'react';

export default class Buffer extends Component {

    componentDidMount(){
    }

    render() {
        return(
            <div className="vCenter-outer">
                <div className="vCenter-inner">
                    {this.props.children}
                </div>
            </div>
        )
    }
}
