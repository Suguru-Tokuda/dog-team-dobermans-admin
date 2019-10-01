import React, { Component } from 'react';
import PuppyDetail from './puppyDetail';
import BuyerLookupModal from ''
import ConstantsService from '../../services/constantsService';

class PuppySalesForm extends Component {
    state = {
        puppyId: '',
        emailForSearch: '',
        selections: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            city: '',
            state: ''
        }
    };

    render() {
        const { puppyId } = this.state;
        return (
            <div className="row">
                <div className="col-6">
                    <PuppyDetail puppyId={puppyId} hideButtons={true} />
                </div>
                <div className="col-6">

                </div>
            </div>
        );
    }
}

export default PuppySalesForm;