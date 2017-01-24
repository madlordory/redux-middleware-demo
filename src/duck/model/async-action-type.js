/**
 * Created by madlord on 2017/1/22.
 */
"use strict";

import ComboActionType from './combo-action-type';
import SyncActionType from './sync-action-type';
export default class AsyncActionType extends ComboActionType{
    constructor(typeName, cfg) {
        super(typeName,cfg);
    }

    generateSubActionTypes () {
        //TO OVERRIDE

        const START = new SyncActionType(this.TYPE + "::" + "START");
        const STOP = new SyncActionType(this.TYPE + "::" + "STOP");
        const SUCCESS = new SyncActionType(this.TYPE + "::" + "SUCCESS", {after: [STOP]});
        const ERROR = new SyncActionType(this.TYPE + "::" + "ERROR", {after: [STOP]});
        return {
            START,
            STOP,
            SUCCESS,
            ERROR
        }
    }

    createAction=this.START.createAction;
}