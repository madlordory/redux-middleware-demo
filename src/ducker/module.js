/**
 * Created by madlord on 2017/1/17.
 */
"use strict";
import React, {Component, PropTypes} from 'react';
import {bindActionCreators as originalBindActionCreator,} from 'redux';
import __map from "lodash/map";
const ActionTypeSpec={
    SYNC:parseInt('1',2),
    COMBO:parseInt('10',2)
};

const ActionTypeSpecHelper={
    compose:(...specs)=>{
        let result=0;
        specs&&__map(specs,(spec)=>{
            result=spec|result;
        })
        return result;
    },
    has:(source,target)=>{
        return source==(source|target);
    },
    isSyncActionType:(actionType)=>{
        return actionType&&actionType.spec&&ActionTypeSpecHelper.has(actionType.spec,ActionTypeSpec.SYNC);
    },
    isComboActionType:(actionType)=>{
        return actionType&&actionType.spec&&ActionTypeSpecHelper.has(actionType.spec,ActionTypeSpec.COMBO);
    }
}
const moduleHelper = (moduleName) => {
    const createSyncActionType = (typeName, cfg) => {
        const {payloadCreator = (p => p), after = [], before = []}=cfg || {};
        const after_q=[],before_q=[];
        const TYPE = moduleName + '#' + typeName;
        const _after=(ar)=>{
            if (!(ar instanceof Array)) {
                ar=[ar];
            }
            after_q.push(...ar);
        };
        const _before=(ar)=>{
            if (!(ar instanceof Array)) {
                ar=[ar];
            }
            before_q.push(...ar);
        };
        _after(after);
        _before(before);
        const actionType={
            TYPE,
            spec:ActionTypeSpec.SYNC,
            getType:()=>actionType,
            createAction: (...data) => (dispatch, getState) => {
                let action = {
                    type: TYPE,
                }

                if (data && data.length) {
                    action['payload'] = payloadCreator(...data)
                }


                __map(before_q, (ActionType) => {
                    if (ActionTypeSpecHelper.isSyncActionType(ActionType)) {
                        dispatch(ActionType.createAction(...data));
                    } else {
                        throw new Error("should Specify an SyncAction before an SyncAction dispatch");
                    }
                })

                dispatch(action);

                __map(after_q, (ActionType) => {
                    if (ActionTypeSpecHelper.isSyncActionType(ActionType)) {
                        dispatch(ActionType.createAction(...data));
                    } else {
                        throw new Error("should Specify an SyncAction after an SyncAction dispatch");
                    }
                })
            },
            after:_after,
            before:_before
        }
        return actionType;
    };

    const createComboActionType = (typeName, cfg) => {
        const {createActionTypes}=cfg||{};
        const actionTypes= createActionTypes&&typeof createActionTypes=='function'&&createActionTypes(typeName);
        const getType=()=>actionTypes;
        return {
            spec:ActionTypeSpec.COMBO,
            ...actionTypes,
            getType
        }
    }

    const hof_bind=(target)=>(typeName, cfg,...rest) =>{
        let {bind}=cfg||{};

        const targetActionType= target(typeName, cfg,...rest);

        const _bind=(bind)=>{
            if (bind) {
                if (!(bind instanceof Array)) {
                    bind=[bind];
                }

                __map(bind,(actionType)=>{
                    if (ActionTypeSpecHelper.isSyncActionType(targetActionType)&&ActionTypeSpecHelper.isSyncActionType(actionType)) {
                        targetActionType.after(actionType);
                    } else if (ActionTypeSpecHelper.isComboActionType(targetActionType)&&ActionTypeSpecHelper.isComboActionType(actionType)) {
                        const t_actionTypes=targetActionType&&targetActionType.getType();
                        t_actionTypes&&__map(t_actionTypes,(t_actionType,name)=>{
                            if (name&&actionType&&actionType[name]) {
                                t_actionType.after(actionType[name]);
                            }
                        });
                    }
                });
            }
        };
        _bind(bind);
        return {
            ...targetActionType,
            bind:_bind
        };
    }

    const createAsyncActionType = (typeName, cfg) => {

        const actionType=hof_bind(createComboActionType)(typeName,{
            createActionTypes:(typeName)=>{
                const START = createSyncActionType(typeName + "::" + "START", cfg);
                const STOP = createSyncActionType(typeName + "::" + "STOP");
                const SUCCESS = createSyncActionType(typeName + "::" + "SUCCESS", {after: [STOP]});
                const ERROR = createSyncActionType(typeName + "::" + "ERROR", {after: [STOP]});
                return {
                        START,
                        STOP,
                        SUCCESS,
                        ERROR
                }
            },
            ...cfg
        })

        return {
            ...actionType,
            createAction: actionType.START.createAction,
        }
    };

    const wrapAction = (action) => {
        let _action = {
            ...action,
            meta: {
                ...action.meta,
                "module": moduleName
            }
        };
        return _action;
    }


    const wrapDispatch = (dispatch) => {
        const wrappedDispatch = (action) => {
            let wrappedAction;
            if (typeof action === 'function') {
                wrappedAction = (globalDispatch, getState, extraArgument) =>
                    action(wrappedDispatch, getState, globalDispatch, extraArgument);
            } else if (typeof action === 'object') {
                wrappedAction = wrapAction(action);
            }
            return dispatch(wrappedAction);
        };

        return wrappedDispatch;
    }

    const bindActionCreators = (actionCreators, dispatch, reducerKey) => {
        const wrappedDispatch = wrapDispatch(dispatch, reducerKey);
        return originalBindActionCreator(actionCreators, wrappedDispatch);
    }


    const bindHandler = (initialState, config = {}) => {
        let watchers = {}, reducers = {};
        config && __map(config, ({watcher, reducer}, type) => {
            watcher && (watchers[type] = watcher);
            reducer && (reducers[type] = reducer);
        });

        const reducer = (state=initialState, action) => {
            if (action && action.type && reducers[action.type] && typeof reducers[action.type] === "function") {
                return reducers[action.type](state, action)
            }
            return state;
        };


        const middleware = (getState, dispatch, action) => {
            if (action && action.type && watchers[action.type] && typeof watchers[action.type] === "function") {
                // let as = __get(action, "meta.as");
                return watchers[action.type](getState, wrapDispatch(dispatch), action)
            }
        }
        return {
            moduleName,
            reducer,
            middleware,
            bindActionCreators
        };
    }

    return {
        createSyncActionType,
        createComboActionType,
        createAsyncActionType,
        bindHandler,
        bindActionCreators,
    }
}
export const bindView=(cb)=>(factory)=>{
    return (_moduleName)=>{
        const m=factory(_moduleName);
        const {moduleName,TYPES,bindActionCreators}=m;
        let view=null;
        if (cb&&typeof cb=="function") {
            view=cb({moduleName,
                TYPES,
                bindActionCreators
            });
        } else {
            throw new Error("createModule must specify callback function ")
        }
        return {
            ...m,
            view
        }
    }
};
export default moduleHelper;