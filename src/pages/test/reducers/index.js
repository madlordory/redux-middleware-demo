"use strict"
import ACTION_TYPE from '../const/action-types';
import InitDataTask from '../task/init-data-task';
import InitDataTask1 from '../task/init-data-task-1';
const DEFAULT_INIT_STATE={
    lucky_count:0,//默认值
    lucky_info:[],
    token:null,
    loading:false,
    platform:'OTHER'
};

export default (state=DEFAULT_INIT_STATE,action)=>{

    switch (action.type) {
        case ACTION_TYPE.LOAD_INIT_DATA:
            console.log(action.type);
            break;
        case InitDataTask1.ACTION_TYPES.START:
            return {
                ...state,
                loading:true
            };
            break;
        case InitDataTask1.ACTION_TYPES.SUCCESS:
            return {
                ...state,
                loading:false,
                data:action.data.lucky_count
            };
            break;
        case InitDataTask1.ACTION_TYPES.END:
            return {
                ...state,
                loading:false
            };
            break;
        default:
            return state;
    }
    return state;
}