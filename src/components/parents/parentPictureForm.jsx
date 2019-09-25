import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';

class ParentPictureForm extends Component {
    state = {
        initiralParams: [],
        pictures: [],
        formSubmitted: false
    };

    constructor(props) {
        super(props);
        this.state.initialParams = props.initialParams;
        if (Object.keys(this.state.initiralParams).length === 0) {
            props.history.push('/parents');
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.initialParams !== nextProps.initialParams) {
            return { initialParams: nextProps.initialParams };
        } else {
            return null;
        }
    }

    getErrorMsg = () => {
        return this.state.pictures.length === 0 && this.state.formSubmitted === true ? <small className="text-danger">Select picture(s)</small> : null;
    }

    getPictures = () => {
        const pictures = this.state.pictures;
    }

}