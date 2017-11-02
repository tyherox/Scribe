/**
 * Created by JohnBae on 6/28/17.
 */

import React from 'react';

export default class Tutorial extends React.Component {



    render(){
        return(
            <input className = "sheet-title"
                   type="text"
                   value={this.state.title}
                   onChange={this.setTitle.bind(this)}
                   onBlur={this.saveTitle.bind(this)}/>
        )
    }

}
