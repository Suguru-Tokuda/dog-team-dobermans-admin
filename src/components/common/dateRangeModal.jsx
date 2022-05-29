import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import $ from 'jquery';

export default class DateRangeModal extends Component {
    state = {
        startDate: null,
        endDate: null,
        submitted: false
    };
    
    constructor(props) {
        super(props);

        if (props.startDate)
            this.state.startDate = props.startDate;
        if (props.endDate)
            this.state.endDate = props.endDate;
    }

    componentDidMount () {
        $('#dateRangeModal').on('hidden.bs.modal', () => {
            this.setState({
                startDate: null,
                endDate: null
            })
        });
    }

    handleDateSelected = () => {

    }

    handleStartDateSelected = (date) => {
        if (this.state.endDate && this.state.endDate < date) {
            this.setState({
                startDate: this.state.endDate,
                endDate: date
            });
        } else {
            this.setState({ startDate: date });
        }
    }

    handleEndDateSelected = (date) => {
        if (this.state.startDate && this.state.startDate > date) {
            this.setState({
                startDate: date,
                endDate: this.state.startDate
            });
        } else {
            this.setState({ endDate: date });
        }
    }

    handleSelectBtnClicked = () => {
        this.setState({ submitted: true });
        if (this.state.startDate && this.state.endDate) {
            $('#dateRangeModal').modal('hide');
            this.props.onDateRangeSelected({
                startDate: this.state.startDate,
                endDate: this.state.endDate
            });
        }
    }

    render() {
        const { startDate, endDate, submitted } = this.state;

        return (
            <div className="modal fade"
                 id="dateRangeModal"
                 role="dialog"
                 aria-hidden="true"
            >
                <div class="modal-dialog modal-md" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Date Range</h3>
                            <p>Select start and end date to filter records.</p>
                        </div>
                        <div className="modal-body">
                            <div class="row form-group">
                                <label class="col-12">
                                    Start Date
                                </label>
                                <div className="col-12">
                                    <DatePicker className={`form-control ${(!startDate && submitted ? 'is-invalid' : '')}`} 
                                                selected={startDate} 
                                                onChange={this.handleStartDateSelected} 
                                    />
                                    {
                                        (!startDate && submitted) && (
                                            <div>
                                                <small className="text-danger">
                                                    Select start date
                                                </small>    
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                            <div class="row form-group">
                                <label class="col-12">
                                    End Date
                                </label>
                                <div className="col-12">
                                    <DatePicker className={`form-control ${(!endDate && submitted ? 'is-invalid' : '')}`} 
                                                selected={endDate} 
                                                onChange={this.handleEndDateSelected} 
                                    />
                                    {
                                        (!endDate && submitted) && (
                                            <div>
                                                <small className="text-danger">
                                                    Select end date
                                                </small>    
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button"
                                    className="btn btn-primary"
                                    onClick={this.handleSelectBtnClicked}
                            >
                                Select
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}