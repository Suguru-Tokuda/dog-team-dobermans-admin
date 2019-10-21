import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import ParentsService from '../../services/parentsService';
import toastr from 'toastr';

class ParentInitialForm extends Component {
    state = {
        parentId: '',
        parentDetail: {},
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
        if (typeof props.initialParams !== 'undefined' && Object.keys(props.initialParams).length > 0) {
            this.state.selections = props.initialParams;
        }
        if (typeof props.match.params.parentId !== 'undefined')
            this.state.parentId = props.match.params.parentId;
        this.state.selections.sex = 'male';
        this.state.selections.type = 'american';
        this.state.selections.color = 'Black and Tan';
    }

    componentDidMount() {
        const { parentId, selections } = this.state;
        if (typeof this.props.initialParams === 'undefined') {
            this.props.onShowLoading(true, 1);
            ParentsService.getParent(parentId)
                .then(res => {
                    const parentDetail = res.data;
                    selections.name = parentDetail.name;
                    selections.type = parentDetail.type;
                    selections.sex = parentDetail.sex;
                    selections.color = parentDetail.color;
                    selections.weight = parentDetail.weight;
                    selections.description = parentDetail.description;
                    selections.dateOfBirth = new Date(parentDetail.dateOfBirth);
                    this.setState({ parentDetail });
                })
                .catch(() => {
                    toastr.error('There was an error in loading parent detail');
                })
                .finally(() => {
                    this.props.onDoneLoading();
                });
        }
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
        let input = event.target.value;
        const { selections, validations } = this.state;
        if (input.length > 0) {
            input = input.replace(/\D/g, '');
            if (input !== '') {
                validations.weight = '';
                selections.weight = parseFloat(input);
            } else {
                validations.weight = 'Enter weight';
            }
        } else {
            selections.weight = '';
            validations.weight = 'Enter weight';
        }
        this.setState({ selections, validations });
    }

    handleSetDescription = (event) => {
        const description = event.target.value;
        const { selections, validations } = this.state;
        if (description !== '') {
            validations.description = '';
        } else {
            validations.description = 'Enter description';
        }
        selections.description = description;
        this.setState({ selections, validations });
    }

    handleCreateBtnClicked = (event) => {
        event.preventDefault();
        this.setState({ formSubmitted: true });
        let invalidCount = 0;
        const { selections, validations } = this.state;
        for (const key in selections) {
            const selection = selections[key];
            if (selection === '' || selection === 0 || selection === null) {
                invalidCount++;
                validations[key] = `Enter ${key}`;
            } else {
                validations[key] = '';
            }
        }
        this.setState({ validations });
        if (invalidCount === 0) {
            const newParent = selections;
            this.props.onToPictureBtnClicked(newParent);
            this.props.history.push('/parent/create/pictures');
        }
    }

    handleUpdateBtnClicked = (event) => {
        event.preventDefault();
        this.setState({ formSubmitted: true });
        let valid = true;
        const { parentId, parentDetail, selections, validations } = this.state;
        for (const key in selections) {
            const selection = selections[key];
            if (selection === '' || selection === 0 || selection === null) {
                valid = false;
                validations[key] = `Enter ${key}`;
            } else {
                validations[key] = '';
            }
        }
        this.setState({ validations });
        if (valid === true) {
            parentDetail.name = selections.name;
            parentDetail.type = selections.type;
            parentDetail.sex = selections.sex;
            parentDetail.color = selections.color;
            parentDetail.weight = selections.weight;
            parentDetail.description = selections.description;
            parentDetail.dateOfBirth = selections.dateOfBirth;
            this.props.onShowLoading(true, 1);
            ParentsService.updateParent(parentId, parentDetail)
                .then(() => {
                    toastr.success('Profile updated');
                    this.props.onCancelBtnClicked();
                })
                .catch(() => {
                    toastr.error('There was an error in updating parent data');
                })
                .finally(() => {
                    this.props.onDoneLoading();
                });
        }
    }

    getNextBtn() {
        return this.state.parentId === '' ? <button type="button" className="btn btn-primary" onClick={this.handleCreateBtnClicked}>Next</button> : <button type="button" className="btn btn-primary" onClick={this.handleUpdateBtnClicked}>Update</button>;
    }

    render() {
        const { selections } = this.state;
        return (
            <div className="card">
                <form noValidate>
                    <div className="card-body">
                        {this.getHeader()}
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Name</label>
                            <div className="col-xs-4 col-sm-4 col-md-3 col-lg-3">
                                <input type="text" className={`form-control ${this.getErrorClass('name')}`} value={selections.name} onChange={this.handleSetName} />
                                {this.getErrorMessage('name')}
                            </div>
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Date of Birth</label>
                            <div className="col-xs-4 col-sm-4 col-md-2 col-lg-3">
                                <DatePicker className={`form-control ${this.getErrorClass('dateOfBirth')}`} selected={selections.dateOfBirth} onChange={this.handleSelectDOB} />
                                <br />{this.getErrorMessage('dateOfBirth')}
                            </div>
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Sex</label>
                            <div className="col-5">
                                <select className={`form-control ${this.getErrorClass('sex')}`} value={selections.sex} onChange={this.handleSetSex}>
                                    <option value="male">M</option>
                                    <option value="female">F</option>
                                </select>
                                {this.getErrorMessage('sex')}
                            </div>
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Type</label>
                            <div className="col-5">
                                <select className={`form-control ${this.getErrorClass('type')}`} value={selections.type} onChange={this.handleSetType}>
                                    <option value="american">American</option>
                                    <option value="european">European</option>
                                </select>
                                {this.getErrorMessage('type')}
                            </div>
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Color</label>
                            <div className="col-5">
                                <select className={`form-control ${this.getErrorClass('color')}`} value={selections.color} onChange={this.handleSetColor}>
                                    {this.getColorOptions()}
                                </select>
                                {this.getErrorMessage('color')}
                            </div>
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Weight (lbs)</label>
                            <div className="col-xs-5 col-sm-5 col-md-2 col-lg-3">
                                <input type="text" value={selections.weight} className={`form-control ${this.getErrorClass('weight')}`} onChange={this.handleSetWeight} />
                                {this.getErrorMessage('weight')}
                            </div>
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Description</label>
                            <div className="col-xs-9 col-sm-10 col-md-11 col-lg-11">
                                <textarea value={selections.description} className={`form-control ${this.getErrorClass('description')}`} rows="10" style={{resize: 'none'}} onChange={this.handleSetDescription} />
                                {this.getErrorMessage('description')}
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        {this.getNextBtn()}
                        <button type="button" className="btn btn-secondary ml-1" onClick={this.props.onCancelBtnClicked}>Cancel</button>
                    </div>
                </form>
            </div>
        )
    }
    
}

export default ParentInitialForm;