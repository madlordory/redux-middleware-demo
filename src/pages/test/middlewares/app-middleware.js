/**
 * Created by madlord on 2016/12/15.
 */
"use strict";

import {isAsyncAction} from 'async-action-middleware';
import InitDataTask from '../task/init-data-task';
import InitDataTask11 from '../task/init-data-task-1';
import InitData2Task from '../task/init-data2-task';
import TaskAction,{Command} from '../task/task-action';
import ACTION_TYPE from '../const/action-types';
//middleware;
export default ({getState, dispatch}) => next => action => {
    let a = next(action)
    if (action && action.type) {
        switch (action.type) {
            case ACTION_TYPE.APP_INIT:
                // console.log(InitDataTask.type)
                // dispatch(new InitDataTask({parent:action}));
                // dispatch(new InitData2Task({parent:action}));
                // dispatch(new InitDataTask11({triggerBy:action}));
                break;
            default:
                break;
        }
    }
    return a;

}