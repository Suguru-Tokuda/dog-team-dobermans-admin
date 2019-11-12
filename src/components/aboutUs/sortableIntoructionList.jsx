import React, { Component } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

const SortableItem = SortableElement(({value, index, myIndex, onDeleteBtnClicked, onDeletePictureBtnClicked}) => {
    return (
        <tr>
            <td>{value.title}</td>
            <td>{value.description}</td>
            <td>
                <div className="row">
                    <div className="col-12">
                        {typeof value.url !== 'undefined' && (
                            <img src={value.url} alt={value.reference} className="img-fluid" />
                        )}
                    </div>
                </div>
            </td>
            <td>
                <button className="btn btn-sm btn-danger" onClick={() => onDeleteBtnClicked(myIndex)}>Delete</button>
            </td>
        </tr>
    );
});

const SortableList = SortableContainer(({items, onDeleteBtnClicked, onDeletePictureBtnClicked}) => {
    return (
        <React.Fragment>
            {items.map((vlaue, index) => {
                return <SortableItem key={`item-${index}`} myIndex={index} index={index} value={value} onDeleteBtnClicked={onDeleteBtnClicked.bind(this)} onDeletePictureBtnClicked={onDeletePictureBtnClicked.bind(this)} />;
            })}
        </React.Fragment>
    )
});

class SortableIntroductionList extends Component {
    state = {
        introductions: this.props.introductions
    };

    onSortEnd = ({oldIndex, newIndex}) => {
        // TODO
    }
    render() {
        const { introductions } = this.state;
        return <SortableList items={introductions} onSortEnd={this.onSortEnd} onDeleteBtnClicked={this.props.onDeleteBtnClicked.bind(this)} onDeletePictureBtnClicked={this.props.onDeletePictureBtnClicked.bind(this)} />;
    }
}

export default SortableIntroductionList;