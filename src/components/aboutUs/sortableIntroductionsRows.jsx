import React, { Component } from 'react';
import Sortable from 'react-sortablejs';

class SortableIntroductionRows extends Component {
    state = {
        introductions: []
    };

    constructor(props) {
        super(props);
        this.state.introductions = props.introductions;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (JSON.stringify(nextProps.introductions) !== JSON.stringify(prevState.introductions)) {
            return { introductions: nextProps.introductions };
        }
        return null;
    }

    getRows = () => {
        const { introductions } = this.state;
        if (introductions.length > 0) {
            const rows = introductions.map((introduction, i) => {
                let imageElement;
                const { picture, validations } = introduction;
                if (picture !== null && typeof picture.url !== 'undefined') {
                    imageElement = (
                        <React.Fragment>
                            <div className="row">
                                <div className="col-12">
                                    <img src={picture.url} alt={picture.reference} className="img-fluid" />
                                </div>
                            </div>
                            <div className="row mt-1">
                                <div className="col-6">
                                    <div className="float-left">
                                        <button className="btn btn-sm btn-danger" onClick={() => this.props.onDeletePictureBtnClicked(i)} >-</button>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    );
                } else if (picture !== null && typeof picture === 'object' && typeof picture.url === 'undefined' && picture.reference === 'undefined') {
                    const url = URL.createObjectURL(picture);
                    imageElement = (
                        <React.Fragment>
                            <div className="row">
                                <div className="col-12">
                                    <img src={url} alt={introduction.title} className="img-fluid" />
                                </div>
                            </div>
                            <div className="row mt-1">
                                <div className="col-6">
                                    <div className="float-right">
                                        <button className="btn btn-sm btn-danger" onClick={() => this.props.onDeletePictureBtnClicked(i)}>-</button>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    )
                } else if (picture === null) {
                    imageElement = (
                        <React.Fragment>
                            <label htmlFor="picture-upload" className="custom-file-upload">
                                <i className="fa fa-image"></i> Select
                            </label>
                            <input id="picture-upload" type="file" accept="image/*" onChange={this.props.onImageChanged.bind(this, i)} />
                        </React.Fragment>
                    )
                }
                return (
                    <tr key={`intro-${i}`} data-id={i}>
                        <td colSpan="5%"><i className="fa fa-bars"></i></td>
                        <td colSpan="10%">
                            <input type="text" className="form-control" value={introduction.title} onChange={this.props.onTitleChanged.bind(this, i)} />
                            {typeof validations.title !== 'undefined' && (
                                <small className="text-danger">{validations.title}</small>
                            )}
                        </td>
                        <td colSpan="40%">
                            <textarea className="form-control" value={introduction.description} onChange={this.props.onDescriptionChanged.bind(this, i)} rows="10" style={{resize: 'none'}}/>
                            {typeof validations.description !== 'undefined' && (
                                <small className="text-danger">{validations.description}</small>
                            )}
                        </td>
                        <td colSpan="25%">
                            <div className="row">
                                <div className="col-12">
                                    {imageElement}
                                </div>
                            </div>
                            {typeof validations.picture !== 'undefined' && (
                                <small className="text-danger">{validations.picture}</small>
                            )}
                        </td>
                        <td colSpan="10%">
                            {introductions.length > 1 && (
                                <button className="btn btn-sm btn-danger" onClick={() => this.props.onDeleteBtnClickd(i)}>-</button>
                            )}
                        </td>
                    </tr>
                )
            });
            return rows;
        }
        return null;
    }

    handleSortChange = (order, sortable, event) => {
        const { newIndex, oldIndex } = event;
        const { introductions } = this.state;
        const tempIntro = introductions[oldIndex];
        introductions[oldIndex] = introductions[newIndex];
        introductions[newIndex] = tempIntro;
        this.props.onSortEnd(introductions);
    }

    render() {
        return (
            <Sortable tag="tbody" onChange={this.handleSortChange}>{this.getRows()}</Sortable>
        )
    }
}

export default SortableIntroductionRows;