/**
 * Created by madlord on 2016/12/15.
 */
"use strict";
import Hippo from '@dp/hippo';
import ACTION_TYPE from '../const/action-types';
export default ({getState,dispatch})=>next=>action=> {
    if (action&&action.type) {
        switch (action.type) {
            case ACTION_TYPE.APP_INIT:
                _hip.push(['_setPageId', 123456789]);
                _hip.push(['pv']);
                break;
            default:
                break;
        }
    }
    return next(action);
}