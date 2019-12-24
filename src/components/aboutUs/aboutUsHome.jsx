import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MissionStatements from './missionStatements';
import OurTeam from './ourTeam';
import AboutUsService from '../../services/aboutUsService';
import toastr from 'toastr';

class AboutUsHome extends Component {
    state = {
        aboutUsDetail: {}
    };

    componentDidMount() {
        this.props.onShowLoading(true, 1);
        AboutUsService.getAboutUs()
            .then((res) => {
                this.setState({ aboutUsDetail: res.data });
            })
            .catch(() => {
                toastr.error('There was an error in loading about us data');
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    getMissionStatements() {
        const { missionStatements } = this.state.aboutUsDetail;
        if (typeof missionStatements !== 'undefined' && missionStatements.length > 0) {
            return (
                <div className="row mt-3">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h4>Mission Statements</h4>
                            </div>
                            <div className="card-body">
                                <MissionStatements missionStatements={missionStatements} />
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }

    getOurTeam() {
        const { ourTeam } = this.state.aboutUsDetail;
        if (typeof ourTeam !== 'undefined' && ourTeam.length > 0) {
            return (
                <div className="row mt-3">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h4>Our Team</h4>
                            </div>
                            <div className="card-body">
                                <OurTeam ourTeam={ourTeam} />
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }

    getMissionStatementsEditorBtnLabel() {
        const { missionStatements } = this.state.aboutUsDetail;
        return (typeof missionStatements !== 'undefined' && missionStatements.length > 0) ? 'Update Mission Statements' : 'Create Mission Statements';
    }

    getOurTeamEditorBtnLabel() {
        const { ourTeam } = this.state.aboutUsDetail;
        return (typeof ourTeam !== 'undefined' && ourTeam.length > 0) ? 'Update Our Teams' : 'Create Our Teams';
    }

    getHeader() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-12">
                        <h3>About Us</h3>
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-12">
                        <Link className="btn btn-sm btn-primary" to="/about-us/mission-statements-editor">{this.getMissionStatementsEditorBtnLabel()}</Link>
                        <Link className="btn btn-sm btn-success ml-2" to="/about-us/our-teams-editor">{this.getOurTeamEditorBtnLabel()}</Link>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                {this.getHeader()}
                            </div>
                        </div>
                    </div>
                </div>
                {this.getMissionStatements()}
                {this.getOurTeam()}
            </React.Fragment>
        );
    }
}

export default AboutUsHome;