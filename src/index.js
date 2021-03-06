import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import allReducer from './reducers';
import '@coreui/coreui/dist/css/coreui.min.css';
import './css/coreui-dark.css';
import 'toastr/build/toastr.min.css';
import 'font-awesome/css/font-awesome.css';
import '@fortawesome/fontawesome-free/css/all.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'cropperjs/dist/cropper.css';
import 'react-image-crop/dist/ReactCrop.css';
import 'react-trumbowyg/dist/trumbowyg.min.css';
import 'react-quill/dist/quill.snow.css'; 
import 'react-quill/dist/quill.bubble.css'; 
import 'react-quill/dist/quill.core.css';
import 'react-image-gallery/styles/css/image-gallery.css';
import 'icheck/skins/all.css';
import './index.css';
import 'jquery';
import 'jquery-ui';
import 'popper.js';
import '@coreui/coreui/dist/js/coreui.bundle';
import 'toastr/build/toastr.min.js';
import 'bootstrap/dist/js/bootstrap.min.js';

const store = createStore(
    allReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
serviceWorker.unregister();
