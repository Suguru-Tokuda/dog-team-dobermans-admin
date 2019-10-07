import React, { Component } from 'react';
import DatePicker from 'react-datepicker';

class ParentInitialForm extends Component {
    state = {
        parentId: '',
        selections: {
            name: '',
            type: '',
            sex: '',
            color: '',
            weight: '',
            description: '',
            dateOfBirth: null
        },
        validations: {
            name: '',
            type: '',
            sex: '',
            color: '',
            weight: '',
            description: '',
            dateOfBirth: ''
        },
        formSubmitted: false,
        colors: ["Black and Tan", "Red", "Blue", "Fawn", "Black (Melanistic)"]
    };

    constructor(props) {
        super(props);
        if (typeof props.parentId !== 'undefined')
            this.state.parentId = props.parentId;
        this.state.selections.sex = 'male';
        this.state.selections.type = 'american';
        this.state.selections.color = 'Black and Tan';
    }

    componentDidMount() {
        // TODO load parent info if parentId is available.
    }

    getHeader = () => {
        return this.state.parentId === '' ? <h1>Create New Parent</h1> : <h1>Update Parent</h1>;
    }

    getErrorClass(key) {
        const validations = this.state.validations;
        return (this.state.formSubmitted === true && validations[key] !== '' ? 'is-invalid' : '');
    }

    getErrorMessage(key) {
        const validations = this.state.validations;
        return (this.state.formSubmitted === true && validations[key] !== '' ? <small className="text-danger">{validations[key]}</small> : null);
    }

    getColorOptions = () => {
        return this.state.colors.map(color => {
            return <option key={color} value={color}>{color}</option>;
        });
    }

    handleSetName = (event) => {
        const name= event.target.value.trim();
        const selections = this.state.selections;
        const validations = this.state.validations;
        if (name !== '') {
            validations.name = '';
        } else {
            validations.name = 'Enter name';
        }
        selections.name = name;
        this.setState({ selections, validations });
    }

    handleSelectDOB = (dateOfBirth) => {
        const selections = this.state.selections;
        const validations = this.state.validations;
        selections.dateOfBirth = dateOfBirth;
        if (dateOfBirth !== null) {
            validations.dateOfBirth = '';
        } else {
            validations.dateOfBirth = 'Enter date of birth';
        }

        this.setState({ selections, validations });
    }

    handleSetSex = (event) => {
        const sex = event.target.value;
        const selections = this.state.selections;
        const validations = this.state.validations;
        if (sex !== '') {
            validations.sex = '';
        } else {
            validations.sex = 'Enter sex';
        }
        selections.sex = sex;
        this.setState({ selections, validations });
    }

    handleSetType = (event) => {
        const type = event.target.value;
        const selections = this.state.selections;
        const validations = this.state.validations;
        if (type !== '') {
            validations.type = '';
        } else {
            validations.type = 'Enter type';
        }
        selections.type = type;
        this.setState({ selections, validations });
    }

    handleSetColor = (event) => {
        const color = event.target.value;
        const selections = this.state.selections;
        const validations = this.state.validations;
        if (color !== '') {
            validations.color = '';
        } else {
            validations.type = 'Enter color';
        }
        selections.color = color;
        this.setState({ selections, validations });
    }

    handleSetWeight = (event) => {

    }

    handleSetDescription = (event) => {
        
    }

    handleUpdateBtnClicked = () => {

    }

    handleCancelBtnClicked = () => {
        this.props.onCancelBtnClicked();
        this.props.history.push('/parents');
    }

    getNextBtn() {
        return this.state.parentId === '' ? <button type="button" className="btn btn-primary" onClick={this.handleCreateBtnClicked}>Next</button> : <button className="btn btn-primary" onClick={this.handleUpdateBtnClicked}>Update</button>;
    }

    render() {
        return (
            <div className="card">
                <form noValidate>
                    <div className="card-body">
                        {this.getHeader()}
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Name</label>
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">
                                <input type="text" className={`form-control ${this.getErrorClass('name')}`} onChange={this.handleSetName} />
                                {this.getErrorMessage('name')}
                            </div>
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Date of Birth</label>
                            <div className="col-xs-4 col-sm-4 col-md-2 col-lg-3">
                                <DatePicker className={`form-control ${this.getErrorClass('dateOfBirth')}`} selected={this.state.selections.dateOfBirth} onChange={this.handleSelectDOB} />
                                <br />{this.getErrorMessage('dateOfBirth')}
                            </div>
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Sex</label>
                            <div className="col-5">
                                <select className={`form-control ${this.getErrorClass('sex')}`} value={this.state.selections.sex} onChange={this.handleSetSex}>
                                    <option value="male">M</option>
                                    <option value="female">F</option>
                                </select>
                                {this.getErrorMessage('sex')}
                            </div>
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Type</label>
                            <div className="col-5">
                                <select className={`form-control ${this.getErrorClass('type')}`} value={this.state.selections.type} onChange={this.handleSetType}>
                                    <option value="american">American</option>
                                    <option value="european">European</option>
                                </select>
                                {this.getErrorMessage('type')}
                            </div>
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Color</label>
                            <div className="col-5">
                                <select className={`form-control ${this.getErrorClass('color')}`} value={this.state.selections.color} onChange={this.handleSetColor}>
                                    {this.getColorOptions()}
                                </select>
                                {this.getErrorMessage('color')}
                            </div>
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Weight (lbs)</label>
                            <div className="col-xs-5 col-sm-5 col-md-2 col-lg-3">
                                <input type="text" value={this.state.selections.weight} className={`form-control ${this.getErrorClass('weight')}`} onChange={this.handleSetWeight} />
                                {this.getErrorMessage('weight')}
                            </div>
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Description</label>
                            <div className="col-xs-9 col-sm-10 col-md-11 col-lg-11">
                                <textarea value={this.state.selections.description} className={`form-control ${this.getErrorClass('description')}`} rows="10" style={{resize: 'none'}} onChange={this.handleSetDescription} />
                                {this.getErrorMessage('description')}
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        {this.getNextBtn()}
                        <button type="button" className="btn btn-secondary ml-1" onClick={this.handleCancelBtnClicked}>Cancel</button>
                    </div>
                </form>
            </div>
        )
    }
    
}

export default ParentInitialForm;