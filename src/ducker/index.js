/**
 * Created by madlord on 2017/1/13.
 */
"use strict";
export {BaseActionType,FakeActionType,SyncActionType,AsyncActionType} from "./action-type";
import {SyncActionType} from './action-type';

export {reduxDevToolOption} from "./redux-devtool-options";
import __map from "lodash/map";
import {addMiddleware} from './middleware'
export {middleware} from './middleware'
import {createStore as originCreateStore,combineReducers} from 'redux';
export const BASIC_TYPES={
    ANY:new SyncActionType("ANY")
}
const reducers={};
export const registerModules=(modules)=>{
    // const modules=[tuanListMod]
    modules&&__map(modules,({middleware,reducer,moduleName})=>{
        // if (!middleware||!reducer) throw new Error("ducker module error");
        if (!moduleName) throw new Error("the property \"moduleName\" of ducker module must be specified");
        middleware&&addMiddleware(middleware);
        if (reducers[moduleName]) throw new Error("moduleName of ducker module ["+moduleName+"] is duplicated");
        addReducer({
            [moduleName]:reducer
        })
    });
    regenerateReducer();
}

let store;

export const createStore=(...param)=>{
    store=originCreateStore(regenerateReducer(),...param);
    return store;
};
const regenerateReducer=()=>{
    if (store) {
        store.replaceReducer(combineReducers(reducers));
    } else {
       return combineReducers(reducers);
    }
};

export const addReducer=(reducerMap)=>{
    reducerMap&&__map(reducerMap,(reducer,name)=>{
        if (reducers[name])  throw new Error("name of reducer  ["+name+"] is duplicated");
        reducers[name]=reducer;
    })
};

export const removeReducer=(reducerNameAr)=>{
    if (typeof reducerNameAr =='string') {
        reducerNameAr=[reducerNameAr];
    }
    reducerNameAr&&__map(reducerNameAr,(name)=>{
        if (reducers[name]) {
            delete reducers[name];
        }
    })
};
export default function ducker(moduleName,initialState,array) {
    let watchers = new Map();
    let reducers = new Map();
    array && array.map(({type, watcher, reducer}) => {

        if (watcher) {
            watchers.set(type, watcher);
        }

        if (reducer) {
            reducers.set(type, reducer);
        }
    });

    let middleware = (getState, dispatch, action) => {
        if (watchers.get(BASIC_TYPES.ANY)) {
            watchers.get(BASIC_TYPES.ANY)(getState, dispatch, action)
        }
        if (action && action.type && watchers.has(action.type) && typeof reducers.get(action.type) === "function") {
            return watchers.get(action.type)(getState, dispatch, action)
        }
    }

    let reducer = (state = initialState, action) => {
        let result=state;
        if (reducers.get(BASIC_TYPES.ANY)) {
            result=reducers.get(BASIC_TYPES.ANY)(result, action);
        }
        if (action && action.type && reducers.has(action.type) && typeof reducers.get(action.type) === "function") {
            result=reducers.get(action.type)(result, action);
        }
        return result;
    }

    return {
        moduleName,
        middleware,
        reducer
    }

}

