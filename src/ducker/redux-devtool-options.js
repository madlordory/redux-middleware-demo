/**
 * Created by madlord on 2017/1/13.
 */
"use strict";
import {BaseActionType} from './action-type';
export const reduxDevToolOption={
    // Specify here name, actionsBlacklist, actionsCreators and other options
    "actionSanitizer":(action)=>{
        if (action&&action.type&&BaseActionType.isMyInstance(action.type)) {
            let type=action.type.toString();
            action["@@"+action.type.TYPE]=action.type;
            action.type=type;
        }
        return action;
    },
    serialize: {
        options: {
            undefined: true,
        }
    }
}