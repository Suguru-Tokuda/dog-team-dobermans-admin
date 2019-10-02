import React, { Component } from 'react';
import BuyersService from '../../services/buyersService';
import toastr from 'toastr';

class BuyerDetail extends Component {
    state = {
        buyerId: '',
        buerDetail: {}
    };

    constructor(props) {
        super(props);
        this.state.buyerId = props.buyerId;
    }

    componentDidMount() {
        const { buyerId } = this.state;
        this.props.onShowLoading(true, 1);
        BuyersService.getBuyer(buyerId)
            .then(res => {
                this.setState({ buerDetail: res.data });
            })
            .catch(err => {
                toastr.error('There was an error in ')
            })
            .finally(() => {
                this.props.onDoneLoading();
            });
    }

    render() {
        return null;
    }
}

export default BuyerDetail;