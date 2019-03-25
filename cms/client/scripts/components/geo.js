'use strict';

import React from 'react';

class GeoPosition extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ...props.formData
        };
    }

    _onChange(name) {
        return (event) => {
            let data = event.target.value;
            let float = parseFloat(data);
            if (!isNaN(float) || data === "") {
                this.setState({
                    [name]: float 
                }, () => this.props.onChange(this.state));
            }
        }
    }

    componentWillReceiveProps (newProps) {
        this.setState({ ...newProps.formData });
    }

    render() {
        const { latitude, longitude } = this.state;
        return (
            <div className="field-group">
                <label>Lat</label>
                <input type="number" step="any" value={latitude} onChange={this._onChange("latitude")} />
                <label>Lon</label>
                <input type="number" step="any" value={longitude} onChange={this._onChange("longitude")} />
            </div>
        );
    }
}

export default GeoPosition;
