import React, { Component } from 'react';
import Sortable from 'react-sortablejs';

class SortableOurTeamRows extends Component {
    state = {
        ourTeam: [],
        formSubmitted: false
    };

    constructor(props) {
        super(props);
        this.state.ourTeam = props.ourTeam;

    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (JSON.stringify(nextProps.ourTeam) !== JSON.stringify(prevState.ourTeam) || nextProps.formSubmitted !== prevState.formSubmitted) {
            const state = prevState;
            if (JSON.stringify(nextProps.ourTeam) !== JSON.stringify(prevState.ourTeam)) {
                state.ourTeam = nextProps.ourTeam;
            }
            if (nextProps.formSubmitted !== prevState.formSubmitted) {
                state.formSubmitted = nextProps.formSubmitted;
            }
            return state;
        }
        return null;
    }

    getRows = () => {
        const { ourTeam, formSubmitted } = this.state;
        if (ourTeam.length > 0) {
            const rows = ourTeam.map((member, i) => {
                let imageElement;
                const { picture, validations } = member;
                if (picture !== null && typeof picture.url !== 'undefined') {
                    imageElement = (
                        <React.Fragment>
                            <div className="row">
                                <div className="col-12">
                                    <img src={picture.url} alt={picture.reference} className="img-thumbnail" />
                                </div>
                            </div>
                            <div className="row mt-1">
                                <div className="col-12">
                                    <div className="float-right">
                                        <button type="button" className="btn btn-sm btn-danger" onClick={() => this.props.onDeletePictureBtnClicked(i)}>x</button>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    );
                } else if (picture !== null && typeof picture.type !== 'undefined' && picture.type.indexOf('image') !== -1) {
                    const url = URL.createObjectURL(picture);
                    imageElement = (
                        <React.Fragment>
                            <div className="row">
                                <div className="col-12">
                                    <img src={url} alt={member.name} className="img-thumbnail" />
                                </div>
                                <div className="row mt-1">
                                    <div className="col-12">
                                        <div className="float-right">
                                            <button type="button" className="btn btn-sm btn-danger" onClick={() => this.props.onDeletePictureBtnClicked(i)}>x</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    );
                } else if (picture === null) {
                    imageElement = (
                        <React.Fragment>
                            <label htmlFor="picture-upload" className="custom-file-upload">
                                <i className="fa fa-image"></i> Select
                            </label>
                            <input id="picture-upload" type="file" accept="image/*" onChange={this.props.onImageChanged.bind(this, i)} />
                        </React.Fragment>
                    );
                }
                return (
                    <tr key={`member-${i}`} data-id={i}>
                        <td colSpan="15%">
                            <input type="text" className="form-control" value={member.name} onChange={this.props.onNameChanged.bind(this, i)} />
                            {(typeof validations !== 'undefined' && typeof validations.name !== 'undefined' && formSubmitted === true) && (
                                <small className="text-danger">{validations.name}</small>
                            )}
                        </td>
                        <td colSpan="15%">
                            <input type="text" className="form-control" value={member.title} onChange={this.props.onTitleChanged.bind(this, i)} />
                            {(typeof validations !== 'undefined' && typeof validations.title !== 'undefined' && formSubmitted === true) && (
                                <small className="text-danger">{validations.title}</small>
                            )}
                        </td>
                        <td colSpan="40%">
                            <textarea className="form-control" value={member.description} onChange={this.props.onDescriptionChanged.bind(this, i)} rows="10" style={{resize: 'none'}}/>
                            {(typeof validations !== 'undefined' && typeof validations.description !== 'undefined' && formSubmitted === true) && (
                                <small className="text-danger">{validations.description}</small>
                            )}
                        </td>
                        <td colSpan="20%" style={{ height: 100, width: 100 }}>
                            <div className="row">
                                <div className="col-12">
                                    {imageElement}
                                </div>
                            </div>
                            {(typeof validations !== 'undefined' && typeof validations.picture !== 'undefined' && formSubmitted === true) &&  (
                                <small className="text-danger">{validations.picture}</small>
                            )}
                        </td>
                        <td colSpan="10%">
                            {ourTeam.length > 1 && (
                                <button type="button" className="btn btn-sm btn-danger" onClick={() => this.props.onDeleteBtnClicked(i)}>x</button>
                            )}
                        </td>
                    </tr>
                );
            });
            return rows;
        }
        return null;
    }

    handleSortChange = (order, sortable, event) => {
        const { newIndex, oldIndex } = event;
        const { ourTeam } = this.state;
        const tempMember = ourTeam[oldIndex];
        ourTeam[oldIndex] = ourTeam[newIndex];
        ourTeam[newIndex] = tempMember;
        this.props.onSortEnd(ourTeam);
    }

    render() {
        return (
            <Sortable tag="tbody" onChange={this.handleSortChange}>{this.getRows()}</Sortable>
        );
    }
}

export default SortableOurTeamRows;