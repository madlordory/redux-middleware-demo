/**
 * Created by madlord on 2017/1/22.
 */
"use strict";
import __map from 'lodash/map';
import __get from 'lodash/get';
import {SpecTypes} from './const';
import ActionType from './action-type';
export default class SyncActionType extends ActionType{
    constructor(typeName, cfg) {
        super(typeName,cfg);
        this.after(__get(this.cfg,'after',[]));
        this.before(__get(this.cfg,'before',[]));
    }


    validateActionType(actionType) {
        return actionType&&actionType.spec&&SpecTypes.BASIC.isMe(actionType.spec);
    }

    processActionTypeArray(actionType_array) {
        if (!(actionType_array instanceof Array)) {
            actionType_array = [actionType_array];
        }
        let flag=true;
        __map(actionType_array,(actionType)=>{
            flag=flag&&this.validateActionType(actionType);
        });
        if (!flag) throw new Error("should Specify an SyncAction when invoke before/after function");
        return actionType_array;
    }

    after(actionType_array) {
        this.after_q = this.after_q||[];
        this.after_q.push(...this.processActionTypeArray(actionType_array));
    };

    before(actionType_array) {
        this.before_q = this.before_q||[];
        this.before_q.push(...this.processActionTypeArray(actionType_array));
    };


    createAction= (...data) => (dispatch, getState) => {
        let action = {
            type: this.TYPE,
        }

        if (data && data.length) {
            action['payload'] = this.payloadCreator(...data)
        }


        this.before_q&&__map(this.before_q, (ActionType) => {
            if (this.validateActionType(ActionType)) {
                const _action=ActionType.createAction(...data)
                _action.before=action;
                dispatch(_action);
            } else {
                throw new Error("should Specify an SyncAction before an SyncAction dispatch");
            }
        })

        dispatch(action);

        this.after_q&&__map(this.after_q, (ActionType) => {
            if (this.validateActionType(ActionType)) {
                const _action=ActionType.createAction(...data)
                _action.after=action;
                dispatch(_action);
            } else {
                throw new Error("should Specify an SyncAction after an SyncAction dispatch");
            }
        })
    }

}