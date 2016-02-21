'use strict';

//import polyfill from 'babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk';

import DevTools from './js/devtools';
import App from './js/app';
import ETApp from './js/reducers/reducers';

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware
)(createStore);

let store = createStoreWithMiddleware(ETApp, DevTools.instrument());

ReactDOM.render((
  <Provider store={store}>
    <div>
      <App></App>
      {/*<DevTools></DevTools>*/}
    </div>
  </Provider>
), document.getElementById('app'));