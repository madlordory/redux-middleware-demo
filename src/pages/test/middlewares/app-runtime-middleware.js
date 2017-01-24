/**
 * Created by madlord on 2016/12/15.
 */
"use strict";

import Task,{TaskAction,runnable} from '../task/task';

export default ({getState, dispatch}) => next => action => {
    if (false&&TaskAction.isMyInstance(action)) {
        next(action);
        let taskAction=action;
        let {type,tasks}=taskAction;
        if (tasks&&tasks instanceof Array) {
            let promises=[];
            tasks.map(({task,params})=>{
                if (task&&Task.isMe(task)){
                    task=runnable(task);
                    let taskIns=new task({
                        dispatch,
                        getState,
                        params,
                        triggerBy:action
                    });
                    let promise=taskIns.run().catch(e=>{
                        console.error(e)
                    });
                    promises.push(promise);
                }
            })

            if (promises&&promises.length==1) {
                return promises[0];
            } else {
                return Promise.all(promises).catch(e=>{
                    console.error(e)
                });
            }
        }

    } else if (Task.isMyInstance(action)) {
        let task=action;
        task.init({
            dispatch,
            getState
        });
        task=runnable(task);

        return task.run().catch(e=>{
            console.error(e)
        });
    } else {
        return next(action);
    }


}