/**
 * Created by madlord on 2016/12/19.
 */
import TaskAction,{runnable} from './task-action';
import envApi from '@lib/api/common/env';
import guide_api from '@lib/api/result';
"use strict";

@runnable
export default class InitDataTask extends TaskAction {

    static STATUS={
        ...TaskAction.STATUS,
        PROGRESS:"PROGRESS"
    };
    task (run,dispatch,getState) {
        return new Promise((resolve, reject) => {
            Promise.all([envApi.getToken(), envApi.getQuery()]).then(([token, query]) => {
                return guide_api.getInitData(token, query && query.ownerId || '').then((result) => {
                    resolve(result);
                    dispatch({
                        type:InitDataTask.STATUS.PROGRESS
                    });
                })
            }).catch(reject);
        })
    }
}