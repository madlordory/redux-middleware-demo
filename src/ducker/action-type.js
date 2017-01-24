/**
 * Created by madlord on 2017/1/13.
 */
"use strict";
import __map from "lodash/map";
import __isString from "lodash/isString";
export class BaseActionType {
    constructor(name) {
        if (__isString(name)) {
            this.name = name;
        } else {
            throw new Error("SyncActionType name must be String")
        }
    }

    TYPE=Object.getPrototypeOf(this).constructor.name

    toString() {
        return this.name;
    }



    static isMyInstance(action) {
        return action instanceof  BaseActionType;
    }
}

export class FakeActionType extends BaseActionType {
    constructor(name) {
        super(name);
    }

    createAction=(refAction)=> {
        return {
            type: this,
            triggerBy:refAction
        }
    }

    static isMyInstance(action) {
        return action instanceof  FakeActionType;
    }
}

export class SyncActionType extends BaseActionType{
    constructor(name, config) {
        super(name);
        this.config(config||{});
    }

    config(cfg) {
        const {payloadCreator,before,after}=cfg || {};
        this._={...this._||{},
            payloadCreator: payloadCreator||(p=>p),
            before:before||[],
            after:after||[]
        };
    }


    createAction=(moduleInsName,...data)=> {
        return (dispatch, getState) => {
            let action={
                type: this,
                module:moduleInsName
            }

            if (data&&data.length) {
                action['payload']=this._.payloadCreator(...data)
            }

            __map(this._.before,(type)=>{
                if (type&&FakeActionType.isMyInstance(type)) {
                    dispatch(type.createAction(action));
                } else {
                    throw new Error("actionType is not a FakeActionType");
                }
            })
            dispatch(action);
            __map(this._.after,(type)=>{
                if (type&&FakeActionType.isMyInstance(type)) {
                    dispatch(type.createAction(action));
                } else {
                    throw new Error("actionType is not a FakeActionType");
                }
            })
        };
    }

    static isMyInstance(action) {
        return action instanceof  SyncActionType;
    }
}

export class AsyncActionType extends SyncActionType {
    constructor(name, config) {
        super(name, config);
        this._=this._||{};
        const STOP=new FakeActionType(this.name + "::STOP");
        const SUCCESS=new SyncActionType(this.name + "::SUCCESS",{after:[STOP]});
        const ERROR=new SyncActionType(this.name + "::ERROR",{after:[STOP]});
        this._.defaultTypes={
            STOP,
            SUCCESS,
            ERROR
        }
        this.config(config);
    }

    toString() {
        return this.name+"::START"
    }

    config(cfg) {
        super.config(cfg);
        const {extraTypes}=cfg || {};
        this._=this._||{};
        this._.allTypes = {...this._.defaultTypes, ...extraTypes};
        for (let name in this._.allTypes) {
            this[name] = this._.allTypes[name]
        }
    }

    get AllSubTypes() {
        return this._.allTypes;
    }
}
