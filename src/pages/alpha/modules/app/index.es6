/**
 * Created by madlord on 2017/1/16.
 */
"use strict"
import {connect} from 'react-redux';
import React, {Component, PropTypes} from 'react';
import AppView from './view/index';
import moduleHelper,{bindView} from 'ducker/module-helper';
import Module from 'duck/model/module';
import SyncActionType from 'duck/model/sync-action-type.js';
import ComboActionType from 'duck/model/combo-action-type.js';

/*
 *
 *
 *
 * */
class LoadingActionType extends ComboActionType {
    generateSubActionTypes () {
        //TO OVERRIDE

        const START = new SyncActionType(this.TYPE + "::" + "START");
        const STOP = new SyncActionType(this.TYPE + "::" + "STOP");
        return {
            START,
            STOP
        }

    }
}

export default class App extends Module {
    constructor(moduleName="App") {
        super(moduleName)
    }

    initialState = {
        loading: false
    }

    generateHandler(TYPES) {
        //TO OVERRIDE
        return {
            [TYPES.LOADING.START.TYPE]: {
                reducer: (state = this.initialState, action) => {
                    return {
                        ...state,
                        loading: true
                    }
                }
            },
            [TYPES.LOADING.STOP.TYPE]: {
                reducer: (state = this.initialState, action) => {
                    return {
                        ...state,
                        loading: false
                    }
                }
            }
        }
    }

    generateTypes() {
        return {
            "APP_INIT": new SyncActionType("APP_INIT"),
            "LOADING":new LoadingActionType("LOADING"),
        }
    }

    generateView(moduleName, TYPES, bindActionCreators) {
        //TO OVERRIDE

        return connect((state) => {
            state = state[moduleName] || {};
            return {
                loading: state.loading,
                //...state
            }

        }, (dispatch) => bindActionCreators({
            "init": TYPES.APP_INIT.createAction,
        }, dispatch))(AppView);
    }
}


// const  moduleCreator = (moduleName="App") => {
//     const mh = moduleHelper(moduleName);
//     const initialState = {
//         loading: false
//     }
//
//     const TYPES = {
//         "APP_INIT": mh.createSyncActionType("APP_INIT"),
//         "LOADING":mh.createComboActionType("LOADING",{
//             createActionTypes:(actionType)=>{
//                 return {
//                     "START":mh.createSyncActionType(actionType+"::"+"START"),
//                     "STOP":mh.createSyncActionType(actionType+"::"+"STOP")
//                 }
//             }
//         }),
//     }
//
//     const module=mh.bindHandler(initialState, {
//         [TYPES.LOADING.START.TYPE]: {
//             reducer: (state = initialState, action) => {
//                 return {
//                     ...state,
//                     loading: true
//                 }
//             }
//         },
//         [TYPES.LOADING.STOP.TYPE]: {
//             reducer: (state = initialState, action) => {
//                 return {
//                     ...state,
//                     loading: false
//                 }
//             }
//         }
//     })
//
//     return {
//         ...module,
//         TYPES
//     }
// };
//
// export default bindView(({moduleName,TYPES,bindActionCreators})=>{
//     return connect((state) => {
//         state = state[moduleName] || {};
//         return {
//             loading: state.loading,
//             //...state
//         }
//
//     }, (dispatch) => bindActionCreators({
//         "init": TYPES.APP_INIT.createAction,
//     }, dispatch))(App);
// })(moduleCreator);


