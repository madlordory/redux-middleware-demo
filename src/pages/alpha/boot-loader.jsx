/**
 * Created by madlord on 16/5/4.
 */
"use strict";

import React from 'react';
import ReactDom from 'react-dom';
import {applyMiddleware,combineReducers} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import AppContent from './containers/app/';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import hippoMiddleware from './middlewares/hippo-middleware';
import * as CommonMod from './modules/common';
import {App} from './modules';
import {reduxDevToolOption,middleware as ducksMiddleware,registerModules,createStore} from 'ducker';
const composeEnhancers = composeWithDevTools(reduxDevToolOption);



const store = createStore(
    composeEnhancers(applyMiddleware(thunk,hippoMiddleware,ducksMiddleware))
);


ReactDom.render(
    <Provider store={store}>
        <App.VIEW>
            <AppContent/>
        </App.VIEW>
    </Provider>
    , document.getElementById('app'));
