"use strict"
import ACTION_TYPE from '../const/action-types';
const DEFAULT_INIT_STATE={
    lucky_count:0,//默认值
    lucky_info:[],
    token:null,
    loading:false,
    platform:'OTHER'
};

export default (state=DEFAULT_INIT_STATE,action)=>{
    switch (action.type) {
        case ACTION_TYPE.LOAD_INIT_DATA.PENDING:
            return {
                ...state,
                loading:true
            };
            break;
        case ACTION_TYPE.LOAD_INIT_DATA.FULFILLED:
            return {
                ...state,
                data:action.data.lucky_count,
                loading:false
            };
            break;
        case ACTION_TYPE.LOAD_INIT_DATA.REJECTED:
            return {
                ...state,
                loading:false
            };
            break;
        default:
            return state;
    }
}