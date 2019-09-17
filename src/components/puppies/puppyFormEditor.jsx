import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import $ from 'jquery';
import { storage } from '../../services/firebaseService';

class PuppyFormEditor extends Component {
    state = {
        puppyId: '',
        selections: {
            name: '',
            type: '',
            sex: '',
            color: '',
            description: '',
            dateOfBirth: null,
            pictures: [],
        },
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
        console.log(event.target.value);
        // let input = event.target.value;
        // const selections = this.state.selections;
        // input = input.replace(/\D/g, '');
        // selections.weight = input;
        // console.log(input);
        // this.setState({ selections });
    }

    handleSetPrice = (event) => {
        const selections = this.state.selections;
        selections.price = event.target.value;
        this.setState({ selections });
    }

    handleSetDescription = (event) => {
        const selections = this.state.selections;
        selections.description = event.target.value;
        this.setState({ selections });
    }

    handleCreateBtnClicked = () => {
        console.log('create');
    }

    handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const selections = this.state.selections;
            selections.pictures.push(URL.createObjectURL(event.target.files[0]));
            this.setState({ selections });
        }
        $('#picture-upload').val(null);
    }

    handleUpdateBtnClicked = () => {
        console.log('update');
    }

    handleDeletePicture = (index) => {
        console.log(index);
    }

    getPictures = () => {
        const pictures = this.state.selections.pictures;
        let pictureCards;
        if (pictures.length > 0) {
            pictureCards = pictures.map((picture, i) => {
                return (
                    <div key={`puppy-picture-${i}`} className="col-3">
                        <div className="row">
                            <div className="col-12">
                                <img src={picture} className="img-fluid" />
                            </div>
                        </div>
                        <div className="row mt-1">
                            <div className="col-6">
                                <div className="float-left">
                                    <button className="btn btn-sm btn-danger" onClick={() => this.handleDeletePicture(i)}>x</button>
                                </div>
                            </div>                                    
                        </div>
                   </div>
                );
            });
        }
        let pictureAddCard = (
            <div className="col-3">
                <label htmlFor="picture-upload" className="custom-file-upload">
                    <i className="fa fa-cloud-upload"></i> Upload
                </label>
                <input id="picture-upload" type="file" onChange={this.handleImageChange} />
            </div>
        );
        return (
            <div className="row">
                {pictureCards}
                {pictureAddCard}
            </div>
        );
    }

    getCreateBtn() {
        return this.state.puppyId === '' ? <button className="btn btn-primary" onClick={this.handleCreateBtnClicked}>Create</button> : <button className="btn btn-primary" onClick={this.handleUpdateBtnClicked}>Update</button>;
    }

    handleImageChange = (selectorFiles) => {
        console.log(selectorFiles);
    }

    render() {
        return (
            <React.Fragment>
                <div className="row form-group">
                    <label className="col-xs-3 col-sm-2 col-md-1 col-lg-1">Name</label>
                    <div className="col-xs-2 col-sm-2 col-md-3 col-lg-3">
                        <input type="text" className="form-control" onKeyUp={this.handleSetFirstName} />
                    </div>
                </div>
                <div className="row form-group">
                    <label className="col-xs-3 col-sm-2 col-md-1 col-lg-1">Date of Birth</label>
                    <div className="col-xs-2 col-sm-2 col-md-2 col-lg-3">
                        <DatePicker className="form-control" selected={this.state.selections.dateOfBirth} onChange={this.handleSelectDOB} />
                    </div>
                </div>
                <div className="row form-group">
                    <label className="col-xs-3 col-sm-2 col-md-1 col-lg-1">Sex</label>
                    <div className="col-3">
                        <select className="form-control" value={this.state.selections.sex} onChange={this.handleSetSex}>
                            <option value="male">M</option>
                            <option value="female">F</option>
                        </select>
                    </div>
                </div>
                <div className="row form-group">
                    <label className="col-xs-3 col-sm-2 col-md-1 col-lg-1">Type</label>
                    <div className="col-3">
                        <select className="form-control" value={this.state.selections.type} onChange={this.handleSetType}>
                            <option value="american">American</option>
                            <option value="european">European</option>
                        </select>
                    </div>
                </div>
                <div className="row form-group">
                    <label className="col-xs-3 col-sm-2 col-md-1 col-lg-1">Color</label>
                    <div className="col-3">
                        <select className="form-control" value={this.state.selections.color} onChange={this.handleSetColor}>
                            {this.getColorOptions()}
                        </select>
                    </div>
                </div>
                <div className="row form-group">
                    <label className="col-xs-3 col-sm-2 col-md-1 col-lg-1">Dad</label>
                    <div className="col-3">
                        <select className="form-control" value={this.state.selections.dadId} onChange={this.handleSetDad}>
                            {this.getDadOptions()}
                        </select>
                    </div>
                </div>
                <div className="row form-group">
                    <label className="col-xs-3 col-sm-2 col-md-1 col-lg-1">Mom</label>
                    <div className="col-3">
                        <select className="form-control" value={this.state.selections.momId} onChange={this.handleSetMom}>
                            {this.getMomOptions()}
                        </select>
                    </div>
                </div>
                <div className="row form-group">
                    <label className="col-xs-3 col-sm-2 col-md-1 col-lg-1">Weight (lbs)</label>
                    <div className="col-xs-2 col-sm-2 col-md-2 col-lg-3">
                        <input type="text" value={this.state.selections.weight} className="form-control" onKeyUp={this.handleSetWeight} />
                    </div>
                </div>
                <div className="row form-group">
                    <label className="col-xs-3 col-sm-2 col-md-1 col-lg-1">Price ($)</label>
                    <div className="col-xs-2 col-sm-2 col-md-2 col-lg-3">
                        <input type="text" value={this.state.selections.price} className="form-control" onKeyUp={this.handleSetPrice} />
                    </div>
                </div>
                <div className="row form-group">
                    <label className="col-xs-3 col-sm-2 col-md-1 col-lg-1">Description</label>
                    <div className="col-xs-9 col-sm-10 col-md-11 col-lg-11">
                        <textarea value={this.state.selections.description} className="form-control" rows="10" style={{resize: 'none'}} onChange={this.handleSetDescription} />
                    </div>
                </div>
                <div className="row form-group">
                    <label className="col-xs-3 col-sm-2 col-md-1 col-lg-1">Pictures</label>
                    <div className="col-xs-10 col-sm-10 col-md-11 col-lg-11">
                        {this.getPictures()}
                    </div>
                </div>
                <div className="row form-group">
                    <div className="col-xs-2 col-sm-2 col-md-1 col-lg-1">
                        {this.getCreateBtn()}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default PuppyFormEditor;