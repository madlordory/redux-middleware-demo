/**
 * Created by madlord on 2016/12/15.
 */
"use strict";
import Hippo from '@dp/hippo';
import ACTION_TYPE from '../const/action-types';
let allMiddlewares=[];
export const addMiddleware=(middleware)=>{
    allMiddlewares.push(middleware);
};
export default ({getState,dispatch})=>next=>action=> {
    allMiddlewares.map((middleware)=> {
        if (middleware && typeof middleware === "function") {
            middleware(getState, dispatch, action);
        }
    });
    return next(action);
}