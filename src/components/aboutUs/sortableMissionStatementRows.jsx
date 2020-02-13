import React, { Component } from 'react';
import Sortable from 'react-sortablejs';
import $ from 'jquery';

class SortableMissionStatementRows extends Component {
    state = {
        missionStatements: [],
        formSubmitted: false
    };

    constructor(props) {
        super(props);
        this.state.missionStatements = props.missionStatements;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (JSON.stringify(nextProps.missionStatements) !== JSON.stringify(prevState.missionStatements) || nextProps.formSubmitted !== prevState.formSubmitted) {
            const state = prevState;
            if (JSON.stringify(nextProps.missionStatements) !== JSON.stringify(prevState.missionStatements)) {
                state.missionStatements = nextProps.missionStatements;
            }
            if (nextProps.formSubmitted !== prevState.formSubmitted) {
                state.formSubmitted = nextProps.formSubmitted;
            }
            return state;
        }
        return null;
    }

    handleSelectImageClicked() {
        $('#picture-upload').click();
    }

    getRows = () => {
        const { missionStatements, formSubmitted } = this.state;
        if (missionStatements.length > 0) {
            const rows = missionStatements.map((missionStatement, i) => {
                let imageElement;
                const { picture, validations } = missionStatement;
                if (picture !== null && typeof picture.url !== 'undefined') {
                    imageElement = (
                        <React.Fragment>
                            <div className="row">
                                <div className="col-12">
                                    <img src={picture.url} alt={picture.reference} className="img-fluid" />
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
                                    <img src={url} alt={missionStatement.title} className="img-fluid" />
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
                } else if (picture === null) {
                    imageElement = (
                        <React.Fragment>
                            <button type="button" className="btn btn-primary" onClick={this.handleSelectImageClicked}><i className="fa fa-picture-o"></i> Select</button>
                            <input id="picture-upload" type="file" accept="image/*" onChange={this.props.onImageChanged.bind(this, i)} />
                        </React.Fragment>
                    );
                }
                return (
                    <tr key={`intro-${i}`} data-id={i}>
                        <td colSpan="10%">
                            <input type="text" className="form-control" value={missionStatement.title} onChange={this.props.onTitleChanged.bind(this, i)} />
                            {(typeof validations !== 'undefined' && typeof validations.title !== 'undefined' && formSubmitted === true) && (
                                <small className="text-danger">{validations.title}</small>
                            )}
                        </td>
                        <td colSpan="40%">
                            <textarea className="form-control" value={missionStatement.description} onChange={this.props.onDescriptionChanged.bind(this, i)} rows="10" style={{resize: 'none'}}/>
                            {(typeof validations !== 'undefined' && typeof validations.description !== 'undefined' && formSubmitted === true) && (
                                <small className="text-danger">{validations.description}</small>
                            )}
                        </td>
                        <td colSpan="5%" style={{ height: 100, width: 100 }}>
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
                            {missionStatements.length > 1 && (
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
        const { missionStatements } = this.state;
        const tempIntro = missionStatements[oldIndex];
        missionStatements[oldIndex] = missionStatements[newIndex];
        missionStatements[newIndex] = tempIntro;
        this.props.onSortEnd(missionStatements);
    }

    render() {
        return (
            <Sortable tag="tbody" onChange={this.handleSortChange}>{this.getRows()}</Sortable>
        );
    }
}

export default SortableMissionStatementRows;