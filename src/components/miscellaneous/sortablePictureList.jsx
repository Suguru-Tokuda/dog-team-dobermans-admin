import React, { Component } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

const SortableItem = SortableElement(({value, index, myIndex, onDeletePictureBtnClicked}) => {
    return (
        <div className="col-3">
            <div className="row">
                <div className="col-12">
                    <img src={value.url} alt={value.reference} className="img-fluid" />
                </div>
            </div>
            <div className="row mt-1">
                <div className="col-6">
                    <div className="float-left">
                        <button className="btn btn-sm btn-danger" onClick={() => onDeletePictureBtnClicked(myIndex)}>x</button>
                    </div>
                </div>
            </div>
        </div>
    );
});
const SortableList = SortableContainer(({items, onDeletePictureBtnClicked}) => {
    return (
        <div className="row">
            {items.map((value, index) => {
               return <SortableItem key={`item-${index}`} myIndex={index} index={index} value={value} onDeletePictureBtnClicked={onDeletePictureBtnClicked.bind(this)} />;
            })}
        </div>
    );
});

class SortablePictureList extends Component {
    state = {
        pictures: this.props.pictures
    };

    onSortEnd = ({oldIndex, newIndex}) => {
        const pictures = this.state.pictures;
        const tempPicture = this.state.pictures[oldIndex];
        pictures.splice(oldIndex, 1);
        pictures.splice(newIndex, 0, tempPicture);
        this.setState({ pictures });
        this.props.onSortEnd(pictures);
    }

    render() {
        return (
            <div className="col-12">
                <SortableList items={this.state.pictures} onSortEnd={this.onSortEnd} onDeletePictureBtnClicked={this.props.onDeletePictureBtnClicked.bind(this)} />
            </div>
        );
    }

}

export default SortablePictureList;