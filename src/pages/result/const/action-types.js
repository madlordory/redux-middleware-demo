/**
 * Created by madlord on 2016/12/12.
 */
import {AsyncAction} from 'async-action-middleware'

const APP ={
    APP_INIT:'APP_INIT'
}

export default {
    ...APP,
    LOAD_INIT_DATA:new AsyncAction("LOAD_INIT_DATA"),
};


