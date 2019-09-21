import React, { Component } from 'react';
import $ from 'jquery';

class PuppyPictureForm extends Component {

    state = {
        initialParams: {},
        pictures: []
    }

    constructor(props) {
        super(props);
        console.log('constructor');
        this.state.initialParams = props.initialParams;
    }

    static getDerivedStateFromProps(prevState, nextProps) {
        if (prevState.initialParams !== nextProps.initialParams) {
            return { initialParams: nextProps.initialParams };
        }
    }

    componentDidMount() {
        console.log('PuppyPictureForm mounted');
    }

    getPictures = () => {
        const pictures = this.state.pictures;
        let pictureCards;
        if (pictures.length > 0) {
            pictureCards = pictures.map((picture, i) => {
                const imageURL = URL.createObjectURL(picture);
                return (
                    <div key={`puppy-picture-${i}`} className="col-3">
                        <div className="row">
                            <div className="col-12">
                                <img src={imageURL} className="img-fluid" />
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

    handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const pictures = this.state.pictures;
            pictures.push(event.target.files[0]);
            this.setState({ pictures });
        }
        $('#picture-upload').val(null);
    }

    handleDeletePicture = (index) => {
        console.log(index);
    }

    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <h1>Pictures</h1>
                    <div className="row form-group">
                        <div className="col-12">
                            {this.getPictures()}
                        </div> 
                    </div>
                </div>
            </div>
        );
    }
}

export default PuppyPictureForm;