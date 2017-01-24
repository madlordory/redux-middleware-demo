"use strict";
import guide_api from '@lib/api/result';
import SHARE from '@lib/api/common/share';
import ACTION_TYPE from '../const/action-types';
import {Toast} from 'rc-toast';
import envApi from '@lib/api/common/env';
// import Promise from 'promise';


export const initApp = () => (dispatch, getState) => {

    /*
     * 初始化分享配置
     *
     * */
    dispatch({
        type:ACTION_TYPE.APP_INIT
    })

    SHARE.config({
        title: '分享测试',
        desc: '【大众点评分享测试】',
        url: 'http://m.dianping.com/mobile/event/list?source=mShare',
        image: 'http://j1.s2.dpfile.com/s/i/app/activity/share1127.png',
        content: '测试文案'
    });

    // dispatch(queryInitData());


}


export const queryInitData = () => (dispatch, getState) => {
    dispatch({
        type: ACTION_TYPE.LOAD_INIT_DATA,
        promise: new Promise((resolve, reject) => {
            Promise.all([envApi.getToken(), envApi.getQuery()]).then(([token, query]) => {
                return guide_api.getInitData(token, query && query.ownerId || '').then((result) => {
                    resolve(result);
                })
            }).catch(reject);
        })
    });
}