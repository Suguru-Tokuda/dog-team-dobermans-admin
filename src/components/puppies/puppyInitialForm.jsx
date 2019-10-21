import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import PuppiesService from '../../services/puppiesService';
import toastr from 'toastr';

class PuppyInitialForm extends Component {
    state = {
        puppyId: '',
        puppyDetail: {},
        selections: {
            name: '',
            type: '',
            sex: '',
            color: '',
            price: '',
            weight: '',
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
        colors: ["Black & Tan", "Red", "Blue", "Fawn", "Black (Melanistic)"],
        dads: [],
        moms: []
    };

    constructor(props) {
        super(props);
        if (typeof props.match.params.puppyId !== 'undefined')
            this.state.puppyId = props.match.params.puppyId;
        this.state.selections.sex = 'male';
        this.state.selections.type = 'american';
        this.state.selections.color = 'Black & Tan';
        this.state.selections.dadId = 2;
        this.state.selections.momId = 5;
        this.state.dads = props.dads;
        this.state.moms = props.moms;
        if (props.initialParams && Object.keys(props.initialParams).length > 0) {
            this.state.selections.name = props.initialParams.name;
            this.state.selections.type = props.initialParams.type;
            this.state.selections.sex = props.initialParams.sex;
            this.state.selections.color = props.initialParams.color;
            this.state.selections.price = props.initialParams.price;
            this.state.selections.weight = props.initialParams.weight;
            this.state.selections.dadId = props.initialParams.dadId;
            this.state.selections.momId = props.initialParams.momId;
            this.state.selections.description = props.initialParams.description;
            this.state.selections.dateOfBirth = props.initialParams.dateOfBirth;
        }
    }

    componentDidMount() {
        const { puppyId } = this.state;
        if (puppyId !== '') {
            this.props.onShowLoading(true, 1);
            PuppiesService.getPuppy(puppyId)
                .then(res => {
                    const puppyDetail = res.data;
                    const { selections } = this.state;
                    selections.name = puppyDetail.name;
                    selections.type = puppyDetail.type;
                    selections.sex = puppyDetail.sex;
                    selections.color = puppyDetail.color;
                    selections.price = puppyDetail.price;
                    selections.weight = puppyDetail.weight;
                    selections.dadId = puppyDetail.dadId;
                    selections.momId = puppyDetail.momId;
                    selections.description = puppyDetail.description;
                    selections.dateOfBirth = new Date(puppyDetail.dateOfBirth);
                    this.setState({ selections: selections, puppyDetail: puppyDetail })
                })
                .catch(() => {
                    toastr.error('There was an error in loading puppy data');
                })
                .finally(() => {
                    this.props.onDoneLoading();
                });
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let hasUpdates = false;
        const state = prevState;
        if (nextProps.dads.length !== prevState.dads.length) {
            hasUpdates = true;
            state.dads = nextProps.dads;
        }
        if (nextProps.moms.length !== prevState.moms.length) {
            hasUpdates = true;
            state.moms = nextProps.moms;
        }
        if (hasUpdates === true) {
            return state;
        } else {
            return null;
        }
    }

    getHeader = () => {
        return this.state.puppyId === '' ? <h3 className="mb-3">Create New Puppy</h3> : <h3 className="mb-3">Update Puppy</h3>;
    }

    getErrorClass(key) {
        const validations = this.state.validations;
        return (this.state.formSubmitted === true && validations[key] !== '') ? 'is-invalid' : '';
    }

    getErrorMessage(key) {
        const validations = this.state.validations;
        return (this.state.formSubmitted === true && validations[key] !== '') ? <small className="text-danger">{validations[key]}</small> : null;
    }

    getColorOptions = () => {
        return this.state.colors.map(color => {
            return <option key={color} value={color}>{color}</option>;
        });
    }

    getDadOptions = () => {
        return this.state.dads.map(dad => {
            return <option key={dad.parentId} value={dad.parentId}>{dad.name}</option>;
        });
    }

    getMomOptions = () => {
        return this.state.moms.map(mom => {
            return <option key={mom.parentId} value={mom.parentId}>{mom.name}</option>
        });
    }

    handleSetName = (event) => {
        const name = event.target.value.trim();
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

    handleSetDadId = (event) => {
        const dadId = event.target.value;
        const selections = this.state.selections;
        const validations = this.state.validations;
        selections.dadId = dadId;
        if (dadId !== '') {
            validations.dadId = '';
        } else {
            validations.dadId = 'Enter dad';
        }
        this.setState({ selections, validations });  
    }

    handleSetMomId = (event) => {
        const momId = event.target.value;
        const selections = this.state.selections;
        const validations = this.state.validations;
        if (momId !== '') {
            validations.momId = '';
        } else {
            validations.momId = 'Enter mom';
        }
        selections.momId = momId;
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

    handleSetPrice = (event) => {
        let input = event.target.value;
        const selections = this.state.selections;
        const validations = this.state.validations;
        if (input.length > 0) {
            input = input.replace(/\D/g, '');
            if (input !== '') {
                validations.price = '';
                const price = parseInt(input);
                selections.price = price;
            } else {
                validations.price = 'Enter price';
            }
        } else {
            selections.price = '';
            validations.price = 'Enter price';
        }
        this.setState({ selections, validations });
    }

    handleSetDescription = (event) => {
        const description = event.target.value;
        const selections = this.state.selections;
        const validations = this.state.validations;
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
        const validations = this.state.validations;
        for (const key in this.state.selections) {
            const selection = this.state.selections[key];
            if (selection === '' || selection === 0 || selection === null) {
                invalidCount++;
                validations[key] = `Enter ${key}`;
            } else {
                validations[key] = '';
            }
        }
        this.setState({ validations });
        if (invalidCount === 0) {
            const newPuppy = this.state.selections;
            newPuppy.sold = false;
            newPuppy.buyerId = null;
            newPuppy.payedAmount = 0;
            newPuppy.live = false;
            newPuppy.soldDate = null;
            newPuppy.paidAmount = 0;
            this.props.onToPictureBtnClicked(newPuppy);
            this.props.history.push('/puppy/create/pictures');
        }
    }

    handleUpdateBtnClicked = (event) => {
        event.preventDefault();
        this.setState({ formSubmitted: true });
        let valid = true;
        const { puppyId, puppyDetail, selections, validations } = this.state;
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
              puppyDetail.name = selections.name;
              puppyDetail.type = selections.type;
              puppyDetail.sex = selections.sex;
              puppyDetail.color = selections.color;
              puppyDetail.price = selections.price;
              puppyDetail.weight = selections.weight;
              puppyDetail.dadId = selections.dadId;
              puppyDetail.momId = selections.momId;
              puppyDetail.description = selections.description;
              puppyDetail.dateOfBirth = selections.dateOfBirth;
              this.props.onShowLoading(true, 1);
              PuppiesService.updatePuppy(puppyId, puppyDetail)
                .then(() => {
                    toastr.success('Profile updated');
                    this.props.onCancelBtnClicked();
                })
                .catch(() => {
                    toastr.error('There was an error in updating puppy data');
                })
                .finally(() => {
                    this.props.onDoneLoading();
                });
        }
    }

    getNextBtn() {
        return this.state.puppyId === '' ? <button className="btn btn-primary" type="button" onClick={this.handleCreateBtnClicked}>Next</button> : <button type="button" className="btn btn-primary" onClick={this.handleUpdateBtnClicked}>Update</button>;
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
                            <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Dad</label>
                            <div className="col-5">
                                <select className={`form-control ${this.getErrorClass('dadId')}`} value={selections.dadId} onChange={this.handleSetDadId}>
                                    {this.getDadOptions()}
                                </select>
                                {this.getErrorMessage('dadId')}
                            </div>
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Mom</label>
                            <div className="col-5">
                                <select className={`form-control ${this.getErrorClass('momId')}`} value={selections.momId} onChange={this.handleSetMomId}>
                                    {this.getMomOptions()}
                                </select>
                                {this.getErrorMessage('momId')}
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
                            <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Price ($)</label>
                            <div className="col-xs-5 col-sm-5 col-md-2 col-lg-3">
                                <input type="text" value={selections.price} className={`form-control ${this.getErrorClass('price')}`} onChange={this.handleSetPrice} />
                                {this.getErrorMessage('price')}
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
        );
    }
}

export default PuppyInitialForm;