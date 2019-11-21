import React, { Component } from 'react';
import $ from 'jquery';
// import 'jquery-ui';
// import 'jquery-sortable';

class SortableIntroductionTableRows_jquery extends Component {
    state = {
        introductions: []
    };

    constructor(props) {
        super(props);
        this.state.introductions = props.introductions;
    }

    componentDidMount() {
        $(document).ready(() => {
            console.log($('.sorted_table'));
        })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (JSON.stringify(nextProps.introductions) !== JSON.stringify(prevState.introductions)) {
            return { introductions: nextProps.introductions };
        }
        return null;
    }

    getTableRows() {
        const { introductions } = this.state;
        if (introductions.length > 0) {
            const rows = introductions.map((introduction, i) => {
                return (
                    <tr key={`introduction-${i}`}>
                        <td>
                            <input type="text" className="form-control" />
                        </td>
                    </tr>
                );
            });
            return rows;
        }
        return null;
    }

    render() {
        const { introductions } = this.state;
        return (
            <div className="table-responsive">
                <table className="table table-bordered sorted_table">
                    <thead>
                        <tr>
                            <th>Title</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.getTableRows()}
                        {introductions.length <= 4 && (
                            <tr>
                                <td>
                                    <button className="btn btn-success" onClick={this.props.onAddBtnClicked}>+</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default SortableIntroductionTableRows_jquery;