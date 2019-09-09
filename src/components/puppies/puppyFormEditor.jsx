import React, { Component } from 'react';
import DatePicker from 'react-datepicker';

class PuppyFormEditor extends Component {
    state = {
        puppyId: '',
        selections: {
            name: '',
            dateOfBirth: null,
        },
        parents: []
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // TODO load puppy info if ppuppyId is available.
        // TODO load parents list
    }

    handleSetFirstName = (event) => {
        const name = event.target.value;
        const selections = this.state.selections;
        selections.name = name;
        this.setState({ selections });
    }

    handleSelectDDB = (dateOfBirth) => {
        const selections = this.state.selections;
        selections.dateOfBirth = dateOfBirth;
    }

    render() {
        return (
            <React.Fragment>
                <div className="row form-group">
                    <label className="col-xs-3 col-sm-2 col-md-1 col-lg-1">Name</label>
                    <div className="col-xs-2 col-sm-2 col-md-1 col-lg-1">
                        <input type="text" className="form-control" onKeyUp={this.handleSetFirstName} />
                    </div>
                </div>
                <div className="row form-group">
                    <label className="col-xs-3 col-sm-2 col-md-1 col-lg-1">Date of Birth</label>
                    <div className="col-xs-2 col-sm-2 col-md-1 col-lg-1">
                        <DatePicker className="form-control" selected={this.state.selections.dateOfBirth} onChange={this.handleSelectDOB} />
                    </div>
                </div>
                <div className="row form-group">
                    <label className="col-xs-3 col-sm-2 col-md-1 col-lg-1">Sex</label>
                    <div className="col-3">
                        <select className="form-group" className="form-control" value={this.state.selections.sex} onChange={this.handleSetSex}>
                            <option value="male">M</option>
                            <option value="female">F</option>
                        </select>
                    </div>
                </div>
                <div className="row form-group">
                    <label className="col-xs-3 col-sm-2 col-md-1 col-lg-1">Weight</label>
                    <div className="col-xs-2 col-sm-2 col-md-1 col-lg-1">
                        <input type="text" value={this.state.selections.weight} className="form-control" onKeyUp={this.handleSetWeight} />
                    </div>
                </div>
                <div className="row form-group">
                    <label className="col-xs-3 col-sm-2 col-md-1 col-lg-1">Price</label>
                    <div className="col-xs-2 col-sm-2 col-md-1 col-lg-1">
                        <input type="text" value={this.state.selections.price} className="form-control" onKeyUp={this.handleSetPrice} />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default PuppyFormEditor;