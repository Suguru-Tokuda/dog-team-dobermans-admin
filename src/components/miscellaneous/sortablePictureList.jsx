import React, { Component } from 'react';
import Sortable from 'react-sortablejs';

class SortablePictureList extends Component {
    state = {
        pictures: []
    };

    constructor(props) {
        super(props);
        this.state.pictures = props.pictures;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (JSON.stringify(nextProps.pictures) !== JSON.stringify(prevState.pictures)) {
            return { pictures: nextProps };
        }
        return null;
    }

    getPictures = () => {
        const { pictures } = this.state;
        if (pictures.length > 0) {
            const pictureGrids = pictures.map((picture, i) => {
                return (
                    <div key={`picture-${i}`} className="grid-square">
                         <div className="row">
                             <div className="col-12">
                                 <img src={picture.url} alt={picture.reference} className="img-fluid" />
                             </div>
                         </div>
                         <div className="row mt-1">
                             <div className="col-12">
                                 <div className="float-right">
                                     <button className="btn btn-sm btn-danger" onClick={() => this.props.onDeletePictureBtnClicked(i)}>x</button>
                                 </div>
                             </div>
                         </div>
                    </div>
                );
            });
            return pictureGrids;
        } else {
            return null;
        }
    }

    handleSortChange = (order, sortable, event) => {
        const { newIndex, oldIndex } = event;
        const { pictures } = this.state;
        const tempPicture = pictures[oldIndex];
        pictures[oldIndex] = pictures[newIndex];
        pictures[newIndex] = tempPicture;
        this.props.onSortEnd(pictures);
    }

    render() {
        return (
            <Sortable tag="div" style={{columns: 3, listStyle: 'none'}} onChange={this.handleSortChange}>{this.getPictures()}</Sortable>
        )
    }
}

export default SortablePictureList;