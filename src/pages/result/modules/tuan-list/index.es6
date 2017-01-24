/**
 * Created by madlord on 2017/1/10.
 */
"use strict"
import TuanList from './view/tuan-list';
import {connect} from 'react-redux';
import ducker,{SyncActionType,AsyncActionType} from 'ducker';


const initialState = {
    result: 0,
    loading: false
}

export const TYPES = {
    "APP_INIT": new SyncActionType("APP_INIT"),
    "VIEW_DID_MOUNT": new SyncActionType("VIEW_DID_MOUNT"),
    "VIEW_WILL_UNMOUNT": new SyncActionType("VIEW_WILL_UNMOUNT"),
    "SUBMIT": new AsyncActionType("SUBMIT"),
}

export const {moduleName,actions, middleware, reducer}=ducker("TuanListModule",initialState,[
        {
            type: TYPES.APP_INIT,
            watcher: (getState, dispatch, action) => {

            },
            reducer: (state = initialState, action) => {
                return {
                    ...state,
                    a: action && action.a
                }
            }
        },
        {
            type: TYPES.SUBMIT,
            watcher: (getState, dispatch, action) => {
                let data = action.payload;
                setTimeout(() => {
                    dispatch(TYPES.SUBMIT.SUCCESS.createAction(data))
                }, 2000)
            },
            reducer: (state = initialState, action) => {
                return {
                    ...state,
                    loading: true
                }
            }
        },
        {
            type: TYPES.SUBMIT.SUCCESS,
            reducer: (state = initialState, action) => {
                return {
                    ...state,
                    result: action && action.payload,
                }
            }
        },
        {
            type: TYPES.SUBMIT.STOP,
            reducer: (state = initialState, action) => {
                return {
                    ...state,
                    loading: false
                }
            }
        },
    ]
);

export default connect((state) => ({
    result: state.result,
    loading: state.loading,
    //...state
}), {
    viewDidMount: TYPES.VIEW_DID_MOUNT.createAction,
    submit: TYPES.SUBMIT.createAction
})(TuanList);