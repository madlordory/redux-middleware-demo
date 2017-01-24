/**
 * Created by madlord on 2016/12/19.
 */
import Task, {runnable} from './task';
import envApi from '@lib/api/common/env';
import guide_api from '@lib/api/result';
import getTokenTask from './get-token-task'
"use strict";

// @typical
// @runnable
export default class InitDataTask_1 extends Task {

    static ACTION_TYPES = {
        PROGRESS: "PROGRESS"
    };

    doTask(run, dispatch, getState,params) {
        return new Promise((resolve, reject) => {
            Promise.all([run(new getTokenTask()), envApi.getQuery()]).then(([token, query]) => {
                return guide_api.getInitData(token, query && query.ownerId || '').then((result) => {
                    dispatch({
                        type: InitDataTask_1.ACTION_TYPES.PROGRESS
                    });
                    resolve(result);
                })
            }).catch(reject);
        })
    }
}