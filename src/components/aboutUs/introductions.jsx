import React, { Component } from 'react';
import toastr from 'toastr';

class IntroductionsUpdateForm extends Component {
    state = {
        introductions: []
    };

    constructor(props) {
        super(props);
        this.state.introductions = props.introductions;
    }

    getIntroductions() {
        const { introductions } = this.state;
        if (introductions.length > 0) {
            const thead = (
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Picture</th>
                    </tr>
                </thead>
            );
            const rows = introductions.map(introduction => {
                const { title, description, picture } = introduction;
                return (
                    <tr>
                        <td>{title}</td>
                        <td>{description}</td>
                        <td><img src={picture.url} className="img-fluid" alt={picture.reference} /></td>
                    </tr>
                );
            });
            const tbody = (
                <tbody>
                    {rows}
                </tbody>
            );
            return (
                <div className="table-responsive">
                    <table className="table table-hover">
                        {thead}
                        {tbody}
                    </table>
                </div>
            );
        } else {
            return null;
        }
    }

    render() {
        return (
            this.getIntroductions()
        );
    }

}

export default IntroductionsUpdateForm;