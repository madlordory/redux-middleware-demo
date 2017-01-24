/**
 * Created by madlord on 2017/1/22.
 */
"use strict";
import __map from 'lodash/map';
import __set from 'lodash/set';
import {bindActionCreators as originalBindActionCreator,} from 'redux';

export default class Module {
    constructor(moduleName) {
        this.moduleName = moduleName;
        this.TYPES = this.generateTypes();
        this.VIEW = this.generateView(this.moduleName, this.TYPES, this.bindActionCreators);
        this.bindHandler(this.generateHandler(this.TYPES));
    }

    initialState = {}
    TYPES = {}

    VIEW = null;
    watchers = {}
    reducers = {}


    wrapDispatch = (dispatch) => {
        const wrappedDispatch = (action) => {
            let wrappedAction;
            if (typeof action === 'function') {
                wrappedAction = (globalDispatch, getState, extraArgument) =>
                    action(wrappedDispatch, getState, globalDispatch, extraArgument);
            } else if (typeof action === 'object') {
                wrappedAction={
                    ...action
                }
                __set(wrappedAction,"meta.module",this.moduleName);
            }
            return dispatch(wrappedAction);
        };

        return wrappedDispatch;
    }

    bindActionCreators = (actionCreators, dispatch, reducerKey) => {
        const wrappedDispatch = this.wrapDispatch(dispatch, reducerKey);
        return originalBindActionCreator(actionCreators, wrappedDispatch);
    }

    reducer = (state = this.initialState, action) => {
        if (action && action.type && this.reducers[action.type] && typeof this.reducers[action.type] === "function") {
            return this.reducers[action.type](state, action)
        }
        return state;
    }
    middleware = (getState, dispatch, action) => {
        if (action && action.type && this.watchers[action.type] && typeof this.watchers[action.type] === "function") {
            return this.watchers[action.type](getState, this.wrapDispatch(dispatch), action)
        }
    }

    bindHandler(config = {}) {
        config && __map(config, ({watcher, reducer}, type) => {
            watcher && (this.watchers[type] = watcher);
            reducer && (this.reducers[type] = reducer);
        });
    }

    generateHandler(TYPES) {
        //TO OVERRIDE
    }

    generateTypes() {
        //TO OVERRIDE
    }

    generateView() {
        //TO OVERRIDE
    }

    bindView(cb) {
        if (cb&&typeof cb=="function") {
            return cb(this);
        } else {
            throw new Error("bind view Error!");
        }
    }
}