import React from 'react';
import ReactDOM from 'react-dom';
import SetterContainer from './containers/SetterContainer';
import firebase from 'firebase';
import { createStore } from 'redux'
import { Provider } from 'react-redux';

import setterAPP from './reducer/reducer';
import {firebaseConfig} from './config/firebaseConfig';
import './assets/style/index.css';
import './assets/style/animate.css';

let store = createStore(setterAPP);
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
    <Provider store={store}>
        <SetterContainer />
    </Provider>
, document.getElementById('root'));

