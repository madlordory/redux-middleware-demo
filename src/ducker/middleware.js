/**
 * Created by madlord on 2016/12/15.
 */
"use strict";
let allMiddlewares=[];
export const addMiddleware=(middleware)=>{
    allMiddlewares.push(middleware);
};
export const middleware =({getState,dispatch})=>next=>action=> {
    allMiddlewares.map((middleware)=> {
        if (middleware && typeof middleware === "function") {
            middleware(getState, dispatch, action);
        }
    });
    return next(action);
}