/**
 * Created by madlord on 16/5/4.
 */
"use strict";

import React from 'react';
import ReactDom from 'react-dom';
import {createStore, applyMiddleware,combineReducers} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import App from './containers/app/';
import reducer from './reducers';
import {initApp} from './actions';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import hippoMiddleware from './middlewares/hippo-middleware';
import * as tuanListMod from './modules/tuan-list/index';
import * as CommonMod from './modules/common';
import {reduxDevToolOption,middleware as ducksMiddleware,registerModules} from 'ducker';
const composeEnhancers = composeWithDevTools(reduxDevToolOption);



const store = createStore(
    combineReducers(registerModules([CommonMod,tuanListMod])),
    composeEnhancers(applyMiddleware(thunk,hippoMiddleware,ducksMiddleware))
);
ReactDom.render(
    <Provider store={store}>
        <App/>
    </Provider>
    , document.getElementById('app'));
