import React, { Component } from 'react';
import PuppiesService from '../../services/puppiesService';

class PuppyPictureUpdateForm extends Component {
    state = {
        puppyId: '',
        puppyData: {}
    };

    constructor(props) {
        super(props);
        this.state.puppyId = props.puppyId;
    }

    componentDidMount() {
        this.props.onShowLoading(true, 1);
        PuppiesService.getPuppy(this.state.puppyId)
            .then(res => {
                this.setState({
                    puppyData: res.data
                });
            })
            .catch(err => {
                
            })
            .finally(() => {

            });
    }

    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <h1>Pictures</h1>
                    <div className="row form-group">
                        
                    </div>
                </div>
            </div>
        );
    }
}

export default PuppyPictureUpdateForm;