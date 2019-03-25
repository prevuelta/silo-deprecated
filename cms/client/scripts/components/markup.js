import React from 'react';
import Editor from 'react-medium-editor';

class MarkupField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: props.formData,
            activeTab: 0,
        };
        this.tabs = ['Text', 'HTML'];
    }

    componentWillReceiveProps(newProps) {
        this.setState({ text: newProps.formData });
    }

    _onChange(text) {
        this.setState({ text });
        this.props.onChange(text === '' ? undefined : text);
    }

    _onTextareaChange(e) {
        this._onChange(e.target.value);
    }

    _changeTab(activeTab) {
        this.setState({ activeTab });
    }

    render() {
        const { activeTab } = this.state;
        return (
            <div className="field-markup">
                <nav className="tabs">
                    {this.tabs.map((t, i) => (
                        <a
                            key={i}
                            className={activeTab === i ? 'active' : ''}
                            onClick={() => this._changeTab(i)}>
                            {t}
                        </a>
                    ))}
                </nav>
                {activeTab === 0 && (
                    <div className="tab-container">
                        <Editor
                            text={this.state.text}
                            onChange={this._onChange.bind(this)}
                            options={{
                                toolbar: {
                                    buttons: [
                                        'bold',
                                        'italic',
                                        'anchor',
                                        'underline',
                                        'quote',
                                        'unorderedlist',
                                    ],
                                },
                            }}
                        />
                    </div>
                )}
                {activeTab === 1 && (
                    <div className="tab-container">
                        <textarea
                            value={this.state.text}
                            onChange={this._onTextareaChange.bind(this)}
                        />
                    </div>
                )}
            </div>
        );
    }
}

export default MarkupField;
