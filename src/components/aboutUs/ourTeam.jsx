import React, { Component } from 'react';
import UtilService from '../../services/utilService';
import $ from 'jquery';

class OurTeam extends Component {
    state = {
        ourTeam: []
    };

    constructor(props) {
        super(props);
        this.state.ourTeam = props.ourTeam;
    }

    componentDidMount() {
        $(document).ready(() => {
            $('[data-toggle="popover"]').popover({
                placement: 'top',
                trigger: 'hover'
            });
        });
    }

    getOurTeam() {
        const { ourTeam } = this.state;
        if (ourTeam.length > 0) {
            const thead = (
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Picture</th>
                    </tr>
                </thead>
            );
            const rows = ourTeam.map((member, i) => {
                const { name, title, description, picture } = member;
                return (
                    <tr key={`member-${i}`}>
                        <td>{name}</td>
                        <td>{title}</td>
                        <td><div data-toggle="popover" data-content={description}>{UtilService.shortenStr(description, 10)}</div></td>
                        <td>
                            <img src={picture.url} alt={picture.reference} />
                        </td>
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
        return this.getOurTeam();
    }

}

export default OurTeam;