/**
 * Created by madlord on 2016/12/19.
 */
import TaskAction,{runnable} from './task-action';
import envApi from '@lib/api/common/env';
import guide_api from '@lib/api/guide';
"use strict";
@runnable
export default class InitDataTask2 extends TaskAction {

    task () {
        return new Promise((resolve, reject) => {
            Promise.all([envApi.getToken(), envApi.getQuery()]).then(([token, query]) => {
                return guide_api.getInitData(token, query && query.ownerId || '').then((result) => {
                    resolve(result);
                })
            }).catch(reject);
        })
    }
}