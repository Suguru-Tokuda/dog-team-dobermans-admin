import React, { Component } from 'react';
import AboutUsService from '../../services/aboutUsService';
import toastr from 'toastr';

class IntroductionsUpdateForm extends Component {
    state = {
        introductions: []
    };

    constructor(props) {
        super(props);
        this.state.introductions = props.introductions;
        if (this.state.introductins.length !== 5) {
            this.state.introductions.push({
                title: '',
                description: '',
                picture: ''
            });
        }
    }

    getIntroductionForms() {
        const { instructions } = this.state;
        if (instructions.length > 0) {
            return instructions.map(instruction, i => {
                const title = instruction.title;
                const description = instruction.description;
                const picture = instruciton.picture;
                return (
                    <div key={`intro-${i}`} className="row form-group">
                        <div className="col-4">
                            <label>Title</label>
                            <input className="form-control" value={title} />
                        </div>
                        <div className="col-4">
                            <label>Description</label>
                            <textarea className="form-control" value={description} ></textarea>
                        </div>
                        <div className="col-4">
                            {picture.url && (
                                <img src={picture.url} alt={picture.reference} />
                            )}
                        </div>
                    </div>
                );
            });
        } else {
            return null;
        }
    }

    render() {
        const { introductions } = this.state;
        return (
            null
        );
    }

}

export default IntroductionsUpdateForm;