import React, { Component } from 'react';
import ConstantsService from '../../services/constantsService';
import DatePicker from 'react-datepicker';
import PuppiesService from '../../services/puppiesService';
import UtilService from '../../services/utilService';
import toastr from 'toastr';

class PuppyInitialForm extends Component {
    state = {
        puppyID: '',
        puppyDetail: {},
        selections: {
            name: '',
            type: '',
            gender: '',
            color: '',
            price: '',
            pounds: '',
            ounces: '',
            dadID: '',
            momID: '',
            description: '',
            dateOfBirth: null
        },
        validations: {
            name: '',
            type: '',
            gender: '',
            color: '',
            price: '',
            pounds: '',
            ounces: '',
            dadID: '',
            momID: '',
            description: '',
            dateOfBirth: ''
        },
        formSubmitted: false,
        colors: ConstantsService.getDobermanColors(),
        dobermanTypes: ConstantsService.getDobermanTypes(),
        dads: [],
        moms: []
    };

    constructor(props) {
        super(props);
        if (typeof props.match.params.puppyID !== 'undefined')
            this.state.puppyID = props.match.params.puppyID;
        this.state.selections.gender = 'male';
        this.state.selections.type = 'American';
        this.state.selections.color = 'Black & Tan';
        this.state.dads = props.dads;
        this.state.moms = props.moms;
        if (props.initialParams && Object.keys(props.initialParams).length > 0) {
            this.state.selections.name = props.initialParams.name;
            this.state.selections.type = props.initialParams.type;
            this.state.selections.gender = props.initialParams.gender;
            this.state.selections.color = props.initialParams.color;
            this.state.selections.price = props.initialParams.price;
            const weight = UtilService.convertPoundsToOunces(props.initialParams.weight);
            this.state.selections.pounds = weight.lb;
            this.state.selections.ounces = weight.oz;
            this.state.selections.dadID = props.initialParams.dadID;
            this.state.selections.momID = props.initialParams.momID;
            this.state.selections.description = props.initialParams.description;
            this.state.selections.dateOfBirth = props.initialParams.dateOfBirth;
        }
    }

    componentDidMount() {
        const { puppyID } = this.state;
        if (puppyID !== '') {
            this.props.onShowLoading(true, 1);
            PuppiesService.getPuppy(puppyID)
                .then(res => {
                    const puppyDetail = res.data;
                    const { selections } = this.state;
                    selections.name = puppyDetail.name;
                    selections.type = puppyDetail.type;
                    selections.gender = puppyDetail.gender;
                    selections.color = puppyDetail.color;
                    selections.price = puppyDetail.price;
                    const weight = UtilService.convertPoundsToOunces(puppyDetail.weight);
                    selections.pounds = weight.lb;
                    selections.ounces = weight.oz;
                    selections.dadID = puppyDetail.dadID;
                    selections.momID = puppyDetail.momID;
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
        return this.state.puppyID === '' ? <h3 className="mb-3">Create New Puppy</h3> : <h3 className="mb-3">Update Puppy</h3>;
    }

    getErrorClass(key) {
        const { validations, formSubmitted } = this.state;
        return (formSubmitted === true && validations[key] !== '') ? 'is-invalid' : '';
    }

    getErrorMessage(key) {
        const { validations, formSubmitted } = this.state;
        return (formSubmitted === true && validations[key] !== '') ? <small className="text-danger">{validations[key]}</small> : null;
    }

    getDobermanTypeOptions = () => {
        return this.state.dobermanTypes.map(type => {
            return <option key={type.value} value={type.value}>{type.label}</option>;
        });
    }

    getColorOptions = () => {
        return this.state.colors.map(color => {
            return <option key={color} value={color}>{color}</option>;
        });
    }

    getDadOptions = () => {
        return this.state.dads.map(dad => {
            return <option key={dad.parentID} value={dad.parentID}>{dad.name}</option>;
        });
    }

    getMomOptions = () => {
        return this.state.moms.map(mom => {
            return <option key={mom.parentID} value={mom.parentID}>{mom.name}</option>
        });
    }

    handleSetName = (event) => {
        const name = event.target.value;
        const { selections, validations } = this.state;
        if (name !== '') {
            validations.name = '';
        } else {
            validations.name = 'Enter name';
        }
        selections.name = name;
        this.setState({ selections, validations });
    }

    handleSelectDOB = (dateOfBirth) => {
        const { selections, validations } = this.state;
        selections.dateOfBirth = dateOfBirth;
        if (dateOfBirth !== null) {
            validations.dateOfBirth = '';
        } else {
            validations.dateOfBirth = 'Enter date of birth';
        }
        this.setState({ selections, validations });
    }

    handleSetSex = (event) => {
        const gender = event.target.value;
        const { selections, validations } = this.state;
        if (gender !== '') {
            validations.gender = '';
        } else {
            validations.gender = 'Enter gender';
        }
        selections.gender = gender;
        this.setState({ selections, validations });
    }

    handleSetType = (event) => {
        const type = event.target.value;
        const { selections, validations } = this.state;
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
        const { selections, validations } = this.state;
        if (color !== '') {
            validations.color = '';
        } else {
            validations.type = 'Enter color';
        }
        selections.color = color;
        this.setState({ selections, validations });
    }

    handleSetDadId = (event) => {
        const dadID = event.target.value;
        const { selections, validations } = this.state;
        selections.dadID = dadID;
        if (dadID !== '') {
            validations.dadID = '';
        } else {
            validations.dadID = 'Enter dad';
        }
        this.setState({ selections, validations });  
    }

    handleSetMomId = (event) => {
        const momID = event.target.value;
        const { selections, validations } = this.state;
        if (momID !== '') {
            validations.momID = '';
        } else {
            validations.momID = 'Enter mom';
        }
        selections.momID = momID;
        this.setState({ selections, validations });
    }

    handleSetPounds = (event) => {
        let input = event.target.value;
        const { selections, validations } = this.state;
        const regex = new RegExp(/^([0-9]|[1-9][0-9]{1,2}?$)$$/g);
        if (input.length > 0) {
            if (regex.test(input) === true) {
                if (input !== '') {
                    validations.pounds = '';
                    selections.pounds = input;
                } else {
                    validations.pounds = 'Enter pounds';
                }
            }
        } else {
            selections.pounds = '';
            validations.pounds = 'Enter pounds';
        }
        this.setState({ selections, validations });
    }

    handleSetOunces = (event) => {
        let input = event.target.value;
        const { selections } = this.state;
        const regex = new RegExp(/^([0-9]|[1-9][0-9]{1,1}?$)$/g);
        if (input.length > 0) {
            if (regex.test(input) === true ) {
                if (input !== '') {
                    selections.ounces = input;
                }
            }
        } else {
            selections.ounces = '';
        }
        this.setState({ selections });
    }

    handleSetPrice = (event) => {
        let input = event.target.value;
        const { selections, validations } = this.state;
        const regex = new RegExp(/^([0-9]|[0-9]([.][0-9]{0,2}?$)|[1-9][0-9]{1,2}([.][0-9]{0,2})?$)$/g);
        if (input.length > 0) {
            if (regex.test(input) === true) {
                if (input !== '') {
                    validations.price = '';
                    const price = input;
                    selections.price = price;
                } else {
                    validations.price = 'Enter price';
                }
            }
        } else {
            selections.price = '';
            validations.price = 'Enter price';
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
        const { selections } = this.state;
        this.setState({ formSubmitted: true });
        let invalidCount = 0;
        const validations = this.state.validations;
        for (const key in selections) {
            const selection = selections[key];
            if (key !== 'ounces' && selection === '' || selection === 0 || selection === null) {
                invalidCount++;
                validations[key] = `Enter ${key}`;
            } else {
                validations[key] = '';
            }
        }
        this.setState({ validations });
        if (invalidCount === 0) {
            const newPuppy = Object.assign({}, selections);
            delete newPuppy.pounds;
            delete newPuppy.ounces;
            newPuppy.sold = false;
            newPuppy.price = parseFloat(newPuppy.price);
            newPuppy.buyerID = null;
            newPuppy.paidAmount = 0;
            newPuppy.live = false;
            newPuppy.soldDate = null;
            newPuppy.paidAmount = 0;
            newPuppy.weight = UtilService.getPounds(selections.pounds, selections.ounces);
            this.props.onToPictureBtnClicked(newPuppy);
            this.props.history.push('/puppy/create/pictures');
        }
    }

    handleUpdateBtnClicked = (event) => {
        event.preventDefault();
        this.setState({ formSubmitted: true });
        let valid = true;
        const { puppyID, puppyDetail, selections, validations } = this.state;
        for (const key in selections) {
            const selection = selections[key];
            if (key !== 'ounces' && selection === '' || selection === 0 || selection === null) {
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
              puppyDetail.gender = selections.gender;
              puppyDetail.color = selections.color;
              puppyDetail.price = parseFloat(selections.price);
              puppyDetail.weight = UtilService.getPounds(selections.pounds, selections.ounces);
              puppyDetail.dadID = selections.dadID;
              puppyDetail.momID = selections.momID;
              puppyDetail.description = selections.description;
              puppyDetail.dateOfBirth = selections.dateOfBirth;
              this.props.onShowLoading(true, 1);
              PuppiesService.updatePuppy(puppyID, puppyDetail)
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
        return this.state.puppyID === '' ? <button className="btn btn-primary" type="button" onClick={this.handleCreateBtnClicked}>Next</button> : <button type="button" className="btn btn-primary" onClick={this.handleUpdateBtnClicked}>Update</button>;
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
                            <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Gender</label>
                            <div className="col-5">
                                <select className={`form-control ${this.getErrorClass('gender')}`} value={selections.gender} onChange={this.handleSetSex}>
                                    <option value="male">M</option>
                                    <option value="female">F</option>
                                </select>
                                {this.getErrorMessage('gender')}
                            </div>
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Type</label>
                            <div className="col-5">
                                <select className={`form-control ${this.getErrorClass('type')}`} value={selections.type} onChange={this.handleSetType}>
                                    {this.getDobermanTypeOptions()}
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
                                <select className={`form-control ${this.getErrorClass('dadID')}`} value={selections.dadID} onChange={this.handleSetDadId}>
                                    <option value="">--Select Dad--</option>
                                    {this.getDadOptions()}
                                </select>
                                {this.getErrorMessage('dadID')}
                            </div>
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Mom</label>
                            <div className="col-5">
                                <select className={`form-control ${this.getErrorClass('momID')}`} value={selections.momID} onChange={this.handleSetMomId}>
                                    <option value="">--Select Mom--</option>
                                    {this.getMomOptions()}
                                </select>
                                {this.getErrorMessage('momID')}
                            </div>
                        </div>
                        <div className="row form-group">
                            <label className="col-xs-12 col-sm-12 col-md-1 col-lg-1">Weight</label>
                            <div className="col-xs-5 col-sm-5 col-md-2 col-lg-3">
                                <div className="row">
                                    <div className="col-auto">
                                        <div className="form-inline">
                                            <input type="text" value={selections.pounds} className={`form-control ${this.getErrorClass('pounds')}`} onChange={this.handleSetPounds} />
                                            <span className="ml-1">lb</span>
                                        </div>
                                        {this.getErrorMessage('pounds')}
                                    </div>
                                    <div className="col-auto">
                                        <div className="form-inline">
                                            <input type="text" value={selections.ounces} className="form-control" onChange={this.handleSetOunces} />
                                            <span className="ml-1">oz</span>
                                        </div>
                                    </div>
                                </div>
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