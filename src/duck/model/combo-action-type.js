/**
 * Created by madlord on 2017/1/22.
 */
"use strict";
import __map from 'lodash/map';
import SyncActionType from './sync-action-type';
import {SpecTypes} from './const'
export default class ComboActionType extends SyncActionType{
    constructor (typeName, cfg) {
        super(typeName,cfg);
    }

    config(cfg) {
        super.config(cfg);
        this.spec=SpecTypes.COMBO;
        this.TYPES=this.generateSubActionTypes(this.TYPE);
        this.TYPES&&__map(this.TYPES,(type,key)=>{
            this[key]=type;
        })
    }

    validateActionType(actionType) {
        return actionType&&actionType.spec&&SpecTypes.COMBO.isMe(actionType.spec);
    }

    after(actionType_array) {
        actionType_array=this.processActionTypeArray(actionType_array);
        this.TYPES&&__map(this.TYPES,(self_actionType,type)=>{
            actionType_array&&__map(actionType_array,(actionType)=>{
                actionType&&actionType[type]&&self_actionType.after(actionType[type])
            });
        })

    }

    before(actionType_array) {
        actionType_array=this.processActionTypeArray(actionType_array);
        this.TYPES&&__map(this.TYPES,(self_actionType,type)=>{
            actionType_array&&__map(actionType_array,(actionType)=>{
                actionType&&actionType[type]&&self_actionType.before(actionType[type])
            });
        })

    }

    generateSubActionTypes () {
        //TO OVERRIDE
    }

    createAction() {
        throw new Error("You could not create action from Combo Action Type!");
    }
}

