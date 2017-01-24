/**
 * Created by madlord on 2017/1/10.
 */
"use strict"
import ducker, {SyncActionType, AsyncActionType,BASIC_TYPES} from 'ducker';


const initialState = {
    appReady: false
}

export const TYPES = {
    "APP_INIT": new SyncActionType("APP_INIT"),
}
let appReady=false;
export const {moduleName, actions, middleware, reducer}=ducker("CommonModule", initialState, [
        {
            type: BASIC_TYPES.ANY,
            watcher: (getState, dispatch, action) => {
                if (!appReady) {
                    appReady=true;
                    dispatch(TYPES.APP_INIT.createAction())
                }
            }
        },
        {
            type: TYPES.APP_INIT,
            reducer:(state = initialState, action) => {
                return {
                    ...state,
                    appReady:true
                }
            }
        }

    ]
);

