/**
 * Created by JohnBae on 4/3/17.
 */

import React from 'react';
import Button from '../../components/button';
import VCenter from '../../components/vCenter/main';

class Time extends React.Component {


    constructor(props){
        super(props);
        this.state = {time: 0, date: 0};
    }

    componentDidMount(){
        this.getTime = this.getTime.bind(this);
        this.getDate = this.getDate.bind(this);

        this.getTime();
        this.getDate();
    }

    componentWillUnmount(){
        clearInterval(this.timeInterval);
        clearInterval(this.dateInterval);
    }

    getTime(){
        var self = this;
        this.timeInterval = setInterval(function(){
            var today = new Date();
            var h = today.getHours();
            var m = today.getMinutes();
            var s = today.getSeconds();
            m = self.formatTime(m);
            s = self.formatTime(s);
            var time = h + ":" + m;
            self.setState({time: time});
        }, 500);
    }

    formatTime(i) {
        if (i < 10) {
            i = "0" + i
        }
        return i;
    }

    getDate(){

        var self = this;

        this.monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];

        this.dayNames = [
            'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
        ];

        this.dateInterval = setInterval(function(){
            var rawDate = new Date();

            var wDay = self.dayNames[rawDate.getDay()];
            var day = rawDate.getDate();
            var month = self.monthNames[rawDate.getMonth()];
            var year = rawDate.getFullYear();

            self.setState({date: [wDay, day  + " " + month +", " + year]});
        }, 500);
    }

    render() {
        return (
            <div id="timeWidget">
                <div id="timeWidget-toolbar">
                    {/*
                     <Button className="timeWidget-icon">1</Button>
                     <Button className="timeWidget-icon">2</Button>
                    */}
                </div>
                <div id="timeWidget-time">
                    <VCenter>
                        {this.state.time}
                    </VCenter>
                </div>
                <div id="timeWidget-date">
                    <div id="timeWidget-date-content">
                        <div>{this.state.date[0]}</div>
                        <div>{this.state.date[1]}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default {
    id:2,
    multi: false,
    minWidth: 1,
    minHeight: 1,
    maxWidth: 1,
    maxHeight: 1,
    content: Time
}
