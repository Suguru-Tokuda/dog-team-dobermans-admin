import React, { Component } from 'react';
import DatePicker from 'react-datepicker';

class PuppyInitialForm extends Component {
    state = {
        puppyId: '',
        selections: {
            name: '',
            type: '',
            sex: '',
            color: '',
            price: 0,
            weight: 0,
            dadId: '',
            momId: '',
            description: '',
            dateOfBirth: null
        },
        validations: {
            name: '',
            type: '',
            sex: '',
            color: '',
            price: '',
            weight: '',
            dadId: '',
            momId: '',
            description: '',
            dateOfBirth: ''
        },
        formSubmitted: false,
        colors: ["Black and Tan", "Red", "Blue", "Fawn", "Black (Melanistic)"],
        dads: [],
        moms: []
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // TODO load puppy info if ppuppyId is available.
        // TODO load parents list
    }

    getHeader = () => {
        return this.state.puppyId === '' ? <h1>Create New Puppy</h1> : <h1>Update Puppy</h1>;
    }

    getErrorClass(key) {
        const validations = this.state.validations;
        return (this.state.formSubmitted === true && validations[key] !== '') ? 'is-invalid' : '';
    }

    getErrorMessage(key) {
        const validations = this.state.validations;
        return (this.state.formSubmitted === true && validations[key] !== '') ? <small className="text-danger">{validations[key]}</small> : null;
    }

    handleSetFirstName = (event) => {
        const name = event.target.value;
        const selections = this.state.selections;
        selections.name = name;
        this.setState({ selections });
    }

    getColorOptions = () => {
        return this.state.colors.map(color => {
            return <option key={color} value={color}>{color}</option>;
        });
    }

    getDadOptions = () => {
        return this.state.dads.map(dad => {
            return <option value={dad.parentId}>{dad.name}</option>;
        });
    }

    getMomOptions = () => {
        return this.state.moms.map(mom => {
            return <option value={mom.parentId}>{mom.parentId}</option>
        });
    }

    handleSelectDOB = (dateOfBirth) => {
        const selections = this.state.selections;
        selections.dateOfBirth = dateOfBirth;
        this.setState({ selections });
    }

    handleSetSex = (event) => {
        const sex = event.target.value;
        const selections = this.state.selections;
        selections.sex = sex;
        this.setState({ selections });
    }

    handleSetType = (event) => {
        const type = event.target.value;
        const selections = this.state.selections;
        selections.type = type;
        this.setState({ selections });
    }

    handleSetColor = (event) => {
        const color = event.target.value;
        const selections = this.state.selections;
        selections.color = color;
        this.setState({ selections });
    }

    handleSetDad = (event) => {
        const dadId = event.target.value;
        const selections = this.state.selections;
        selections.dadId = dadId;
        this.setState({ selections });  
    }

    handleSetMom = (event) => {
        const momId = event.target.value;
        const selections = this.state.selections;
        selections.momId = momId;
        this.setState({ selections });
    }

    handleSetWeight = (event) => {
        let input = event.target.value;
        const selections = this.state.selections;
        input = input.replace(/\D/g, '');
        selections.weight = input;
        this.setState({ selections });
    }

    handleSetPrice = (event) => {
        let input = event.target.value;
        const selections = this.state.selections;
        const price = parseInt(event.target.value);
        selections.price = price;
        this.setState({ selections });
    }

    handleSetDescription = (event) => {
        const selections = this.state.selections;
        selections.description = event.target.value;
        this.setState({ selections });
    }

    handleCreateBtnClicked = () => {
        this.setState({ formSubmitted: true });
        let invalidCount = 0;
        const validations = this.state.validations;
        for (const key in this.state.selections) {
            const selection = this.state.selections[key];
            if (selection === '' || selection === 0 || selection === null) {
                invalidCount++;
                validations[key] = 'Enter value';
            } else {
                validations[key] = '';
            }
        }
        this.setState({ validations });
        if (invalidCount === 0) {
            this.props.onNextBtnClicked(this.state.selections);
            this.props.history.push('/puppy/create/pictures');
        } else {

        }
    }

    handleUpdateBtnClicked = () => {
        console.log('update');
    }

    getNextBtn() {
        return this.state.puppyId === '' ? <button className="btn btn-primary" type="button" onClick={this.handleCreateBtnClicked}>Next</button> : <button className="btn btn-primary" onClick={this.handleUpdateBtnClicked}>Update</button>;
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
                                <input type="text" className={`form-control ${this.getErrorClass('name')}`} onKeyUp={this.handleSetFirstName} />
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
                            <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Dad</label>
                            <div className="col-5">
                                <select className={`form-control ${this.getErrorClass('dadId')}`} value={this.state.selections.dadId} onChange={this.handleSetDad}>
                                    {this.getDadOptions()}
                                </select>
                                {this.getErrorMessage('dadId')}
                            </div>
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Mom</label>
                            <div className="col-5">
                                <select className={`form-control ${this.getErrorClass('momId')}`} value={this.state.selections.momId} onChange={this.handleSetMom}>
                                    {this.getMomOptions()}
                                </select>
                                {this.getErrorMessage('momId')}
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
                            <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Price ($)</label>
                            <div className="col-xs-5 col-sm-5 col-md-2 col-lg-3">
                                <input type="text" value={this.state.selections.price} className={`form-control ${this.getErrorClass('price')}`} onChange={this.handleSetPrice} />
                                {this.getErrorMessage('price')}
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
                    </div>
                </form>
            </div>
        );
    }
}

export default PuppyInitialForm;