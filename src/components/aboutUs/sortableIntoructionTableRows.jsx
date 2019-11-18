import React, { Component } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import SortablePictureList from '../miscellaneous/sortablePictureList';

const SortableItem = SortableElement(({value, index, myIndex, onDeleteBtnClicked, onDeletePictureBtnClicked, onTitleChanged, onDescriptionChanged, uploadBtnClicked, onImageChanged}) => {
    let imageElement;
    const { picture, validations } = value;
    if (picture !== null && typeof picture.url !== 'undefined') {
        imageElement = (
            <React.Fragment>
                <div className="row">
                    <div className="col-12">
                        <img src={picture.url} alt={picture.reference} className="img-fluid" />
                    </div>
                    <div className="row mt-1">
                        <div className="col-6">
                            <div className="float-left">
                                <button className="btn btn-sm btn-danger" onClick={() => onDeletePictureBtnClicked(myIndex)} />
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    } else if (picture !== null && typeof picture === 'object' && typeof picture.url === 'undefined' && typeof picture.reference === 'undefined') {
        const objectURL = URL.createObjectURL(value.picture);
        imageElement = (
            <React.Fragment>
                <div className="row">
                    <div className="col-12">
                        <img src={objectURL} alt={value.title} className="img-fluid" />
                    </div>
                    <div className="row mt-1">
                        <div className="col-6">
                            <div className="float-left">
                                <button className="btn btn-sm btn-danger" onClick={() => onDeletePictureBtnClicked(myIndex)} />
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    } else if (picture === null) {
        imageElement = (
            <React.Fragment>
                <button type="button" className="btn btn-sm btn-success" onClick={uploadBtnClicked}><i className="fa fa-image"></i>{` Select Image`}</button>
                <input id="picture-upload" type="file" accept="image/*" onChange={onImageChanged.bind(this, myIndex)} />
            </React.Fragment>
        );
    }
    return (
        <tr>
            <td colSpan="5%"><i className="fa fa-bars"></i></td>
            <td colSpan="10%">
                <input type="text" className="form-control" value={value.title} onChange={onTitleChanged.bind(this, myIndex)} />
                {typeof validations.title !== 'undefined' && (
                    <span className="text-danger">{validations.title}</span>
                )}
            </td>
            <td colSpan="40%">
                <textarea className="form-control" value={value.description} onChange={onDescriptionChanged.bind(this, myIndex)} rows="10" style={{resize: 'none'}}></textarea>
                {typeof validations.description !== 'undefined' && (
                    <span className="text-danger">{validations.description}</span>
                )}
            </td>
            <td colSpan="25%">
                <div className="row">
                    <div className="col-12">
                        {imageElement}
                    </div>
                </div>
                {typeof validations.picture !== 'undefined' && (
                    <span className="text-danger">{validations.picture}</span>
                )}
            </td>
            <td colSpan="10%">
                <button className="btn btn-sm btn-danger" onClick={() => onDeleteBtnClicked(myIndex)}>Delete</button>
            </td>
        </tr>
    );
});

const SortableList = SortableContainer(({items, onDeleteBtnClicked, onDeletePictureBtnClicked, onImageChanged, uploadBtnClicked, onTitleChanged, onDescriptionChanged}) => {
    return (
        <React.Fragment>
            {items.map((value, index) => {
                return <SortableItem 
                        key={`item-${index}`} 
                        myIndex={index} 
                        index={index} 
                        value={value} 
                        onDeleteBtnClicked={onDeleteBtnClicked.bind(this)} 
                        onDeletePictureBtnClicked={onDeletePictureBtnClicked.bind(this)}
                        uploadBtnClicked={uploadBtnClicked}
                        onImageChanged={onImageChanged.bind(this)}
                        onTitleChanged={onTitleChanged.bind(this)}
                        onDescriptionChanged={onDescriptionChanged.bind(this)}
                        />;
            })}
        </React.Fragment>
    )
});

class SortableIntroductionTableRows extends Component {
    constructor(props) {
        super(props);
        console.log(props);
    }

    state = {
        introductions: this.props.introductions,
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        let hasUpdated = false;
        const state = prevState;
        if (JSON.stringify(nextProps.introductions !== JSON.stringify(prevState.introduction))) {
            state.introductions = nextProps.introductions;
            hasUpdated = true;
        }
        if (hasUpdated === true)
            return state;
        return null;
    }

    onSortEnd = ({prevIndex, nextIndex}) => {
        const { introductions } = this.state;
        if (introductions.length > 1) {
            const tempIntroduction = introductions[prevIndex];
            introductions.splice(prevIndex, 1);
            SortablePictureList.splice(nextIndex, 0, tempIntroduction);
            this.props.onSortEnd(introductions);
        }
    }

    render() {
        const { introductions } = this.state;
        return <SortableList 
                items={introductions}
                onSortEnd={this.onSortEnd} 
                onDeleteBtnClicked={this.props.onDeleteBtnClicked.bind(this)} 
                onDeletePictureBtnClicked={this.props.onDeletePictureBtnClicked.bind(this)}
                onImageChanged={this.props.onImageChanged.bind(this)}
                uploadBtnClicked={this.props.uploadBtnClicked}
                onTitleChanged={this.props.onTitleChanged.bind(this)}
                onDescriptionChanged={this.props.onDescriptionChanged.bind(this)}
                />;
    }
}

export default SortableIntroductionTableRows;