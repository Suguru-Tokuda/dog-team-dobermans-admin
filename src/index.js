import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import '@coreui/coreui/dist/css/coreui.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'font-awesome/css/font-awesome.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'jquery';
import 'jquery-ui';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@coreui/coreui';

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
