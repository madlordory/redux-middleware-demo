/**
 * Created by madlord on 2017/1/16.
 */
"use strict"
import {connect} from 'react-redux';
import React, {Component, PropTypes} from 'react';
import App from './view/index';
import moduleHelper,{bindView} from 'ducker/module-helper';


/*
 *
 *
 *
 * */


const  moduleCreator = (moduleName="App") => {
    const mh = moduleHelper(moduleName);
    const initialState = {
        loading: false
    }

    const TYPES = {
        "APP_INIT": mh.createSyncActionType("APP_INIT"),
        "LOADING":mh.createComboActionType("LOADING",{
            createActionTypes:(actionType)=>{
                return {
                    "START":mh.createSyncActionType(actionType+"::"+"START"),
                    "STOP":mh.createSyncActionType(actionType+"::"+"STOP")
                }
            }
        }),
    }

    const module=mh.bindHandler(initialState, {
        [TYPES.LOADING.START.TYPE]: {
            reducer: (state = initialState, action) => {
                return {
                    ...state,
                    loading: true
                }
            }
        },
        [TYPES.LOADING.STOP.TYPE]: {
            reducer: (state = initialState, action) => {
                return {
                    ...state,
                    loading: false
                }
            }
        }
    })

    return {
        ...module,
        TYPES
    }
};

export default bindView(({moduleName,TYPES,bindActionCreators})=>{
    return connect((state) => {
        state = state[moduleName] || {};
        return {
            loading: state.loading,
            //...state
        }

    }, (dispatch) => bindActionCreators({
        "init": TYPES.APP_INIT.createAction,
    }, dispatch))(App);
})(moduleCreator);


