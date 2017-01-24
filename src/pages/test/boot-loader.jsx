/**
 * Created by madlord on 16/5/4.
 */
import React from 'react';
import ReactDom from 'react-dom';
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import App from './containers/app/';
import reducer from './reducers';
import {initApp} from './actions';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import asyncMiddleware from 'async-action-middleware';
import hippoMiddleware from './middlewares/hippo-middleware';
import appMiddleware from './middlewares/app-middleware';
import appRunTimeMiddleware from './middlewares/app-runtime-middleware';

const composeEnhancers = composeWithDevTools({
    // Specify here name, actionsBlacklist, actionsCreators and other options
});


const middleware = [appRunTimeMiddleware,thunk,hippoMiddleware,asyncMiddleware];

const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(...middleware))

);
store.dispatch(initApp());

ReactDom.render(
    <Provider store={store}>
        <App/>
    </Provider>
    , document.getElementById('app'));
