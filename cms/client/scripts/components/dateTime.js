import React from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';

class Date extends React.Component {
    constructor(props) {
        super(props);
        let date = moment(this.props.formData);
        this.state = { date };
    }

    componentWillReceiveProps(newProps) {
        this.setState({ date: moment(newProps.formData) });
    }

    onChange(value) {
        this.setState({
            date: value,
        });
        this.props.onChange(value.format());
    }

    render() {
        return (
            <div className="field-group">
                <DatePicker
                    label={this.props.label}
                    dateFormat="LLL"
                    showTimeSelect
                    timeIntervals={30}
                    selected={this.state.date}
                    onChange={this.onChange.bind(this)}
                />
            </div>
        );
    }
}

export default Date;
