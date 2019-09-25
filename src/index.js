import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './css/coreui-dark.css';
import 'toastr/build/toastr.min.css';
import 'font-awesome/css/font-awesome.css';
import 'react-datepicker/dist/react-datepicker.css';
import './index.css';
import 'jquery';
import 'jquery-ui';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'toastr/build/toastr.min.js';
import '@coreui/coreui';

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
