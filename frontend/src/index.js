import React from 'react';
import ReactDOM from 'react-dom/client';

// import bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import App from './App';
import './style/index.css'

import { Provider } from 'react-redux'
import { videosStore } from './context/redux.store'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={videosStore}>
      {/* <React.StrictMode></React.StrictMode> */}
      <App />
  </Provider>
);

