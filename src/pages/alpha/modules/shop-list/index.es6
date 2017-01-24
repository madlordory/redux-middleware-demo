/**
 * Created by madlord on 2017/1/16.
 */
"use strict"
import {connect} from 'react-redux';
import React, {Component, PropTypes} from 'react';
import TuanList from './view/tuan-list';
import moduleHelper,{bindView} from 'ducker/module-helper';
import {App} from '../index';

/*
 *
 *
 *
 * */


const  moduleCreator = (moduleName) => {
    const mh = moduleHelper(moduleName);
    const initialState = {
        result: 0,
        loading: false
    }

    const TYPES = {
        "VIEW_DID_MOUNT": mh.createSyncActionType("VIEW_DID_MOUNT"),
        "SUBMIT": mh.createAsyncActionType("SUBMIT",{
            bind:App.TYPES.LOADING
        }),
    }

    const module=mh.bindHandler(initialState, {
        [TYPES.VIEW_DID_MOUNT.TYPE]: {},
        [TYPES.SUBMIT.START.TYPE]: {
            watcher: (getState, dispatch, action) => {
                let data = action.payload;
                setTimeout(() => {
                    dispatch(TYPES.SUBMIT.SUCCESS.createAction(data))
                }, 2000)
            }
        },
        [TYPES.SUBMIT.SUCCESS.TYPE]: {
            reducer: (state = initialState, action) => {
                return {
                    ...state,
                    result: action && action.payload,
                }
            }
        },

    });

    return {
        ...module,
        TYPES,
    }
};

export default bindView(({moduleName,TYPES,bindActionCreators})=>{
    return connect((state) => {
        state = state[moduleName] || {};
        return {
            result: state.result,
            loading: state.loading,
            //...state
        }

    }, (dispatch) => bindActionCreators({
        "viewDidMount": TYPES.VIEW_DID_MOUNT.createAction,
        "submit": TYPES.SUBMIT.createAction
    }, dispatch))(TuanList);
})(moduleCreator);


