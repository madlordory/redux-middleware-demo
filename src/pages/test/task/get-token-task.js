/**
 * Created by madlord on 2016/12/19.
 */
import Task from './task';
import envApi from '@lib/api/common/env';
"use strict";

// @typical
export default class getTokenTask extends Task {
    doTask(run, dispatch, getState,params) {
        return envApi.getToken()
    }
}