import React, { Component } from 'react';
import toastr from 'toastr';

class MissionStatementsUpdateForm extends Component {
    state = {
        missionStatements: []
    };

    constructor(props) {
        super(props);
        this.state.missionStatements = props.missionStatements;
    }

    getIntroductions() {
        const { missionStatements } = this.state;
        if (missionStatements.length > 0) {
            const thead = (
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Picture</th>
                    </tr>
                </thead>
            );
            const rows = missionStatements.map(missionStatement => {
                const { title, description, picture } = missionStatement;
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

export default MissionStatementsUpdateForm;