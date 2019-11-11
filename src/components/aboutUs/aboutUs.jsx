import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Introductions from './introductions';
import OurTeams from './ourTeams';
import AboutUsService from '../../services/aboutUsService';
import toastr from 'toastr';

class AboutUs extends Component {
    state = {
        aboutUsDetail: {}
    };

    constructor(props) {
        super(props);
    }

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

    getIntroductions() {
        const { introductions } = this.state.aboutUsDetail;
        if (typeof introductions !== 'undefined' && introductions.length > 0) {
            return <Introductions introductions={introductions} />
        } else {
            return null;
        }
    }

    getOurTeams() {
        const { ourTeams } = this.state.aboutUsDetail;
        if (typeof ourTeams !== 'undefined' && ourTeams.length > 0) {
            return <OurTeams outTeams={ourTeams} />
        } else {
            return null;
        }   
    }

    getIntroductionEditorBtnLabel() {
        const { introductions } = this.state.aboutUsDetail;
        return (typeof introductions !== 'undefined' && introductions.length > 0) ? 'Update Introductions' : 'Create Introductions';
    }

    getOutTeamsEditorBtnLabel() {
        const { ourTeams } = this.state.aboutUsDetail;
        return (typeof ourTeams !== 'undefined' && ourTeams.length > 0) ? 'Update Our Teams' : 'Create Our Teams';
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
                    <Link className="btn btn-sm btn-primary" to="/about-us/introduction-editor">{this.getIntroductionEditorBtnLabel()}</Link>
                    <Link className="btn btn-sm btn-success ml-2" to="/about-us/out-teams-editor">{this.getOutTeamsEditorBtnLabel()}</Link>
                </div>
            </React.Fragment>
        );
    }

    render() {
        return (
           <div className="row">
               <div className="col-12">
                   <div className="card">
                       <div className="card-body">
                           {this.getHeader()}
                           {this.getIntroductions()}
                           {this.getOurTeams()}
                       </div>
                   </div>
               </div>
           </div>
        );
    }
}

export default AboutUs;