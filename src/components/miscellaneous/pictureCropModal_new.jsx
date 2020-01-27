import React, { Component } from 'react';
import Cropper from 'react-cropper';

const cropper = React.createRef(null);

class PictureCropModal_new extends Component {
    state = {
        pictureFile: null,
        crop: { x: 0, y: 0 },
        zoom: 1,
        aspect: 1
    };

    


}

export default PictureCropModal_new;