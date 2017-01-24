/**
 * Created by madlord on 2017/1/22.
 */
"use strict";
// import __map from 'lodash/map';
import {SpecTypes} from './const';
export default class ActionType {
    constructor(typeName,cfg) {
        this.TYPE = typeName;
        this.spec=SpecTypes.BASIC;
        this.config(cfg);
    }

    config(cfg) {
        this.cfg=cfg||{};
        const {payloadCreator = this.payloadCreator}=this.cfg;
        this.payloadCreator=payloadCreator;
    }




    payloadCreator = (p => p);


    createAction= (...data) => (dispatch, getState) => {
        let action = {
            type: this.TYPE,
        }

        if (data && data.length) {
            action['payload'] = this.payloadCreator(...data)
        }

        dispatch(action);

    }

}