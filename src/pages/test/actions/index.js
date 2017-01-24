"use strict";
import SHARE from '@lib/api/common/share';
import ACTION_TYPE from '../const/action-types';
import {Toast} from 'rc-toast';
// import Promise from 'promise';
import {TaskAction} from '../task/task'
import InitDataTask from '../task/init-data-task-1'

export const initApp = () => (dispatch, getState) => {

    /*
     * 初始化分享配置
     *
     * */
    // dispatch(new InitDataTask({
    //     params: {
    //         timeout: 1000
    //     }
    // })).then((r)=>{
    //     console.log(r)
    // })

    dispatch(queryInitData());


    SHARE.config({
        title: '分享测试',
        desc: '【大众点评分享测试】',
        url: 'http://m.dianping.com/mobile/event/list?source=mShare',
        image: 'http://j1.s2.dpfile.com/s/i/app/activity/share1127.png',
        content: '测试文案 '
    });


}


export const queryInitData = () => (dispatch, getState) => {
    dispatch({
        type: ACTION_TYPE.LOAD_INIT_DATA,
    });
}