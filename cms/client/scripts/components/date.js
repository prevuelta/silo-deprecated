'use strict';

import React from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';

class DateField extends React.Component {
    constructor(props) {
        super(props);
        const { formData } = props;
        let date = formData ? moment(formData) : null;
        this.state = { date };
        this.onChange(date);
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            date: newProps.formData ? moment(newProps.formData) : null,
        });
    }

    onChange(value) {
        this.setState({
            date: value,
        });
        this.props.onChange(value ? value.format('Y-MM-DD') : undefined);
    }

    render() {
        return (
            <div className="field-group">
                <label>{this.props.label}</label>
                <DatePicker
                    dateFormat="DD/MM/YYYY"
                    timeIntervals={30}
                    selected={this.state.date}
                    onChange={this.onChange.bind(this)}
                />
            </div>
        );
    }
}

export default DateField;
