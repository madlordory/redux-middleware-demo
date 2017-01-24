/**
 * Created by madlord on 2016/12/19.
 */
"use strict";
import mixin from 'core-decorators/lib/mixin';
export default class TaskAction {
    // static id=0;
    // static type="TaskAction";
    static STATUS={
        "START":"START",
        "SUCCESS":"SUCCESS",
        "ERROR":"ERROR",
        "END":"END"
    };
    constructor (prop) {
        this.init(prop);
        // this.uuid=TaskAction.id++;
        // this.type=TaskAction.type+"["+(TaskAction.id++)+"]";
    }

    /*
    * 初始化
    * */
    init({dispatch=null,getState=null,parent=null}) {

        this._parent=parent||this._parent;

        this._dispatch=dispatch||this._dispatch;
        this._getState=getState||this._getState;
    }

    task (run,dispatch,getState) {
        return Promise.resolve();
    }

    static isTaskAction (action) {
        return action instanceof TaskAction;
    }

    static hasInit(action) {
        return action._dispatch&&action._getState;
    }
}

export function runnable(target) {
    mixin({
        get Class () {
            return target
        },
        get route () {
            if (!this._route) {
                if (this._parent) {
                    this._parent.route=this._parent.route||[this._parent.type];
                    this._route=[...this._parent.route,this.Class.TYPE]
                } else {
                    this._route=[this.Class.TYPE];
                }
            }
            return this._route;
        },

        start() {
            this.dispatch({
                type:this.Class.TYPE.START,
                action:this
            });
        },

        end() {
            this.dispatch({
                type:this.Class.TYPE.END,
                action:this
            });
        },
        run (taskAction=null) {
            let taskShouldRun;
            if (!taskAction) {
                //run self
                taskShouldRun=this;
            } else {
                //run sub task
                taskShouldRun=taskAction;
            }

            if (!TaskAction.isTaskAction(taskShouldRun)) {
                throw new Error("It's not a TaskAction");
            }

            if (!TaskAction.hasInit(taskShouldRun)) {
                taskShouldRun.init({
                    dispatch:this._dispatch,
                    getState:this._getState,
                    parent:this._parent});
            }

            this.start();

            return taskShouldRun.task(::this.run,(action)=>{
                // let status=action.type;
                // action.type=this.Class.TYPE+"::"+status;
                this.dispatch(action);
            },::this.getState).then((result)=>{
                this.dispatch({
                    type:this.Class.STATUS.SUCCESS,
                    action:this
                });
                this.end();
                return Promise.resolve(result);
            },(reject)=>{
                this.dispatch({
                    type:this.Class.STATUS.ERROR,
                    action:this
                });
                this.end();
                return Promise.reject(reject);
            })

        },



        dispatch (action) {
            if (this._dispatch&& typeof this._dispatch =='function') {
                action.status=action.type;
                action.type=action.status;
                action.path=this.route.join("->")+'::'+action.status;
                action.timestamp=+new Date();
                return this._dispatch(action);
            } else {
                throw new Error("no dispatch instance");
            }
        },

        getState () {
            if (this._getState&& typeof this._getState =='function') {
                return this._getState();
            } else {
                throw new Error("no getState instance");
            }
        }
    })(target);
    target.TYPE={};
    if (target.STATUS) {
        // let _status={}
        for (let key in target.STATUS) {
            target.TYPE[key]=target.name+"::"+target.STATUS[key]
        }
        // target.STATUS=_status;
    }

    target.TYPE.toString=()=>{
        return target.name;
    }

    return target;
}