/**
 * Created by madlord on 2016/12/15.
 */
"use strict"
// import Promise from 'promise';
const cache={};
const cacheHelper=(KEY,getter,disableCache=false)=>{
    if (!disableCache&&KEY in cache) {
        return Promise.resolve(cache[KEY]);
    } else {
        let promise=getter();
        promise.then((result)=>{
            cache[KEY]=result;
        });
        return promise;
    }
}

export default cacheHelper;