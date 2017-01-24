/**
 * Created by madlord on 2016/12/20.
 */
"use strict" ;
import mixin from 'core-decorators/lib/mixin';
import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';

export default class Task {

    static ACTION_TYPES = {
        "START": "START",
        "SUCCESS": "SUCCESS",
        "ERROR": "ERROR",
        "END": "END"
    };
    static BASE_ACTION_TYPES = {
        "START": "START",
        "SUCCESS": "SUCCESS",
        "ERROR": "ERROR",
        "END": "END"
    };
    _internal = {
        triggerBy: null,
        dispatch: null,
        getState: null,
        params: {}
    };

    constructor(params) {
        this.init(params||{});
        let target=Object.getPrototypeOf(this).constructor;
        let ACTION_TYPES = {
            ...target.BASE_ACTION_TYPES,
            ...target.ACTION_TYPES
        };
        if (ACTION_TYPES) {
            // let _status={}
            for (let key in ACTION_TYPES) {
                target.ACTION_TYPES[key] = target.name + "::" + ACTION_TYPES[key]
            }
            // target.STATUS=_status;
        };
    }

    init({triggerBy = null, dispatch = null, getState = null, params = null}) {
        this._internal.triggerBy = triggerBy || this._internal.triggerBy;
        this._internal.dispatch = dispatch || this._internal.dispatch;
        this._internal.getState = getState || this._internal.getState;
        this._internal.params = params || this._internal.params;
    }

    doTask(run, dispatch, getState) {
        return Promise.resolve();
    }

    static isMe(taskCls) {
        return Object.getPrototypeOf(taskCls) == Task;
    }

    static isMyInstance(task) {
        return task instanceof Task;
    }

    static couldIRun(task) {
        return task._internal && task._internal.dispatch && task._internal.getState;
    }
}

export class TaskAction {
    constructor({tasks, type}) {
        let taskPairs=TaskAction.getTaskPairs(tasks);
        if (!taskPairs) {
            throw new Error("task error!");
        }

        return {
            tasks:taskPairs,//格式可为 Task,[Task,Task...],[{task:Task,params:{}}},{task:Task,params:{}}...]
            type,
        }
    }

    static getTaskPairs(tasks) {
        function getTaskPair(value) {
            let pair=null;
            if (value&&isPlainObject(value)) {
                let {task, params}=value;
                if ((task && Task.isMe(task))) {
                    pair={task,params};
                }
            } else if ((value && Task.isMe(value))) {
                pair={
                    task:value,
                    params:{}
                };
            }
            return pair;
        }
        let result;
        if (tasks && isArray(tasks)) {
            let ohShit = false;
            result=tasks.map((value) => {
                let pair=getTaskPair(value);
                if (!pair) {
                    ohShit = true;
                } else {
                    return pair;
                }
            });
            return (!ohShit)&&result||null;
        }

        result=getTaskPair(tasks);
        return result&&[result]||null;
    }



    static isMyInstance(action) {
        let {tasks, type}=action;
        return tasks && type && TaskAction.getTaskPairs(tasks);
    }
}
// export function typical(target) {
//     target.TYPE = target.name;
//     let ACTION_TYPES = {
//         ...target.ACTION_TYPES,
//         ...target.BASE_ACTION_TYPES
//     };
//     if (ACTION_TYPES) {
//         // let _status={}
//         for (let key in ACTION_TYPES) {
//             target.ACTION_TYPES[key] = target.TYPE + "::" + ACTION_TYPES[key]
//         }
//         // target.STATUS=_status;
//     };
//     return target;
// }

export function runnable(target,key,descriptor) {
    const props={
        start() {
            this.dispatch({
                type: this.constructor.ACTION_TYPES.START,
            });
        },

        end() {
            this.dispatch({
                type: this.constructor.ACTION_TYPES.END,
            });
        },
        run (task = null) {
            let taskShouldRun;
            if (!task) {
                //run self
                taskShouldRun = this;
            } else {
                //run sub task
                taskShouldRun = task;
            }

            if (!Task.isMyInstance(taskShouldRun)) {
                throw new Error("It's not a Task");
            }

            if (!Task.couldIRun(taskShouldRun)) {
                throw new Error("The Task could not run");
            }

            taskShouldRun.constructor=runnable(taskShouldRun.constructor);

            taskShouldRun.start();

            return taskShouldRun.doTask((task)=>{
                task.init({
                    triggerBy:this,
                    dispatch:this._internal.dispatch,
                    getState:this._internal.getState
                })
                return taskShouldRun.run(task);
            }, (action) => {
                // let status=action.type;
                // action.type=this.Class.TYPE+"::"+status;
                this.dispatch(action);
            }, ::this.getState, this._internal.params).then((result) => {
                taskShouldRun.dispatch({
                    type: taskShouldRun.constructor.ACTION_TYPES.SUCCESS,
                    data: result
                });
                taskShouldRun.end();
                return Promise.resolve(result);
            }, (reject) => {
                taskShouldRun.dispatch({
                    type: taskShouldRun.constructor.ACTION_TYPES.ERROR,
                    error: reject
                });
                taskShouldRun.end();
                return Promise.reject(reject);
            })
        },


        dispatch (action) {
            let {type}=action;
            let typeIncluded = false;
            if (this.constructor.ACTION_TYPES) {
                for (let key in this.constructor.ACTION_TYPES) {
                    let TYPE = this.constructor.ACTION_TYPES[key];
                    if (type == TYPE) {
                        typeIncluded = true;
                        break;
                    }
                }
            }

            if (!typeIncluded) {
                throw new Error('action type :[' + action.type + "] is not included in ACTION_TYPES:"+JSON.stringify(this.constructor.ACTION_TYPES));
            }

            if (this._internal.dispatch && typeof this._internal.dispatch == 'function') {
                action.task=this;
                const getPath=(task,pathAr)=> {
                    if (task&&task._internal&&task._internal.triggerBy) {
                        let parentAction=task._internal.triggerBy;
                        pathAr.unshift(parentAction);

                        getPath(parentAction,pathAr);
                    }
                };
                let allTask=[];
                getPath(this,allTask);
                allTask.push(action);
                action.path=allTask.map(task=>(task.type||Task.isMyInstance(task)&&task.constructor.TYPE||"UNKNOW_TYPE")).join("->");

                return this._internal.dispatch(action);
            } else {
                throw new Error("no dispatch instance");
            }
        },

        getState () {
            if (this._getState && typeof this._getState == 'function') {
                return this._getState();
            } else {
                throw new Error("no getState instance");
            }
        }
    };
    if (Task.isMe(target)) {
        mixin(props)(target);
    } else if (Task.isMyInstance(target)) {
        let _class=Object.getPrototypeOf(target);
        mixin(props)(_class.constructor);
    }


    return target;
}